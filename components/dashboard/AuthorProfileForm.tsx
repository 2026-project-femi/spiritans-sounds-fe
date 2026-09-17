"use client";

import React, { useState } from "react";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Globe, 
  Building, 
  CreditCard, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  FileText
} from "lucide-react";
import { updateAuthorProfileAction } from "@/app/(frontend)/unveiler/actions/updateAuthorProfile";

interface AuthorProfileFormProps {
  initialUser: {
    id: string;
    name?: string | null;
    email: string;
    phone?: string | null;
    country?: string | null;
    role?: string | null;
    authorType?: string | null;
    authorBio?: string | null;
    bankDetails?: {
      bankName?: string | null;
      accountName?: string | null;
      accountNumber?: string | null;
      sortCodeOrRoutingNumber?: string | null;
    } | null;
  };
}

export default function AuthorProfileForm({ initialUser }: AuthorProfileFormProps) {
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    phone: initialUser.phone || "",
    country: initialUser.country || "",
    authorBio: initialUser.authorBio || "",
    bankName: initialUser.bankDetails?.bankName || "",
    accountName: initialUser.bankDetails?.accountName || "",
    accountNumber: initialUser.bankDetails?.accountNumber || "",
    sortCodeOrRoutingNumber: initialUser.bankDetails?.sortCodeOrRoutingNumber || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validate password confirmation if entered
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match. Please verify your new password.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const res = await updateAuthorProfileAction({
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        authorBio: formData.authorBio,
        bankDetails: {
          bankName: formData.bankName,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          sortCodeOrRoutingNumber: formData.sortCodeOrRoutingNumber,
        },
        newPassword: formData.newPassword || undefined,
      });

      if (res.success) {
        setSuccessMsg(res.message || "Profile updated successfully!");
        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
        // Scroll to top of window or alert
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMsg(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Feedback Messages */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm font-semibold animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Personal Information */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <UserIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Personal Information</h2>
            <p className="text-xs text-gray-400">Basic contact and identity information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Full Name <span className="text-brand-primary">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Email Address <span className="text-gray-500 font-normal lowercase">(Login ID)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={initialUser.email}
                className="w-full bg-[#161619] border border-white/5 rounded-xl px-4 py-3 text-gray-400 text-sm cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-gray-600 absolute right-4 top-3.5" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">To change your email, please contact administration.</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
              />
              <Phone className="w-4 h-4 text-gray-500 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Country / Region
            </label>
            <div className="relative">
              <input
                type="text"
                name="country"
                autoComplete="country-name"
                placeholder="e.g. Nigeria, United Kingdom"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
              />
              <Globe className="w-4 h-4 text-gray-500 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Author Biography */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Author Profile & Biography</h2>
              <p className="text-xs text-gray-400">This bio is displayed to readers on your published book pages.</p>
            </div>
          </div>
          {initialUser.authorType && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full text-brand-primary">
              {initialUser.authorType.replace("_", " ")}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
            Author Biography
          </label>
          <textarea
            name="authorBio"
            rows={4}
            placeholder="Share a short bio with your readers, your literary background, notable accomplishments, or ministry work..."
            value={formData.authorBio}
            onChange={handleChange}
            className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary resize-y"
          />
        </div>
      </div>

      {/* 3. Payout & Bank Details */}
      <div id="payout-details" className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 scroll-mt-24">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2.5 bg-green-500/10 rounded-xl text-green-400">
            <Building size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Payout Account Details</h2>
            <p className="text-xs text-gray-400">Where you receive royalties and earnings from book sales.</p>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs text-gray-400 leading-relaxed">
          Ensure these details are accurate. When you submit a withdrawal request from your <strong>Earnings & Payouts</strong> tab, payments will be sent to this destination.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              placeholder="e.g. Access Bank, GTBank, Zenith"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              placeholder="Name as registered with your bank"
              value={formData.accountName}
              onChange={handleChange}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Account Number
            </label>
            <div className="relative">
              <input
                type="text"
                name="accountNumber"
                placeholder="10-digit Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary font-mono"
              />
              <CreditCard className="w-4 h-4 text-gray-500 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Sort Code / Routing Number / Swift
            </label>
            <input
              type="text"
              name="sortCodeOrRoutingNumber"
              placeholder="Optional for domestic, required for international"
              value={formData.sortCodeOrRoutingNumber}
              onChange={handleChange}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* 4. Security & Password Update */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Security & Password</h2>
            <p className="text-xs text-gray-400">Leave these fields blank if you do not wish to change your password.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-type new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-brand-primary/20 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
