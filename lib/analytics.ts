import mixpanel from "mixpanel-browser";

// Environment variables
const MIXPANEL_TOKEN = '0a063ff9a9c7c06c23b2309baea02257';
const GA_ID = 'G-FT59GPJLE3';

let isMixpanelInitialized = false;

/**
 * Initialize analytics services on client-side
 */
export function initAnalytics() {
	if (typeof window === "undefined") return;

	if (MIXPANEL_TOKEN && !isMixpanelInitialized) {
		try {
			mixpanel.init(MIXPANEL_TOKEN, {
				debug: process.env.NODE_ENV === "development",
				track_pageview: false, // We handle pageviews manually for Next.js SPA routing
				persistence: "localStorage",
			});
			isMixpanelInitialized = true;
		} catch (error) {
			console.error("Failed to initialize Mixpanel:", error);
		}
	}
}

/**
 * Track page view in both GA4 and Mixpanel
 */
export function trackPageView(url: string, title?: string) {
	if (typeof window === "undefined") return;

	// Mixpanel Page View
	if (MIXPANEL_TOKEN) {
		try {
			initAnalytics();
			mixpanel.track("Page View", {
				page_path: url,
				page_title: title || document.title,
			});
		} catch (e) {
			console.error("Mixpanel track pageview error:", e);
		}
	}

	// Google Analytics 4 Page View
	if (GA_ID && typeof window.gtag === "function") {
		try {
			window.gtag("config", GA_ID, {
				page_path: url,
				page_title: title || document.title,
			});
		} catch (e) {
			console.error("GA4 track pageview error:", e);
		}
	}
}

/**
 * Track custom events (e.g., button clicks, form submits, audio plays)
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
	if (typeof window === "undefined") return;

	// Mixpanel Track Event
	if (MIXPANEL_TOKEN) {
		try {
			initAnalytics();
			mixpanel.track(eventName, properties);
		} catch (e) {
			console.error("Mixpanel track event error:", e);
		}
	}

	// GA4 Track Event
	if (GA_ID && typeof window.gtag === "function") {
		try {
			window.gtag("event", eventName, properties);
		} catch (e) {
			console.error("GA4 track event error:", e);
		}
	}
}

/**
 * Track Content Read (Articles, Posts, Homilies, Books)
 */
export function trackContentRead(contentData: {
	id: string;
	slug: string;
	title: string;
	author?: string;
	type: "article" | "post" | "homily" | "book";
}) {
	trackEvent("Content Read", {
		content_id: contentData.id,
		content_slug: contentData.slug,
		content_title: contentData.title,
		content_author: contentData.author || "Unknown",
		content_type: contentData.type,
	});
}

// Global TypeScript declarations for gtag
declare global {
	interface Window {
		gtag?: (...args: any[]) => void;
		dataLayer?: any[];
	}
}
