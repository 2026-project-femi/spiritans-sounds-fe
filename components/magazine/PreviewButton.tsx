"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { PdfPreviewModal } from "./PdfPreviewModal";

interface Props {
  fileUrl: string;
  title: string;
}

export function PreviewButton({ fileUrl, title }: Props) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 transition-all uppercase tracking-widest text-sm"
      >
        <Eye size={18} /> Preview First 5 Pages
      </button>

      {showPreview && (
        <PdfPreviewModal
          fileUrl={fileUrl}
          title={title}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
