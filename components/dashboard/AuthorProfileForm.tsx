"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FileText,
  KeyRound
} from "lucide-react";
import { 
  updateAuthorProfileAction, 
  updateAuthorPasswordAction 
} from "@/app/(frontend)/unveiler/actions/updateAuthorProfile";

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
  const router = useRouter();

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    name: initialUser.name || "",
    phone: initialUser.phone || "",
    country: initialUser.country || "",
    authorBio: initialUser.authorBio || "",
    bankName: initialUser.bankDetails?.bankName || "",
    accountName: initialUser.bankDetails?.accountName || "",
    accountNumber: initialUser.bankDetails?.accountNumber || "",
    sortCodeOrRoutingNumber: initialUser.bankDetails?.sortCodeOrRoutingNumber || "",
  });

  // Password Form Data
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Independent Loading States
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Independent Notification States
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");

  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  // Keep form in sync when initialUser prop changes from server
  useEffect(() => {
    if (initialUser) {
      setProfileData({
        name: initialUser.name || "",
        phone: initialUser.phone || "",
        country: initialUser.country || "",
        authorBio: initialUser.authorBio || "",
        bankName: initialUser.bankDetails?.bankName || "",
        accountName: initialUser.bankDetails?.accountName || "",
        accountNumber: initialUser.bankDetails?.accountNumber || "",
        sortCodeOrRoutingNumber: initialUser.bankDetails?.sortCodeOrRoutingNumber || "",
      });
    }
  }, [initialUser]);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. Submit Profile & Payout Details
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileErrorMsg("");
    setProfileSuccessMsg("");

    try {
      const res = await updateAuthorProfileAction({
        name: profileData.name,
        phone: profileData.phone,
        country: profileData.country,
        authorBio: profileData.authorBio,
        bankDetails: {
          bankName: profileData.bankName,
          accountName: profileData.accountName,
          accountNumber: profileData.accountNumber,
          sortCodeOrRoutingNumber: profileData.sortCodeOrRoutingNumber,
        },
      });

      if (res.success) {
        setProfileSuccessMsg(res.message || "Profile details saved successfully!");
        if (res.user) {
          setProfileData({
            name: res.user.name || "",
            phone: res.user.phone || "",
            country: res.user.country || "",
            authorBio: res.user.authorBio || "",
            bankName: res.user.bankDetails?.bankName || "",
            accountName: res.user.bankDetails?.accountName || "",
            accountNumber: res.user.bankDetails?.accountNumber || "",
            sortCodeOrRoutingNumber: res.user.bankDetails?.sortCodeOrRoutingNumber || "",
          });
        }
        router.refresh();
      } else {
        setProfileErrorMsg(res.error || "Failed to update profile details.");
      }
    } catch (err: any) {
      setProfileErrorMsg(err.message || "An unexpected error occurred while saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Submit Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg("");
    setPasswordSuccessMsg("");

    if (!passwordData.newPassword) {
      setPasswordErrorMsg("Please enter a new password.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorMsg("Passwords do not match. Please verify your new password.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const res = await updateAuthorPasswordAction({
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (res.success) {
        setPasswordSuccessMsg(res.message || "Password updated successfully!");
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordErrorMsg(res.error || "Failed to update password.");
      }
    } catch (err: any) {
      setPasswordErrorMsg(err.message || "An unexpected error occurred while updating password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* ========================================================================= */}
      {/* FORM 1: PROFILE & PAYOUT DETAILS */}
      {/* ========================================================================= */}
      <form onSubmit={handleProfileSubmit} className="space-y-8">
        {/* Top Profile Alert (if active) */}
        {profileSuccessMsg && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-semibold animate-fade-in shadow-lg shadow-emerald-500/5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}

        {profileErrorMsg && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm font-semibold animate-fade-in shadow-lg shadow-rose-500/5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{profileErrorMsg}</span>
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
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
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
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
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
                  value={profileData.country}
                  onChange={handleProfileChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
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
              value={profileData.authorBio}
              onChange={handleProfileChange}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary resize-y transition-colors"
            />
          </div>
        </div>

        {/* 3. Payout & Bank Details */}
        <div id="payout-details" className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6 scroll-mt-24">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
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
                value={profileData.bankName}
                onChange={handleProfileChange}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
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
                value={profileData.accountName}
                onChange={handleProfileChange}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
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
                  value={profileData.accountNumber}
                  onChange={handleProfileChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary font-mono transition-colors"
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
                value={profileData.sortCodeOrRoutingNumber}
                onChange={handleProfileChange}
                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Profile Save Button & Inline Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Inline Profile Alert directly above/next to button */}
          <div className="flex-1 w-full">
            {profileSuccessMsg && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}
            {profileErrorMsg && (
              <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isSavingProfile ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Details</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ========================================================================= */}
      {/* FORM 2: SECURITY & PASSWORD (COMPLETELY SEPARATE) */}
      {/* ========================================================================= */}
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
              <KeyRound size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Security & Password</h2>
              <p className="text-xs text-gray-400">Update your account login password.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                New Password <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                Confirm New Password <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-type new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Password Action Button & Inline Feedback */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div className="flex-1 w-full">
              {passwordSuccessMsg && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}
              {passwordErrorMsg && (
                <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

