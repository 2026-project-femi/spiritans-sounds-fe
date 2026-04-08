import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextComponents } from "@portabletext/react";

// ─── YouTube helpers ──────────────────────────────────────────────────────────

export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/");
      const embedIdx = parts.indexOf("embed");
      if (embedIdx !== -1) return parts[embedIdx + 1];
    }
  } catch {
    // not a valid URL
  }
  return null;
}

export function YouTubeEmbed({ url }: { url: string }) {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;
  return (
    <div className="aspect-video my-8 rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

// ─── Portable Text serializers ────────────────────────────────────────────────

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { asset?: object; alt?: string; caption?: string; link?: string } }) => {
      if (!value?.asset) return null;
      const imgUrl = urlFor(value.asset).url();
      const img = (
        <figure className="my-8">
          <div className="overflow-hidden rounded-xl">
            <Image
              src={imgUrl}
              alt={value.alt || ""}
              width={900}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
      if (value.link) {
        return (
          <a href={value.link} target="_blank" rel="noopener noreferrer" className="block">
            {img}
          </a>
        );
      }
      return img;
    },
  },
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string; blank?: boolean } }) => {
      const href = value?.href || "#";
      const target = value?.blank !== false ? "_blank" : "_self";
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-brand-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {children}
        </a>
      );
    },
  },
};
