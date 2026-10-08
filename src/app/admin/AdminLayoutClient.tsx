"use client";

import React from "react";
import AdminSideBar from "@/src/components/Admin/sidebar";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative md:flex gap-2 h-screen">
      <AdminSideBar />
      <div className="pt-12 max-h-screen overflow-y-scroll w-full px-5">
        {children}
      </div>
    </div>
  );
}
