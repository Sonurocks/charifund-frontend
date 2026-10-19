"use client";

import React from "react";
import AdminSideBar from "@/src/components/Admin/sidebar";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col md:flex-row gap-0 md:gap-2 h-screen overflow-hidden">
      <AdminSideBar />
      <div className="flex-1 min-h-0 pt-4 md:pt-12 overflow-y-auto overflow-x-hidden w-full min-w-0 px-3 sm:px-5 pb-4 sm:pb-6">
        {children}
      </div>
    </div>
  );
}
