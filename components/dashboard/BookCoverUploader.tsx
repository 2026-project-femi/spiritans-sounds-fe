"use client";

import React, { useState, useRef } from "react";
import { Camera, Upload, Loader2, Check, AlertCircle } from "lucide-react";
import { updateBookCoverAction } from "@/app/(frontend)/unveiler/actions/updateBookCover";
import { useRouter } from "next/navigation";

interface BookCoverUploaderProps {
  bookId: string;
  bookTitle: string;
  hasCover: boolean;
}

export default function BookCoverUploader({
  bookId,
  bookTitle,
  hasCover,
}: BookCoverUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("bookId", bookId);
      formData.append("coverImage", file);

      const res = await updateBookCoverAction(formData);
      if (res.success) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setErrorMsg(res.error || "Failed to upload cover.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`cover-upload-${bookId}`}
      />

      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          hasCover
            ? "bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20"
            : "bg-brand-primary hover:bg-red-700 text-white shadow-lg shadow-brand-primary/30"
        } disabled:opacity-50`}
        title={hasCover ? "Change book cover image" : "Upload book cover image"}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : success ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span>Saved!</span>
          </>
        ) : (
          <>
            <Camera className="w-3.5 h-3.5" />
            <span>{hasCover ? "Change Cover" : "Upload Cover"}</span>
          </>
        )}
      </button>

      {errorMsg && (
        <div className="absolute top-full left-0 mt-1.5 z-20 bg-red-950 border border-red-500/50 text-red-200 text-[11px] p-2 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap">
          <AlertCircle size={12} className="shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
