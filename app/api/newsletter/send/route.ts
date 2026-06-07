import * as React from "react";
import { Resend } from "resend";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { NewsletterEmailTemplate } from "@/lib/emails/NewsletterEmailTemplate";
import { Subscriber } from "@/payload-types";

// Allow Payload cross origin
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.PAYLOAD_ADMIN_CORS || "*",
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
  const payload = await getPayload({ config: configPromise });

  // ── Fetch campaign ─────────────────────────────────────────────────────────
  const campaignRes = await payload.find({
    collection: 'emailCampaigns',
    where: { id: { equals: campaignId } }
  });
  const campaign: any = campaignRes.docs[0];

  if (!campaign) {
    return Response.json({ message: "Campaign not found" }, { status: 404, headers: corsHeaders });
  }
  if (campaign.status === "sent") {
    return Response.json({ message: "Campaign has already been sent" }, { status: 409, headers: corsHeaders });
  }

  // ── Fetch subscribers ───────────────
  const subscribersRes = await payload.find({
    collection: 'subscribers',
    where: { status: { equals: 'active' } },
    limit: 10000,
    page: 1,
  });
  
  const subscribers : Subscriber[] = subscribersRes.docs.slice(resumeFrom);

  if (!subscribers.length) {
    return Response.json({ message: "No remaining subscribers to send to" }, { status: 200, headers: corsHeaders });
  }

  // Convert Lexical to simple HTML for now (could be elaborated)
  const bodyHtml = campaign.body
    ? `<div style="white-space: pre-wrap;">${typeof campaign.body === 'string' ? campaign.body : 'See the latest update on Spiritans Sound...'}</div>`
    : "";

  const appUrl = process.env.APP_URL || "";
  const fromAddress = `${process.env.SMTP_FROM_NAME || "Spiritans Sound"} <${process.env.SMTP_FROM_EMAIL}>`;
  let sent = 0;
  let failed = 0;
  let hitRateLimit = false;

  // ── Send loop ─────────────────────────────────────────────────────────────
  for (const subscriber   of subscribers) {
    const firstName = subscriber.name?.trim() || "Friend";
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
        senderName: process.env.SMTP_FROM_NAME || "Spiritans Sound",
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
    await payload.update({
        collection: 'emailCampaigns',
        id: campaign.id,
        data: { status: 'draft' } // Mark draft to pause
    });
    return Response.json({
      paused: true,
      sent,
      failed,
      totalSentSoFar,
      message: `Rate limit reached. ${totalSentSoFar} sent so far. Resume once the limit resets.`,
    }, { headers: corsHeaders });
  }

  await payload.update({
    collection: 'emailCampaigns',
    id: campaign.id,
    data: { status: 'sent', sentAt: new Date().toISOString() as any }
  });

  console.log(`Campaign "${campaign.subject}" complete: ${totalSentSoFar} sent, ${failed} failed.`);
  return Response.json({ sent: totalSentSoFar, failed, paused: false }, { headers: corsHeaders });
}
