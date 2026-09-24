"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { initAnalytics, trackPageView } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-FT59GPJLE3";

// Routes that should never be recorded in the self-hosted page-view counter:
// internal APIs, admin/auth surfaces and private dashboard pages.
const EXCLUDED_PREFIXES = [
	"/api",
	"/admin",
	"/_next",
	"/unveiler/dashboard",
	"/unveiler/login",
	"/unveiler/publish",
	"/unveiler/profile",
	"/unsubscribe",
];

function isTrackablePath(pathname: string): boolean {
	return !EXCLUDED_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}

function AnalyticsTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		initAnalytics();
	}, []);

	useEffect(() => {
		if (!pathname) return;

		const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
		trackPageView(url);

		// Self-hosted page-view counter for basic analytics. Deduplicated per tab
		// session so reloads and client-side navigations do not inflate the count.
		if (!isTrackablePath(pathname)) return;

		const sessionKey = `page_view_tracked_${pathname}`;
		try {
			if (sessionStorage.getItem(sessionKey)) return;
			sessionStorage.setItem(sessionKey, "true");
		} catch {
			// Ignore sessionStorage errors (e.g. incognito restriction) and still record.
		}

		fetch("/api/analytics/track-pageview", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				path: pathname,
				title: typeof document !== "undefined" ? document.title : undefined,
			}),
		}).catch((err) => console.error("Error logging DB page view:", err));
	}, [pathname, searchParams]);

	return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
	return (
		<>
			{GA_ID && (
				<>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
						strategy="afterInteractive"
					/>
					<Script id="google-analytics" strategy="afterInteractive">
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${GA_ID}', {
								page_path: window.location.pathname,
							});
						`}
					</Script>
				</>
			)}
			<Suspense fallback={null}>
				<AnalyticsTracker />
			</Suspense>
			{children}
		</>
	);
}
