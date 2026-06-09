"use client";
// components/admin/SendCampaignButton.tsx
//
// Replaces Payload's default Save button with a smart button that:
//   - Saves the document first (via Payload's built-in save)
//   - Then calls POST /api/send-campaign
//   - Shows live status feedback inline
//   - Handles rate-limit pauses and lets you resume

import React, { useState, useTransition } from "react";
import { useDocumentInfo, useForm } from "@payloadcms/ui";

type SendState =
	| { type: "idle" }
	| { type: "saving" }
	| { type: "sending" }
	| { type: "paused"; sent: number; message: string }
	| { type: "done"; sent: number; failed: number }
	| { type: "error"; message: string };

export function SendCampaignButton() {
	const { id, savedDocumentData } = useDocumentInfo();
	const { submit } = useForm();
	const [state, setState] = useState<SendState>({ type: "idle" });
	const [, startTransition] = useTransition();

	const status = savedDocumentData?.status;
	const isSent = status === "sent";
	const isPaused = status === "paused";
	const isBusy = state.type === "saving" || state.type === "sending";

	// ── Send handler ────────────────────────────────────────────────────────────
	async function handleSend(resumeFrom = 0) {
		if (!id) return;

		// 1. Save the document first so the API works with latest content
		setState({ type: "saving" });
		try {
			await submit();
		} catch {
			setState({ type: "error", message: "Failed to save before sending." });
			return;
		}

		// 2. Call the send API
		setState({ type: "sending" });
		try {
			const res = await fetch("/api/newsletter/send-campaign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin", // sends the Payload session cookie automatically
				body: JSON.stringify({ campaignId: id, resumeFrom }),
			});
			const data = await res.json();

			if (!res.ok) {
				setState({ type: "error", message: data.message ?? `HTTP ${res.status}` });
				return;
			}

			if (data.paused) {
				setState({
					type: "paused",
					sent: data.totalSentSoFar ?? data.sent,
					message: data.message ?? "Rate limit reached — resume when the limit resets.",
				});
				return;
			}

			setState({ type: "done", sent: data.sent, failed: data.failed ?? 0 });
		} catch (e: any) {
			setState({ type: "error", message: e?.message ?? "Unknown error" });
		}
	}

	// ── Labels ──────────────────────────────────────────────────────────────────
	function buttonLabel() {
		if (state.type === "saving") return "Saving…";
		if (state.type === "sending") return "Sending…";
		if (isSent) return "✓ Already Sent";
		if (isPaused) return "Resume Sending";
		return "Send Campaign";
	}

	// ── Render ──────────────────────────────────────────────────────────────────
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			{/* Primary button */}
			<button
				type="button"
				onClick={() => {
					startTransition(() => {
						const resumeFrom =
							isPaused && state.type === "paused"
								? state.sent
								: isPaused && savedDocumentData?.sentCount
									? savedDocumentData.sentCount
									: 0;
						handleSend(resumeFrom);
					});
				}}
				disabled={isBusy || isSent}
				style={{
					padding: "0.6rem 1.2rem",
					background: isSent ? "#6b7280" : isBusy ? "#4b5563" : isPaused ? "#d97706" : "#16a34a",
					color: "#fff",
					border: "none",
					borderRadius: "4px",
					cursor: isBusy || isSent ? "not-allowed" : "pointer",
					fontWeight: 600,
					fontSize: "0.875rem",
					transition: "background 0.15s",
					width: "100%",
				}}>
				{buttonLabel()}
			</button>

			{/* Inline feedback */}
			{state.type === "done" && (
				<p style={{ color: "#16a34a", fontSize: "0.8rem", margin: 0 }}>
					✓ Sent to {state.sent} subscriber{state.sent !== 1 ? "s" : ""}.
					{state.failed > 0 && ` (${state.failed} failed)`}
				</p>
			)}

			{state.type === "paused" && <p style={{ color: "#d97706", fontSize: "0.8rem", margin: 0 }}>⏸ {state.message}</p>}

			{state.type === "error" && <p style={{ color: "#dc2626", fontSize: "0.8rem", margin: 0 }}>✗ {state.message}</p>}

			{(state.type === "saving" || state.type === "sending") && (
				<p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: 0 }}>
					{state.type === "saving" ? "Saving document…" : "Sending emails…"}
				</p>
			)}
		</div>
	);
}
