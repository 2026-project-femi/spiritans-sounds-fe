"use client";

import React, { useState } from "react";
import { submitBookAction } from "../actions/submitBook";
import { Book, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function PublishBookPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await submitBookAction(formData);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#08080a] text-foreground py-20 px-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-[#121214] border border-brand-primary/30 p-12 rounded-3xl text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-4xl font-black text-white">Thank You!</h1>
          <p className="text-gray-400 text-lg">
            Your book submission has been received and is awaiting review by the
            Spiritans Sound Publishing Team. You will be notified via email once
            a decision is made.
          </p>
          <div className="pt-6">
            <Link
              href="/unveiler"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:opacity-90 transition-all shadow-xl"
            >
              Return to Feed
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080a] text-foreground pb-32 pt-16">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-4 text-center">
          <div className="flex justify-center mb-4">
            <Book className="w-12 h-12 text-brand-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Publish Your Book
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Submit your manuscript to the Treasures Unveiler Publishing platform. 
            Once approved, your book will be available for sale, and you'll get 
            access to a personal dashboard to track sales and earnings transparently.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#121214] border border-white/10 p-8 md:p-12 rounded-3xl space-y-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary border-b border-white/10 pb-2">
                Personal Information
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  defaultValue={user?.name || ""}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={user?.email || ""}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary border-b border-white/10 pb-2">
                Book Details
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Author / Publication Name
                </label>
                <input
                  type="text"
                  name="authorName"
                  required
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Book Title
                </label>
                <input
                  type="text"
                  name="bookTitle"
                  required
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Selling Price (NGN)
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  required
                  min="0"
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-brand-primary border-b border-white/10 pb-2">
              Descriptions & Bio
            </h3>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Short Book Description
              </label>
              <textarea
                name="description"
                rows={3}
                required
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary resize-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Author Biography
              </label>
              <textarea
                name="authorBio"
                rows={3}
                defaultValue={user?.authorBio || ""}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary resize-none"
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary border-b border-white/10 pb-2">
                Files
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Book Cover (Image)
                </label>
                <input
                  type="file"
                  name="bookCover"
                  accept="image/*"
                  required
                  className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-red-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Book Manuscript (PDF)
                </label>
                <input
                  type="file"
                  name="bookPdf"
                  accept="application/pdf"
                  required
                  className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-red-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-brand-primary border-b border-white/10 pb-2">
                Bank / Payment Details
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Bank Name</label>
                <input type="text" name="bankName" defaultValue={user?.bankDetails?.bankName || ""} className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Account Name</label>
                <input type="text" name="accountName" defaultValue={user?.bankDetails?.accountName || ""} className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Account Number</label>
                <input type="text" name="accountNumber" defaultValue={user?.bankDetails?.accountNumber || ""} className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded accent-brand-primary" />
              <span className="text-sm text-gray-400">
                I confirm that I own or have permission to publish the submitted material.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded accent-brand-primary" />
              <span className="text-sm text-gray-400">
                I accept the <Link href="/unveiler/terms" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">submission terms</Link> and conditions.
              </span>
            </label>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-linear-to-r from-brand-primary to-red-700 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Book...
                </>
              ) : (
                "Submit Book for Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
