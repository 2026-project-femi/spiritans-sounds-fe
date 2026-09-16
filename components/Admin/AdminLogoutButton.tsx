"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Loader2 } from "lucide-react";
import { useConfig } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";

export function AdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { config } = useConfig();

  const adminRoute = config?.routes?.admin || "/admin";
  const logoutRoute = config?.admin?.routes?.logout || "/logout";
  const logoutHref = formatAdminURL({ adminRoute, path: logoutRoute }) || "/admin/logout";

  return (
    <Link
      href={logoutHref}
      prefetch={false}
      onClick={() => setIsLoggingOut(true)}
      title="Log out of Admin Panel"
      aria-label="Log out of Admin Panel"
      className="payload-admin-nav-logout"
    >
      {isLoggingOut ? (
        <Loader2 className="payload-logout-icon animate-spin" size={22} />
      ) : (
        <LogOut className="payload-logout-icon" size={22} strokeWidth={2.2} />
      )}
      <span className="payload-logout-label">Log Out</span>
    </Link>
  );
}

export default AdminLogoutButton;
