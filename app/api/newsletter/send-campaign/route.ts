// app/api/newsletter/send-campaign/route.ts
import * as React from "react";
import { Resend } from "resend";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { NewsletterEmailTemplate } from "@/lib/emails/NewsletterEmailTemplate";
import type { BookLaunchRegistration, Subscriber } from "@/payload-types";

// ── CORS (Payload admin is same-origin in prod, but needed in dev) ─────────────
const corsHeaders = {
	"Access-Control-Allow-Origin": process.env.PAYLOAD_ADMIN_CORS || "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ── Tuning ────────────────────────────────────────────────────────────────────
// Resend allows 2 requests/second by default. 600ms keeps us under that.
const SEND_DELAY_MS = 600;
// Retry a rate-limited email a few times before pausing the campaign.
const MAX_RATE_LIMIT_ATTEMPTS = 3;
const RATE_LIMIT_BACKOFF_MS = 2000;
// Cap the stored failure list so the document stays small.
const MAX_STORED_FAILURES = 5000;
const SUBSCRIBER_PAGE_SIZE = 1000;
const MAX_SUBSCRIBER_PAGES = 100;

type LexicalData = Parameters<typeof convertLexicalToHTML>[0]["data"];

type Audience = "subscribers" | "book-launch" | "book-launch-unreminded" | "all";

type Recipient = {
	email: string;
	name: string;
	source: "subscriber" | "book-launch";
	registrationId?: string;
	createdAt: number;
};

type CampaignState = {
	id: string;
	subject?: string | null;
	preheader?: string | null;
	body?: LexicalData | null;
	audience?: Audience | null;
	markReminderSent?: boolean | null;
	status?: "draft" | "paused" | "partial" | "sent" | null;
	sentAt?: string | null;
	sentCount?: number | null;
	attemptedCount?: number | null;
	failedEmails?: unknown;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function errorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (error && typeof error === "object" && "message" in error) {
		return String((error as { message?: unknown }).message ?? "Unknown error");
	}
	return String(error);
}

function isRateLimitError(error: unknown): boolean {
	if (!error) return false;
	if (typeof error === "object") {
		const candidate = error as {
			statusCode?: number | null;
			name?: string | null;
			message?: string | null;
		};
		if (candidate.statusCode === 429) return true;
		if (
			typeof candidate.name === "string" &&
			candidate.name.toLowerCase().includes("rate_limit")
		) {
			return true;
		}
		if (typeof candidate.message === "string") {
			const message = candidate.message.toLowerCase();
			return (
				message.includes("rate limit") ||
				message.includes("too many requests") ||
				message.includes("quota")
			);
		}
	}
	return false;
}

type SendOutcome =
	| { ok: true }
	| { ok: false; rateLimited: boolean; message: string };

// ── Audience loading ──────────────────────────────────────────────────────────

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

const sortRecipients = (recipients: Recipient[]): Recipient[] =>
	recipients.sort(
		(a, b) => a.createdAt - b.createdAt || a.email.localeCompare(b.email),
	);

const dedupeByEmail = (recipients: Recipient[]): Recipient[] => {
	const seen = new Set<string>();
	const unique: Recipient[] = [];

	for (const recipient of recipients) {
		const key = recipient.email.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		unique.push(recipient);
	}

	return unique;
};

async function fetchSubscribers(payload: PayloadClient): Promise<Recipient[]> {
	const recipients: Recipient[] = [];

	for (let page = 1; page <= MAX_SUBSCRIBER_PAGES; page++) {
		const result = await payload.find({
			collection: "subscribers",
			where: { status: { equals: "subscribed" } },
			limit: SUBSCRIBER_PAGE_SIZE,
			page,
			depth: 0,
			// Stable order is required: resume relies on an offset into this list.
			sort: "createdAt",
		});

		for (const subscriber of result.docs as Subscriber[]) {
			recipients.push({
				email: subscriber.email,
				name: subscriber.name?.trim() || "Friend",
				source: "subscriber",
				createdAt: new Date(subscriber.createdAt).getTime(),
			});
		}

		if (!result.hasNextPage) break;
	}

	return recipients;
}

async function fetchRegistrations(
	payload: PayloadClient,
	onlyUnreminded: boolean,
): Promise<Recipient[]> {
	const recipients: Recipient[] = [];

	for (let page = 1; page <= MAX_SUBSCRIBER_PAGES; page++) {
		const result = await payload.find({
			collection: "book-launch-registrations",
			where: onlyUnreminded
				? {
						// Include rows created before the flag existed (NULL) as unreminded.
						or: [
							{ reminderSent: { equals: false } },
							{ reminderSent: { exists: false } },
						],
					}
				: {},
			limit: SUBSCRIBER_PAGE_SIZE,
			page,
			depth: 0,
			sort: "createdAt",
		});

		for (const registration of result.docs as BookLaunchRegistration[]) {
			recipients.push({
				email: registration.email,
				name: registration.fullName?.trim() || "Friend",
				source: "book-launch",
				registrationId: registration.id,
				createdAt: new Date(registration.createdAt).getTime(),
			});
		}

		if (!result.hasNextPage) break;
	}

	return recipients;
}

async function fetchAudience(
	payload: PayloadClient,
	audience: Audience,
): Promise<Recipient[]> {
	if (audience === "subscribers") {
		return sortRecipients(dedupeByEmail(await fetchSubscribers(payload)));
	}

	if (audience === "book-launch") {
		return sortRecipients(dedupeByEmail(await fetchRegistrations(payload, false)));
	}

	if (audience === "book-launch-unreminded") {
		return sortRecipients(dedupeByEmail(await fetchRegistrations(payload, true)));
	}

	// "all" — registrations first so a registration's full name wins over a
	// possibly shorter subscriber name when the same email appears in both.
	const [registrations, subscribers] = await Promise.all([
		fetchRegistrations(payload, false),
		fetchSubscribers(payload),
	]);

	return sortRecipients(dedupeByEmail([...registrations, ...subscribers]));
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function OPTIONS() {
	return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: Request) {
	const payload = await getPayload({ config: configPromise });

	// ── Auth — Payload session, admin role required ──────────────────────────
	const { user } = await payload.auth({ headers: req.headers });
	if (!user) {
		return Response.json(
			{ message: "Unauthorized — please log in to Payload admin" },
			{ status: 401, headers: corsHeaders },
		);
	}
	if ((user as { role?: string }).role !== "admin") {
		return Response.json(
			{ message: "Forbidden — only admins can send campaigns" },
			{ status: 403, headers: corsHeaders },
		);
	}

	// ── Body ─────────────────────────────────────────────────────────────────
	let campaignId: string;
	try {
		const body = (await req.json()) as { campaignId?: unknown };
		if (typeof body.campaignId !== "string" || !body.campaignId) {
			throw new Error("Missing campaignId");
		}
		campaignId = body.campaignId;
	} catch {
		return Response.json({ message: "Invalid request body" }, { status: 400, headers: corsHeaders });
	}

	if (!process.env.RESEND_API_KEY) {
		return Response.json(
			{ message: "RESEND_API_KEY not configured" },
			{ status: 500, headers: corsHeaders },
		);
	}

	// ── Campaign ─────────────────────────────────────────────────────────────
	let campaign: CampaignState;
	try {
		campaign = (await payload.findByID({
			collection: "emailCampaigns",
			id: campaignId,
			depth: 0,
		})) as unknown as CampaignState;
	} catch {
		return Response.json({ message: "Campaign not found" }, { status: 404, headers: corsHeaders });
	}

	if (campaign.status === "sent") {
		return Response.json({ message: "Already sent" }, { status: 409, headers: corsHeaders });
	}

	const bodyHtml = campaign.body
		? convertLexicalToHTML({ data: campaign.body, disableContainer: true })
		: "";
	const bodyText = bodyHtml.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim();
	if (!bodyText && !bodyHtml.includes("<img")) {
		return Response.json(
			{ message: "Campaign body is empty — add content before sending" },
			{ status: 400, headers: corsHeaders },
		);
	}

	// ── Recipients and resume state ──────────────────────────────────────────
	const audience: Audience = campaign.audience ?? "subscribers";
	const recipients = await fetchAudience(payload, audience);
	if (!recipients.length) {
		return Response.json(
			{ message: "No recipients for the selected audience" },
			{ status: 400, headers: corsHeaders },
		);
	}

	// ── Resume state ─────────────────────────────────────────────────────────
	const attemptedCount = Math.max(Number(campaign.attemptedCount) || 0, 0);
	const sentBefore = Math.max(Number(campaign.sentCount) || 0, 0);

	const recipientByEmail = new Map(
		recipients.map((recipient) => [recipient.email.toLowerCase(), recipient]),
	);

	// Ignore stored failures for people who are no longer in the audience.
	const failedBefore = Array.isArray(campaign.failedEmails)
		? campaign.failedEmails.filter(
				(value): value is string =>
					typeof value === "string" &&
					value.length > 0 &&
					recipientByEmail.has(value.toLowerCase()),
			)
		: [];

	// Failures from previous runs are retried first, then the untouched remainder.
	const stillFailed = new Set(failedBefore.map((email) => email.toLowerCase()));
	const retryQueue = [...stillFailed]
		.map((email) => recipientByEmail.get(email))
		.filter((recipient): recipient is Recipient => Boolean(recipient));
	const retryEmails = new Set(retryQueue.map((recipient) => recipient.email.toLowerCase()));

	const remainingQueue = recipients
		.slice(attemptedCount)
		.filter((recipient) => !retryEmails.has(recipient.email.toLowerCase()));

	const resend = new Resend(process.env.RESEND_API_KEY);
	const appUrl = (process.env.APP_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(
		/\/$/,
		"",
	);
	const fromName = process.env.SMTP_FROM_NAME ?? "Spiritans Sound";
	const fromEmail = process.env.SMTP_FROM_EMAIL ?? "";
	const from = `${fromName} <${fromEmail}>`;
	const subject = campaign.subject ?? "(no subject)";

	const sendTo = async (recipient: Recipient): Promise<SendOutcome> => {
		const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(recipient.email)}`;
		// Book launch registrations provide a full name ("John Doe"); subscribers
		// provide whatever name they signed up with.
		const recipientName = recipient.name?.trim() || "Friend";

		for (let attempt = 1; attempt <= MAX_RATE_LIMIT_ATTEMPTS; attempt++) {
			try {
				const { error } = await resend.emails.send({
					from,
					to: recipient.email,
					subject,
					react: React.createElement(NewsletterEmailTemplate, {
						recipientName,
						subject,
						preheader: campaign.preheader ?? undefined,
						bodyHtml,
						unsubscribeUrl,
						senderName: fromName,
					}),
					headers: {
						"List-Unsubscribe": `<${unsubscribeUrl}>`,
						"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
					},
				});

				if (!error) return { ok: true };

				if (isRateLimitError(error)) {
					if (attempt < MAX_RATE_LIMIT_ATTEMPTS) {
						await delay(RATE_LIMIT_BACKOFF_MS * attempt);
						continue;
					}
					return { ok: false, rateLimited: true, message: errorMessage(error) };
				}

				return { ok: false, rateLimited: false, message: errorMessage(error) };
			} catch (error) {
				if (isRateLimitError(error) && attempt < MAX_RATE_LIMIT_ATTEMPTS) {
					await delay(RATE_LIMIT_BACKOFF_MS * attempt);
					continue;
				}
				return {
					ok: false,
					rateLimited: isRateLimitError(error),
					message: errorMessage(error),
				};
			}
		}

		return { ok: false, rateLimited: true, message: "Rate limited" };
	};

	let sentThisRun = 0;
	let newlyAttempted = 0;
	let hitRateLimit = false;
	const remindedRegistrationIds = new Set<string>();

	const markReminded = (recipient: Recipient) => {
		if (
			campaign.markReminderSent &&
			recipient.source === "book-launch" &&
			recipient.registrationId
		) {
			remindedRegistrationIds.add(recipient.registrationId);
		}
	};

	// 1. Retry previous failures. These are already inside `attemptedCount`,
	//    so they must not advance the offset.
	for (const recipient of retryQueue) {
		const outcome = await sendTo(recipient);
		if (outcome.ok) {
			stillFailed.delete(recipient.email.toLowerCase());
			sentThisRun += 1;
			markReminded(recipient);
		} else if (outcome.rateLimited) {
			hitRateLimit = true;
			break;
		} else {
			console.error(`Campaign ${campaignId}: failed to send to ${recipient.email}:`, outcome.message);
		}

		await delay(SEND_DELAY_MS);
	}

	// 2. Send to the untouched remainder, advancing the persisted offset.
	if (!hitRateLimit) {
		for (let index = 0; index < remainingQueue.length; index++) {
			const recipient = remainingQueue[index];
			const outcome = await sendTo(recipient);

			if (!outcome.ok && outcome.rateLimited) {
				hitRateLimit = true;
				break;
			}

			newlyAttempted += 1;
			if (outcome.ok) {
				sentThisRun += 1;
				markReminded(recipient);
			} else {
				stillFailed.add(recipient.email.toLowerCase());
				console.error(
					`Campaign ${campaignId}: failed to send to ${recipient.email}:`,
					outcome.message,
				);
			}

			if (index < remainingQueue.length - 1) await delay(SEND_DELAY_MS);
		}
	}

	// Flip the reminder flag only for registrations that were actually delivered.
	if (remindedRegistrationIds.size) {
		for (const registrationId of remindedRegistrationIds) {
			try {
				await payload.update({
					collection: "book-launch-registrations",
					id: registrationId,
					data: { reminderSent: true },
				});
			} catch (error) {
				console.error(
					`Campaign ${campaignId}: delivered but could not mark registration ${registrationId} as reminded:`,
					errorMessage(error),
				);
			}
		}
	}

	const failedList = [...stillFailed].slice(0, MAX_STORED_FAILURES);
	const status: CampaignState["status"] = hitRateLimit
		? "paused"
		: failedList.length
			? "partial"
			: "sent";

	await payload.update({
		collection: "emailCampaigns",
		id: campaignId,
		data: {
			status,
			sentCount: sentBefore + sentThisRun,
			failedCount: stillFailed.size,
			failedEmails: failedList,
			attemptedCount: attemptedCount + newlyAttempted,
			recipientCount: recipients.length,
			...(status === "sent"
				? { sentAt: campaign.sentAt ?? new Date().toISOString() }
				: {}),
		} as never,
	});

	const totalSentSoFar = sentBefore + sentThisRun;
	const base = {
		status,
		audience,
		paused: status === "paused",
		sent: sentThisRun,
		failed: stillFailed.size,
		totalSentSoFar,
		totalAttempted: attemptedCount + newlyAttempted,
		recipientCount: recipients.length,
	};

	if (status === "paused") {
		return Response.json(
			{
				...base,
				message: `Rate limit reached. ${totalSentSoFar} sent so far — resume to continue.`,
			},
			{ headers: corsHeaders },
		);
	}

	if (status === "partial") {
		return Response.json(
			{
				...base,
				message: `Sent to ${totalSentSoFar}, ${stillFailed.size} failed. Retry to resend only the failures.`,
			},
			{ headers: corsHeaders },
		);
	}

	return Response.json(
		{
			...base,
			message: remainingQueue.length || retryQueue.length
				? `Sent to ${totalSentSoFar} recipient${totalSentSoFar === 1 ? "" : "s"}.`
				: "All recipients were already processed.",
		},
		{ headers: corsHeaders },
	);
}
