"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { initAnalytics, trackPageView } from "@/lib/analytics";

function AnalyticsTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		initAnalytics();
	}, []);

	useEffect(() => {
		if (pathname) {
			const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
			trackPageView(url);
		}
	}, [pathname, searchParams]);

	return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;

	return (
		<>
			{gaId && (
				<>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
						strategy="afterInteractive"
					/>
					<Script id="google-analytics" strategy="afterInteractive">
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${gaId}', {
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
