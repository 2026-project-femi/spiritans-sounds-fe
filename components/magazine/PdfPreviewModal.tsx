"use client";

import { X } from "lucide-react";

interface PdfPreviewModalProps {
  fileUrl: string;
  onClose: () => void;
  title?: string;
}

export function PdfPreviewModal({ fileUrl, onClose, title = "Preview" }: PdfPreviewModalProps) {
  const previewUrl = `/api/preview-pdf?url=${encodeURIComponent(fileUrl)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-5xl h-full flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
          <h3 className="text-lg font-black text-white">{title} (Preview - First 5 Pages)</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            title="Close Preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 w-full bg-white relative">
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-none"
            title={`Preview of ${title}`}
          />
        </div>
      </div>
    </div>
  );
}
