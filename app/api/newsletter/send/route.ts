import * as React from "react";
import { Resend } from "resend";
import { createClient } from "next-sanity";
import { toHTML } from "@portabletext/to-html";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { NewsletterEmailTemplate } from "@/lib/emails/NewsletterEmailTemplate";

// Allow the Sanity Studio (localhost:3333) to call this endpoint
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.SANITY_STUDIO_ORIGIN || "http://localhost:3333",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight request
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// Resend returns { data, error } — error.statusCode 429 means rate/daily limit reached
function isRateLimitError(error: { statusCode?: number | null; message?: string } | null): boolean {
  if (!error) return false;
  if (error.statusCode === 429) return true;
  const msg = (error.message ?? "").toLowerCase();
  return msg.includes("rate") || msg.includes("quota") || msg.includes("limit");
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.CAMPAIGN_SEND_SECRET;
  const authHeader = req.headers.get("Authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return Response.json({ message: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let campaignId: string;
  let resumeFrom = 0;
  try {
    const body = await req.json();
    campaignId = body.campaignId;
    if (!campaignId) throw new Error("Missing campaignId");
    if (typeof body.resumeFrom === "number") resumeFrom = body.resumeFrom;
  } catch {
    return Response.json({ message: "Invalid request body" }, { status: 400, headers: corsHeaders });
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ message: "RESEND_API_KEY is not configured" }, { status: 500, headers: corsHeaders });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    return Response.json({ message: "Server configuration error" }, { status: 500, headers: corsHeaders });
  }

  const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token });

  // ── Fetch campaign ─────────────────────────────────────────────────────────
  // The Studio passes the draft ID (e.g. "drafts.abc123") when the document
  // hasn't been published yet. Strip the prefix so we can match either form.
  const rawId = campaignId.replace(/^drafts\./, "");
  const campaign = await client.fetch(
    `*[_type == "emailCampaign" && _id in [$id, $draftId]][0]{ _id, subject, preheader, body, status, sentCount }`,
    { id: rawId, draftId: `drafts.${rawId}` },
    { perspective: "raw" }
  );

  if (!campaign) {
    return Response.json({ message: "Campaign not found" }, { status: 404, headers: corsHeaders });
  }
  if (campaign.status === "sent") {
    return Response.json({ message: "Campaign has already been sent" }, { status: 409, headers: corsHeaders });
  }

  // ── Fetch subscribers (consistent order, skip already-sent) ───────────────
  const subscribers: { _id: string; email: string; firstName?: string }[] = await client.fetch(
    `*[_type == "subscriber" && status == "active"] | order(_id asc) [$offset...99999] { _id, email, firstName }`,
    { offset: resumeFrom }
  );

  if (!subscribers.length) {
    return Response.json({ message: "No remaining subscribers to send to" }, { status: 200, headers: corsHeaders });
  }

  // ── Convert blockContent body to HTML once ────────────────────────────────
  const bodyHtml = campaign.body
    ? toHTML(campaign.body, {
        components: {
          marks: {
            link: ({ children, value }: { children: string; value?: { href?: string; blank?: boolean } }) => {
              const href = value?.href ?? "#";
              const target = value?.blank !== false ? ' target="_blank" rel="noopener noreferrer"' : "";
              return `<a href="${href}"${target}>${children}</a>`;
            },
          },
        },
      })
    : "";

  const appUrl = process.env.APP_URL || "";
  const fromAddress = `${process.env.SMTP_FROM_NAME || "Spiritans Sound"} <${process.env.SMTP_FROM_EMAIL}>`;
  let sent = 0;
  let failed = 0;
  let hitRateLimit = false;

  // ── Send loop ─────────────────────────────────────────────────────────────
  for (const subscriber of subscribers) {
    const firstName = subscriber.firstName?.trim() || "Friend";
    const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: subscriber.email,
      subject: campaign.subject,
      react: React.createElement(NewsletterEmailTemplate, {
        firstName,
        subject: campaign.subject,
        preheader: campaign.preheader,
        bodyHtml,
        unsubscribeUrl,
      }),
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    if (error) {
      if (isRateLimitError(error)) {
        console.warn(`Resend rate limit reached after ${sent} sends. Campaign paused.`, error);
        hitRateLimit = true;
        break;
      }
      console.error(`Failed to send to ${subscriber.email}:`, error);
      failed++;
    } else {
      sent++;
      await delay(100); // stay comfortably within Resend's rate limits
    }
  }

  // ── Save campaign progress ────────────────────────────────────────────────
  const totalSentSoFar = resumeFrom + sent;

  if (hitRateLimit) {
    await client.patch(campaign._id).set({ status: "paused", sentCount: totalSentSoFar }).commit();
    return Response.json({
      paused: true,
      sent,
      failed,
      totalSentSoFar,
      message: `Rate limit reached. ${totalSentSoFar} sent so far. Resume once the limit resets.`,
    }, { headers: corsHeaders });
  }

  await client
    .patch(campaign._id)
    .set({ status: "sent", sentAt: new Date().toISOString(), recipientCount: totalSentSoFar, sentCount: totalSentSoFar })
    .commit();

  console.log(`Campaign "${campaign.subject}" complete: ${totalSentSoFar} sent, ${failed} failed.`);
  return Response.json({ sent: totalSentSoFar, failed, paused: false }, { headers: corsHeaders });
}
