"use client";

import React from "react";
import AdminSideBar from "@/src/components/Admin/sidebar";
import AdminHeader from "@/src/components/Admin/Header/AdminHeader";
import { useAdminRealtime } from "@/src/hooks/admin/useAdminRealtime";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  // Real-time SSE listener for live donations, campaigns, and inquiries
  const { isConnected } = useAdminRealtime();

  return (
    <div className="relative flex flex-col md:flex-row gap-0 md:gap-2 h-screen overflow-hidden bg-[#f9fafb]">
      <AdminSideBar />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden w-full min-w-0">
        <AdminHeader isConnected={isConnected} />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full min-w-0 px-3 sm:px-5 py-4 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
