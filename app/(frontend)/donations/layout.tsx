import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Our Mission",
  description: "Your generosity helps us proclaim the Gospel through faith, music, and sacred expression. Support Spiritans Sound today.",
  openGraph: {
    title: "Support Our Mission | Spiritans Sound",
    description: "Your generosity helps us proclaim the Gospel through faith, music, and sacred expression. Support Spiritans Sound today.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function DonationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
