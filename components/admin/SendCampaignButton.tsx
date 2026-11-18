"use client";
// components/admin/SendCampaignButton.tsx
//
// Injected next to Payload's default Save button (beforeDocumentControls).
// It saves the document, then asks the send API to deliver the campaign.
// The API owns resume state, so the browser never decides who gets resent.

import React, { useState } from "react";
import { useDocumentInfo, useForm } from "@payloadcms/ui";
import { useRouter } from "next/navigation";

type SendResponse = {
	status?: "draft" | "paused" | "partial" | "sent";
	sent?: number;
	failed?: number;
	totalSentSoFar?: number;
	totalAttempted?: number;
	paused?: boolean;
	message?: string;
};

type SendState =
	| { type: "idle" }
	| { type: "saving" }
	| { type: "sending" }
	| { type: "paused"; message: string }
	| { type: "done"; sent: number; failed: number }
	| { type: "error"; message: string };

export function SendCampaignButton() {
	const { id, savedDocumentData } = useDocumentInfo();
	const { submit } = useForm();
	const router = useRouter();
	const [state, setState] = useState<SendState>({ type: "idle" });
	const [localStatus, setLocalStatus] = useState<string | undefined>();

	const savedStatus = (savedDocumentData as { status?: string } | undefined)?.status;
	const status = localStatus ?? savedStatus;
	const isSent = status === "sent";
	const isPaused = status === "paused";
	const isPartial = status === "partial";
	const isCreateView = !id;
	const isBusy = state.type === "saving" || state.type === "sending";

	async function handleSend() {
		if (!id) {
			setState({
				type: "error",
				message: "Save the campaign first, then send it.",
			});
			return;
		}

		// 1. Persist the latest edits before the API reads the campaign.
		setState({ type: "saving" });
		let submitResult: unknown;
		try {
			submitResult = await submit();
		} catch {
			setState({ type: "error", message: "Failed to save before sending." });
			return;
		}

		if (!submitResult) {
			setState({
				type: "error",
				message: "Fix the validation errors before sending.",
			});
			return;
		}

		// 2. Ask the API to send. Resume state lives on the campaign document.
		setState({ type: "sending" });
		try {
			const res = await fetch("/api/newsletter/send-campaign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify({ campaignId: id }),
			});
			const data = (await res.json()) as SendResponse;

			if (!res.ok) {
				setState({ type: "error", message: data.message ?? `HTTP ${res.status}` });
				return;
			}

			if (data.status) setLocalStatus(data.status);

			if (data.paused) {
				setState({
					type: "paused",
					message:
						data.message ??
						`Rate limit reached after ${data.totalSentSoFar ?? 0} sends — resume when the limit resets.`,
				});
			} else {
				setState({
					type: "done",
					sent: data.sent ?? 0,
					failed: data.failed ?? 0,
				});
			}

			router.refresh();
		} catch (error) {
			setState({
				type: "error",
				message: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}

	function buttonLabel(): string {
		if (isBusy) return state.type === "saving" ? "Saving…" : "Sending…";
		if (isSent) return "✓ Already Sent";
		if (isPartial) return "Retry Failed Sends";
		if (isPaused) return "Resume Sending";
		if (isCreateView) return "Save Campaign First";
		return "Send Campaign";
	}

	const background = isSent
		? "#6b7280"
		: isBusy
			? "#4b5563"
			: isPartial
				? "#b45309"
				: isPaused
					? "#d97706"
					: "#16a34a";

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "0.35rem",
				marginRight: "0.5rem",
			}}>
			<button
				type="button"
				onClick={handleSend}
				disabled={isBusy || isSent || isCreateView}
				title={isCreateView ? "Save the campaign before sending it" : undefined}
				style={{
					padding: "0.55rem 1rem",
					background,
					color: "#fff",
					border: "none",
					borderRadius: "4px",
					cursor: isBusy || isSent || isCreateView ? "not-allowed" : "pointer",
					fontWeight: 600,
					fontSize: "0.8125rem",
					transition: "background 0.15s",
					whiteSpace: "nowrap",
				}}>
				{buttonLabel()}
			</button>

			{isCreateView && (
				<p style={{ color: "#6b7280", fontSize: "0.75rem", margin: 0, maxWidth: "15rem" }}>
					Save the campaign first, then this button sends it.
				</p>
			)}

			{state.type === "done" && state.failed > 0 && (
				<p style={{ color: "#b45309", fontSize: "0.75rem", margin: 0, maxWidth: "16rem" }}>
					Sent to {state.sent} · {state.failed} failed. Use “Retry Failed Sends”.
				</p>
			)}

			{state.type === "done" && state.failed === 0 && (
				<p style={{ color: "#16a34a", fontSize: "0.75rem", margin: 0 }}>
					✓ Sent to {state.sent} recipient{state.sent !== 1 ? "s" : ""}.
				</p>
			)}

			{state.type === "paused" && (
				<p style={{ color: "#b45309", fontSize: "0.75rem", margin: 0, maxWidth: "16rem" }}>
					⏸ {state.message}
				</p>
			)}

			{state.type === "error" && (
				<p style={{ color: "#dc2626", fontSize: "0.75rem", margin: 0, maxWidth: "16rem" }}>
					✗ {state.message}
				</p>
			)}

			{(state.type === "saving" || state.type === "sending") && (
				<p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0 }}>
					{state.type === "saving" ? "Saving document…" : "Sending emails…"}
				</p>
			)}
		</div>
	);
}
