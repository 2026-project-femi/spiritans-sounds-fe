"use client";

import React, { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface LogoutButtonProps {
  variant?: "default" | "compact";
  className?: string;
}

export default function LogoutButton({ variant = "default", className = "" }: LogoutButtonProps) {
  const { refetchUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/users/logout", { method: "POST" });
      await refetchUser();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to log out", error);
      setIsLoggingOut(false);
    }
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        title="Log Out"
        aria-label="Log Out"
        className={`inline-flex items-center justify-center p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 min-h-[44px] min-w-[44px] ${className}`}
      >
        {isLoggingOut ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <LogOut size={20} strokeWidth={2.2} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      aria-label="Log Out"
      className={`w-full flex items-center justify-center sm:justify-start gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 rounded-xl transition-all shadow-sm min-h-[44px] disabled:opacity-50 cursor-pointer ${className}`}
    >
      {isLoggingOut ? (
        <Loader2 size={20} className="animate-spin shrink-0" />
      ) : (
        <LogOut size={20} strokeWidth={2.2} className="shrink-0" />
      )}
      <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
    </button>
  );
}
