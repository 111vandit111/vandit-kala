import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminNav from "../../../lib/admin/AdminNav";
import { isAdminSession } from "../../../lib/server/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin",
};

const AdminLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  if (!(await isAdminSession())) redirect("/");

  return (
    <div className="flex min-h-screen sm:flex-col">
      <div className="sm:sticky sm:top-0 sm:z-40">
        <AdminNav />
      </div>
      <main className="min-w-0 flex-1 p-6 sm:p-3">{children}</main>
    </div>
  );
};

export default AdminLayout;
