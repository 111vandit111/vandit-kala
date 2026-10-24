"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { adminFetch } from "./adminFetch";

export const ADMIN_NAV = [
  { label: "Analytics", href: "/admin" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Education", href: "/admin/education" },
  { label: "Texts", href: "/admin/texts" },
];

const LINK_BASE = "flex min-h-11 items-center whitespace-nowrap rounded-lg px-4 font-semibold focus-visible:ring-2 focus-visible:ring-prime outline-none";

const AdminNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await adminFetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav aria-label="Admin" className="flex w-60 shrink-0 flex-col gap-1 bg-prime-navy p-4 sm:w-full sm:flex-row sm:items-center sm:gap-1 sm:overflow-x-auto sm:p-2">
      <p className="mb-4 px-4 text-xl font-bold sm:hidden">Admin</p>
      {ADMIN_NAV.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`${LINK_BASE} ${isActive ? "bg-prime text-white" : "text-white/80 hover:bg-white/10"}`}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-4 sm:mt-0 sm:flex-row sm:border-l sm:border-t-0 sm:pl-2 sm:pt-0">
        <Link href="/" className={`${LINK_BASE} text-white/80 hover:bg-white/10`}>View site</Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`${LINK_BASE} text-left text-alert-error hover:bg-white/10 disabled:opacity-50`}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </nav>
  );
};

export default AdminNav;
