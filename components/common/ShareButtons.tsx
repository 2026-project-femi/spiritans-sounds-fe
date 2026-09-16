"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";

export interface ShareButtonsProps {
  title: string;
  slug?: string;
  url?: string;
  basePath?: string;
  itemType?: "article" | "homily" | "event" | "book" | "prayer" | "post";
  theme?: "light" | "dark";
  className?: string;
}

export function ShareButtons({
  title,
  slug,
  url: customUrl,
  basePath,
  itemType = "post",
  theme = "light",
  className = "",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getShareUrl = () => {
    if (customUrl) {
      if (customUrl.startsWith("http")) return customUrl;
      if (typeof window !== "undefined") {
        return `${window.location.origin}${customUrl.startsWith("/") ? "" : "/"}${customUrl}`;
      }
      return `https://spiritanssound.com${customUrl.startsWith("/") ? "" : "/"}${customUrl}`;
    }

    const pathPrefix = basePath
      ? basePath
      : itemType === "book"
      ? "/unveiler/books"
      : itemType === "event"
      ? "/unveiler/events"
      : itemType === "article"
      ? "/articles"
      : itemType === "homily"
      ? "/homilies"
      : `/${itemType}s`;

    const fullPath = slug ? `${pathPrefix}/${slug}` : pathPrefix;

    if (typeof window !== "undefined") {
      return `${window.location.origin}${fullPath}`;
    }
    return `https://spiritanssound.com${fullPath}`;
  };

  const shareUrl = getShareUrl();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Spiritans Sound`,
          text: `Check out "${title}" on Spiritans Sound!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      setShowMenu((prev) => !prev);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`Check out "${title}" on Spiritans Sound!`);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const capitalizedType = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  const isDark = theme === "dark";

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Share Button */}
        <button
          type="button"
          onClick={handleNativeShare}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            isDark
              ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200/80"
          }`}
          title={`Share this ${itemType}`}
          aria-label={`Share ${title}`}
        >
          <Share2 className={`w-3.5 h-3.5 ${isDark ? "text-brand-primary" : "text-amber-600"}`} />
          <span>Share {capitalizedType}</span>
        </button>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            isDark
              ? "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 shadow-xs"
          }`}
          title="Copy link to clipboard"
          aria-label="Copy direct link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Social Dropdown Fallback */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          <div
            className={`absolute left-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl z-40 space-y-1 border ${
              isDark
                ? "bg-[#121214] border-white/10 text-gray-300"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className={`flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-colors font-medium ${
                isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span>Share on WhatsApp</span>
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className={`flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-colors font-medium ${
                isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="w-4 h-4 text-sky-500 font-bold text-center">X</span>
              <span>Share on Twitter / X</span>
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className={`flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-colors font-medium ${
                isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="w-4 h-4 text-blue-600 font-bold text-center">f</span>
              <span>Share on Facebook</span>
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowMenu(false)}
              className={`flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-colors font-medium ${
                isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="w-4 h-4 text-blue-500 font-bold text-center">in</span>
              <span>Share on LinkedIn</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
