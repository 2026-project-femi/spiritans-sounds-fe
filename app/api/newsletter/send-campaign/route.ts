// app/api/send-campaign/route.ts
import * as React from "react";
import { Resend } from "resend";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { NewsletterEmailTemplate } from "@/lib/emails/NewsletterEmailTemplate";
import type { Subscriber } from "@/payload-types";

// ── CORS (Payload admin is same-origin in prod, but needed in dev) ─────────────
const corsHeaders = {
	"Access-Control-Allow-Origin": process.env.PAYLOAD_ADMIN_CORS || "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
	return new Response(null, { status: 204, headers: corsHeaders });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isRateLimitError(error: { statusCode?: number | null; message?: string } | null): boolean {
	if (!error) return false;
	if (error.statusCode === 429) return true;
	const msg = (error.message ?? "").toLowerCase();
	return msg.includes("rate") || msg.includes("quota") || msg.includes("limit");
}

/**
 * Convert a Payload Lexical editor state to plain-HTML for email rendering.
 * Handles paragraphs, headings, bold, italic, links, and line breaks.
 * Extend as needed for your BlocksFeature blocks.
 */
function lexicalToHtml(editorState: any): string {
	if (!editorState?.root?.children) return "";

	function renderNode(node: any): string {
		switch (node.type) {
			case "root":
				return node.children.map(renderNode).join("");

			case "paragraph":
				return `<p style="margin:0 0 1em 0;">${node.children.map(renderNode).join("")}</p>`;

			case "heading": {
				const tag = node.tag ?? "h2";
				const sizes: Record<string, string> = { h2: "20px", h3: "17px", h4: "15px" };
				const size = sizes[tag] ?? "18px";
				return `<${tag} style="font-size:${size};margin:1.2em 0 0.4em 0;">${node.children.map(renderNode).join("")}</${tag}>`;
			}

			case "quote":
				return `<blockquote style="border-left:3px solid #ccc;margin:1em 0;padding:0.5em 1em;color:#555;">${node.children.map(renderNode).join("")}</blockquote>`;

			case "text": {
				let t = node.text ?? "";
				// Replace newlines within a text node with <br>
				t = t.replace(/\n/g, "<br />");
				const fmt = node.format ?? 0;
				if (fmt & 1) t = `<strong>${t}</strong>`; // bold
				if (fmt & 2) t = `<em>${t}</em>`; // italic
				if (fmt & 8) t = `<u>${t}</u>`; // underline
				if (fmt & 16) t = `<code style="background:#f3f4f6;padding:2px 4px;border-radius:3px;">${t}</code>`;
				return t;
			}

			case "link": {
				const url = node.fields?.url ?? "#";
				const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : "";
				return `<a href="${url}"${target} style="color:#166534;text-decoration:underline;">${node.children.map(renderNode).join("")}</a>`;
			}

			case "horizontalrule":
				return '<hr style="border:none;border-top:1px solid #e5e7eb;margin:1.5em 0;" />';

			case "linebreak":
				return "<br />";

			default:
				// Unknown node type — render children if any
				return node.children ? node.children.map(renderNode).join("") : "";
		}
	}

	return renderNode(editorState.root);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
	// ── Auth — use Payload's own session; no shared secret needed ────────────
	// The admin UI is same-origin so the session cookie is sent automatically.
	const payload = await getPayload({ config: configPromise });
	const { user } = await payload.auth({ headers: req.headers });
	if (!user) {
		return Response.json({ message: "Unauthorized — please log in to Payload admin" }, { status: 401, headers: corsHeaders });
	}

	// Parse body
	let campaignId: string;
	let resumeFrom = 0;
	try {
		const body = await req.json();
		if (!body.campaignId) throw new Error("Missing campaignId");
		campaignId = body.campaignId;
		if (typeof body.resumeFrom === "number") resumeFrom = body.resumeFrom;
	} catch {
		return Response.json({ message: "Invalid request body" }, { status: 400, headers: corsHeaders });
	}

	if (!process.env.RESEND_API_KEY) {
		return Response.json({ message: "RESEND_API_KEY not configured" }, { status: 500, headers: corsHeaders });
	}

	const resend = new Resend(process.env.RESEND_API_KEY);

	// Fetch campaign
	const campaignRes = await payload.findByID({ collection: "emailCampaigns", id: campaignId });
	const campaign = campaignRes as any;

	if (!campaign) {
		return Response.json({ message: "Campaign not found" }, { status: 404, headers: corsHeaders });
	}
	if (campaign.status === "sent") {
		return Response.json({ message: "Already sent" }, { status: 409, headers: corsHeaders });
	}

	// Fetch active subscribers
	const subscribersRes = await payload.find({
		collection: "subscribers",
		where: { status: { equals: "subscribed" } },
		limit: 10000,
		page: 1,
	});
	const allSubscribers: Subscriber[] = subscribersRes.docs;
	const subscribers = allSubscribers.slice(resumeFrom);

	if (!subscribers.length) {
		return Response.json({ message: "No remaining subscribers" }, { status: 200, headers: corsHeaders });
	}

	// Convert Lexical → HTML for this campaign
	const bodyHtml = lexicalToHtml(campaign.body);
	const appUrl = process.env.APP_URL ?? "";
	const fromName = process.env.SMTP_FROM_NAME ?? "Spiritans Sound";
	const fromEmail = process.env.SMTP_FROM_EMAIL ?? "";
	const from = `${fromName} <${fromEmail}>`;

	let sent = 0;
	let failed = 0;
	let hitRateLimit = false;

	// Send loop
	for (const subscriber of subscribers) {
		const firstName = subscriber.name?.trim() || "Friend";
		const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;

		const { error } = await resend.emails.send({
			from,
			to: subscriber.email,
			subject: campaign.subject,
			react: React.createElement(NewsletterEmailTemplate, {
				firstName,
				subject: campaign.subject,
				preheader: campaign.preheader,
				bodyHtml,
				unsubscribeUrl,
				senderName: fromName,
			}),
			headers: {
				"List-Unsubscribe": `<${unsubscribeUrl}>`,
				"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
			},
		});

		if (error) {
			if (isRateLimitError(error)) {
				console.warn(`Rate limit reached after ${sent} sends.`);
				hitRateLimit = true;
				break;
			}
			console.error(`Failed to send to ${subscriber.email}:`, error);
			failed++;
		} else {
			sent++;
			await delay(100);
		}
	}

	const totalSentSoFar = resumeFrom + sent;

	// Update campaign status in Payload
	if (hitRateLimit) {
		await payload.update({
			collection: "emailCampaigns",
			id: campaignId,
			data: {
				status: "paused",
				sentCount: totalSentSoFar,
			} as any,
		});
		return Response.json(
			{
				paused: true,
				sent,
				failed,
				totalSentSoFar,
				message: `Rate limit reached. ${totalSentSoFar} sent. Resume when limit resets.`,
			},
			{ headers: corsHeaders },
		);
	}

	await payload.update({
		collection: "emailCampaigns",
		id: campaignId,
		data: {
			status: "sent",
			sentAt: new Date().toISOString(),
			sentCount: totalSentSoFar,
			recipientCount: allSubscribers.length,
		} as any,
	});

	return Response.json({ sent: totalSentSoFar, failed, paused: false }, { headers: corsHeaders });
}
