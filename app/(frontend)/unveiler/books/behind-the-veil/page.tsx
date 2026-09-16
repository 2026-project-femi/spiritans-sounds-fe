import type { Metadata } from "next";
import BehindTheVeilView from "@/components/btv/BehindTheVeilView";
import { btvConfig } from "@/config/behindTheVeil";

export const metadata: Metadata = {
  title: btvConfig.seo.title,
  description: btvConfig.seo.description,
  alternates: {
    canonical: btvConfig.seo.canonical,
  },
  openGraph: {
    title: btvConfig.seo.title,
    description: btvConfig.seo.description,
    url: btvConfig.seo.canonical,
    siteName: btvConfig.seo.siteName,
    images: [
      {
        url: btvConfig.book.coverImage,
        width: 1200,
        height: 630,
        alt: btvConfig.book.coverAlt,
      },
    ],
    type: "book",
  },
  twitter: {
    card: "summary_large_image",
    title: btvConfig.seo.title,
    description: btvConfig.seo.description,
    images: [btvConfig.book.coverImage],
  },
};

export default function BehindTheVeilPage() {
  const jsonLdBook = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: btvConfig.book.title,
    description: btvConfig.book.heroIntro,
    author: {
      "@type": "Person",
      name: btvConfig.author.name,
      jobTitle: btvConfig.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: btvConfig.book.publication.publisher,
    },
    inLanguage: btvConfig.book.publication.language,
    image: btvConfig.book.coverImage,
    datePublished: btvConfig.book.publication.publicationDate,
  };

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${btvConfig.book.title} Online Book Launch`,
    startDate: btvConfig.launch.dateISO,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: btvConfig.seo.canonical,
    },
    image: [btvConfig.book.coverImage],
    description: btvConfig.sections.launch.registerIntro,
    organizer: {
      "@type": "Organization",
      name: btvConfig.brand.siteName,
      url: btvConfig.social.links.find((l) => l.label === "Website")?.url || "https://www.spiritanssound.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBook) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />
      <BehindTheVeilView />
    </>
  );
}
