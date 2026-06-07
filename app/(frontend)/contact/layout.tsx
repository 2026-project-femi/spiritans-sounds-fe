import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Spiritans Sound team. We'd love to hear from you.",
  openGraph: {
    title: "Contact Us | Spiritans Sound",
    description: "Get in touch with the Spiritans Sound team. We'd love to hear from you.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
