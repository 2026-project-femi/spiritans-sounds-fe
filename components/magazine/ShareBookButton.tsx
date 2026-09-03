"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle } from "lucide-react";

interface ShareBookButtonProps {
  title: string;
  slug: string;
}

export function ShareBookButton({ title, slug }: ShareBookButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/unveiler/books/${slug}`;
    }
    return `https://spiritanssound.com/unveiler/books/${slug}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Spiritans Sound`,
          text: `Check out "${title}" on Treasures Unveiler!`,
          url: url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const url = encodeURIComponent(getShareUrl());
  const text = encodeURIComponent(`Check out "${title}" on Treasures Unveiler!`);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-all uppercase tracking-widest border border-white/10"
          title="Share this book"
        >
          <Share2 className="w-4 h-4 text-brand-primary" />
          Share Book
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-full transition-all uppercase tracking-widest border border-white/10"
          title="Copy direct link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-gray-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Social Dropdown Menu (if native share isn't triggered or desktop fallback) */}
      {showMenu && (
        <div className="absolute left-0 mt-3 w-56 bg-[#121214] border border-white/10 rounded-2xl p-3 shadow-2xl z-40 space-y-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
          >
            <MessageCircle className="w-4 h-4 text-green-500" />
            Share on WhatsApp
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
          >
            <span className="w-4 h-4 text-blue-400 font-bold text-center">X</span>
            Share on Twitter / X
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
          >
            <span className="w-4 h-4 text-blue-600 font-bold text-center">f</span>
            Share on Facebook
          </a>
        </div>
      )}
    </div>
  );
}
