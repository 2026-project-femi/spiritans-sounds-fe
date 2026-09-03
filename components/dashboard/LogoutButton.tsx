"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function LogoutButton() {
  const { refetchUser } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" });
      await refetchUser();
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
    >
      <LogOut size={18} />
      Log Out
    </button>
  );
}
