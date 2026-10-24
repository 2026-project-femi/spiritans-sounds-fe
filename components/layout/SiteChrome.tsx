"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const STANDALONE_PREFIXES = ["/unveiler", "/young-creators"];
const STANDALONE_EXACT = ["/behind-the-veil"];

/**
 * The mother Spiritans Sound website chrome.
 *
 * Unveiler and Young Creators are standalone brands with their own headers,
 * navigation and footers; they render without the mother-site Header/Footer.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "";
	const isStandalone =
		STANDALONE_EXACT.includes(pathname) ||
		STANDALONE_PREFIXES.some(
			(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
		);

	if (isStandalone) return <>{children}</>;

	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
