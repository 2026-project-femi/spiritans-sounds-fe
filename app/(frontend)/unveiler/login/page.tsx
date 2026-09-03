"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function AuthorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const { refetchUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // Payload sets the cookie automatically.
        if (data.user.role === "author" || data.user.role === "publishing_admin" || data.user.role === "admin") {
            await refetchUser();
            router.push("/unveiler/dashboard");
            router.refresh();
        } else {
            setErrorMsg("You do not have author permissions.");
            // Optional: Logout if they shouldn't be here
        }
      } else {
        setErrorMsg(data.errors?.[0]?.message || "Invalid email or password.");
      }
    } catch (err) {
      setErrorMsg("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-foreground py-20 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#121214] border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-primary font-black border border-brand-primary/30 px-3 py-1 rounded-full">
            Author Portal
          </span>
          <h1 className="text-3xl font-black text-white mt-4">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Login to your Treasures Unveiler Dashboard to track your publications and earnings.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-center text-sm mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-white font-black rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Want to become an author?{" "}
          <Link href="/unveiler/publish" className="text-brand-primary font-bold hover:underline">
            Submit your manuscript
          </Link>
        </div>
      </div>
    </main>
  );
}
