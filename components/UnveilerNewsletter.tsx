"use client";

import React, { useState } from "react";
import { Users, Loader2 } from "lucide-react";

export const UnveilerNewsletter: React.FC = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
            } else {
                throw new Error(data.message || "Something went wrong");
            }
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message);
        }
    };

    return (
        <section className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-brand-primary to-red-800 blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative p-8 rounded-3xl border border-brand-primary/20 bg-black/40 backdrop-blur-xl">
                <Users className="w-10 h-10 text-brand-primary mb-4" />
                <h3 className="text-xl font-black text-white mb-2 tracking-tight">The Unveiler Digest</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Join 2,000+ creators and believers. Get event invites and spiritual treasures in your inbox.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your sacred email"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-primary/50 transition-all text-xs"
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3 bg-white text-black text-xs font-black rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2">
                        {status === "loading" ? (
                            <>
                                Joining <Loader2 className="w-3 h-3 animate-spin" />
                            </>
                        ) : (
                            "Join The Mission"
                        )}
                    </button>
                    {status === "success" && <p className="text-[10px] text-green-500 mt-2">{message}</p>}
                    {status === "error" && <p className="text-[10px] text-red-500 mt-2">{message}</p>}
                </form>
            </div>
        </section>
    );
};
