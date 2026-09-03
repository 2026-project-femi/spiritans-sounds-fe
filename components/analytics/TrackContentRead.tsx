"use client";

import { useEffect, useRef } from "react";
import { trackContentRead } from "@/lib/analytics";

interface TrackContentReadProps {
	id: string;
	slug: string;
	title: string;
	author?: string;
	type: "article" | "post" | "homily" | "book";
	collection: "article" | "posts" | "homily" | "publications";
}

export function TrackContentRead({
	id,
	slug,
	title,
	author,
	type,
	collection,
}: TrackContentReadProps) {
	const hasTracked = useRef(false);

	useEffect(() => {
		if (hasTracked.current || !id) return;
		hasTracked.current = true;

		// 1. Send telemetry to Mixpanel & GA4
		trackContentRead({
			id,
			slug,
			title,
			author,
			type,
		});

		// 2. Increment view count in Payload DB (deduplicated by session)
		const sessionKey = `view_tracked_${collection}_${id}`;
		try {
			if (!sessionStorage.getItem(sessionKey)) {
				sessionStorage.setItem(sessionKey, "true");
				fetch("/api/analytics/track-view", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id, collection }),
				}).catch((err) => console.error("Error logging DB view count:", err));
			}
		} catch (e) {
			// Ignore sessionStorage errors (e.g. incognito restriction)
		}
	}, [id, slug, title, author, type, collection]);

	// Render nothing to public viewers as requested
	return null;
}
