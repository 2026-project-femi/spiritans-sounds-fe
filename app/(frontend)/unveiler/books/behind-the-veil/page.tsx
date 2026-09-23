import type { Metadata } from "next";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import BehindTheVeilView, { BehindTheVeilLaunchData } from "@/components/btv/BehindTheVeilView";
import { btvConfig } from "@/config/behindTheVeil";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise });
  let launchSettings: any = null;
  try {
    launchSettings = await payload.findGlobal({ slug: "book-launch-settings" as any });
  } catch (e) {
    // Graceful fallback
  }

  const title = launchSettings?.bookTitle 
    ? `${launchSettings.bookTitle}: How to Detect Deception and Deal with Liars | Spiritans Sound`
    : btvConfig.seo.title;
  const description = btvConfig.seo.description;

  return {
    title,
    description,
    alternates: {
      canonical: btvConfig.seo.canonical,
    },
    openGraph: {
      title,
      description,
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
      title,
      description,
      images: [btvConfig.book.coverImage],
    },
  };
}

export default async function BehindTheVeilPage() {
  const payload = await getPayload({ config: configPromise });

  let launchSettings: any = null;
  try {
    launchSettings = await payload.findGlobal({ slug: "book-launch-settings" as any });
  } catch (e) {
    console.error("Could not fetch book-launch-settings:", e);
  }

  // Find or ensure publication document exists for Behind the Veil
  let publication: any = null;
  try {
    const pubRes = await payload.find({
      collection: "publications",
      where: { slug: { equals: "behind-the-veil" } },
      limit: 1,
    });

    if (pubRes.docs && pubRes.docs.length > 0) {
      publication = pubRes.docs[0];
    } else {
      // Create Behind the Veil publication to allow order processing & library consistency
      publication = await payload.create({
        collection: "publications",
        data: {
          title: launchSettings?.bookTitle || "Behind the Veil",
          slug: "behind-the-veil",
          description: btvConfig.book.heroIntro,
          price: "paid",
          priceAmount: launchSettings?.ebookPriceNGN || 5000,
          priceAmountUSD: launchSettings?.ebookPriceUSD || 10,
          priceAmountGBP: launchSettings?.ebookPriceGBP || 8,
          isPreorder: launchSettings?.isPreorder ?? true,
          publishingStatus: "published",
          _status: "published",
        },
      });
    }
  } catch (e) {
    console.error("Error ensuring publication for Behind the Veil:", e);
  }

  // Resolve preview PDF URL
  let previewPdfUrl: string | null = null;
  if (launchSettings?.previewPdf && typeof launchSettings.previewPdf === "object") {
    previewPdfUrl = launchSettings.previewPdf.url || null;
  } else if (publication?.file && typeof publication.file === "object") {
    previewPdfUrl = publication.file.url || null;
  }

  // Resolve audio preview items with URLs
  const audioPreviews = (launchSettings?.audioPreviews || []).map((a: any) => ({
    title: a.title,
    description: a.description || "",
    audioUrl: (a.audioFile && typeof a.audioFile === "object" ? a.audioFile.url : null) || a.audioUrl || "",
  }));

  const launchData: BehindTheVeilLaunchData = {
    publicationId: publication?.id ? String(publication.id) : undefined,
    bookTitle: launchSettings?.bookTitle || publication?.title || btvConfig.book.title,
    bookSlug: launchSettings?.bookSlug || "behind-the-veil",
    launchDateISO: launchSettings?.launchDateISO || btvConfig.launch.dateISO,
    eventDate: launchSettings?.eventDate || btvConfig.launch.dateLabel,
    meetingPlatform: launchSettings?.meetingPlatform || "Zoom",
    meetingLink: launchSettings?.meetingLink || "",
    pages: launchSettings?.pages || btvConfig.book.publication.pages,
    isbn: launchSettings?.isbn || btvConfig.book.publication.isbn,
    publisher: launchSettings?.publisher || btvConfig.book.publication.publisher,
    imprint: launchSettings?.imprint || btvConfig.book.publication.imprint,
    language: launchSettings?.language || btvConfig.book.publication.language,
    category: launchSettings?.category || btvConfig.book.publication.category,
    isPreorder: launchSettings?.isPreorder ?? publication?.isPreorder ?? true,
    // Pricing & Formats
    ebookAvailable: launchSettings?.ebookAvailable ?? true,
    ebookPriceNGN: launchSettings?.ebookPriceNGN ?? 5000,
    ebookPriceUSD: launchSettings?.ebookPriceUSD ?? 10,
    ebookPriceGBP: launchSettings?.ebookPriceGBP ?? 8,
    ebookPriceNote: launchSettings?.ebookPriceNote || btvConfig.formats[0].priceNote,
    paperbackAvailable: launchSettings?.paperbackAvailable ?? true,
    paperbackPriceNGN: launchSettings?.paperbackPriceNGN ?? 12000,
    paperbackPriceUSD: launchSettings?.paperbackPriceUSD ?? 25,
    paperbackPriceGBP: launchSettings?.paperbackPriceGBP ?? 20,
    paperbackPriceNote: launchSettings?.paperbackPriceNote || btvConfig.formats[1].priceNote,
    // Preview & Excerpt
    previewPdfUrl,
    excerptTitle: launchSettings?.excerptTitle || btvConfig.book.excerptTitle,
    excerptText: launchSettings?.excerptText || btvConfig.book.excerpt,
    // Watch & Listen Videos
    videosHeading: launchSettings?.videosHeading || btvConfig.sections.videos.eyebrow,
    videosIntro: launchSettings?.videosIntro || btvConfig.videos.intro,
    videos: launchSettings?.videos && launchSettings.videos.length > 0 ? launchSettings.videos : btvConfig.videos.items,
    // Audio Book Previews
    audioHeading: launchSettings?.audioHeading || btvConfig.audio.heading,
    audioIntro: launchSettings?.audioIntro || btvConfig.audio.intro,
    audioPreviews: audioPreviews.length > 0 ? audioPreviews : btvConfig.audio.items,
    // Bookshops
    bookshopsHeading: launchSettings?.bookshopsHeading || btvConfig.nigeriaBookshops.heading,
    bookshopsIntro: launchSettings?.bookshopsIntro || btvConfig.nigeriaBookshops.intro,
    bookshops: launchSettings?.bookshops && launchSettings.bookshops.length > 0 ? launchSettings.bookshops : btvConfig.nigeriaBookshops.items,
    // Testimonials
    testimonialsHeading: launchSettings?.testimonialsHeading || btvConfig.sections.testimonials.title,
    testimonials: launchSettings?.testimonials && launchSettings.testimonials.length > 0 ? launchSettings.testimonials : btvConfig.testimonials.items,
  };

  const jsonLdBook = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: launchData.bookTitle,
    description: btvConfig.book.heroIntro,
    author: {
      "@type": "Person",
      name: btvConfig.author.name,
      jobTitle: btvConfig.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: launchData.publisher,
    },
    inLanguage: launchData.language,
    image: btvConfig.book.coverImage,
    datePublished: btvConfig.book.publication.publicationDate,
  };

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${launchData.bookTitle} Online Book Launch`,
    startDate: launchData.launchDateISO,
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
      <BehindTheVeilView launchData={launchData} />
    </>
  );
}
