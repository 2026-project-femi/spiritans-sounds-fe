import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Spiritans Sound — a digital sanctuary of faith, sacred music, reflections, and spiritual growth rooted in the Spiritan charism.",
  openGraph: {
    title: "About Us | Spiritans Sound",
    description: "Learn about Spiritans Sound — a digital sanctuary of faith, sacred music, reflections, and spiritual growth rooted in the Spiritan charism.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
