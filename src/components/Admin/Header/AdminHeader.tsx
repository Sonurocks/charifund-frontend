"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdNotificationsNone,
  MdNotificationsActive,
  MdCheckCircle,
  MdOutlineDoneAll,
  MdVolunteerActivism,
  MdEmail,
  MdCampaign,
  MdArrowForward,
} from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import Logout from "@/src/components/UI/admin/Logout";
import {
  useFetchNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/src/hooks/admin/useNotifications";
import { AdminNotification } from "@/src/types/admin/notification";

interface AdminHeaderProps {
  isConnected?: boolean;
}

export default function AdminHeader({ isConnected = false }: AdminHeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isBuzzing, setIsBuzzing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch recent notifications for dropdown preview
  const { data: notifData } = useFetchNotifications({ page: 1, limit: 5 });
  const markAllReadMutation = useMarkAllNotificationsRead();
  const markReadMutation = useMarkNotificationRead();

  const unreadCount = notifData?.unreadCount ?? 0;
  const recentNotifications = notifData?.notifications ?? [];

  // Listen for buzz event triggered by realtime SSE
  useEffect(() => {
    const handleBuzz = () => {
      setIsBuzzing(true);
      setTimeout(() => setIsBuzzing(false), 1200);
    };

    window.addEventListener("admin-notification:buzz", handleBuzz);
    return () => window.removeEventListener("admin-notification:buzz", handleBuzz);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now.getTime() - past.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return "Just now";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDay = Math.floor(diffHr / 24);
      return `${diffDay}d ago`;
    } catch {
      return "Recently";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "donation":
        return <FaHandHoldingHeart className="w-4 h-4 text-emerald-600" />;
      case "offline_verification":
        return <MdVolunteerActivism className="w-4 h-4 text-blue-600" />;
      case "inquiry":
        return <MdEmail className="w-4 h-4 text-purple-600" />;
      case "campaign":
        return <MdCampaign className="w-4 h-4 text-amber-600" />;
      default:
        return <MdNotificationsNone className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (n: AdminNotification) => {
    if (!n.isRead) {
      markReadMutation.mutate(n.id);
    }
    setDropdownOpen(false);
    if (n.type === "donation" || n.type === "offline_verification") {
      router.push("/admin/donations");
    } else if (n.type === "inquiry") {
      router.push("/admin/queries");
    } else {
      router.push("/admin/notifications");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-end px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-xs">
      {/* Right: Notification Bell & Logout */}
      <div className="flex items-center gap-3 sm:gap-4" ref={dropdownRef}>
        {/* Notification Bell with Badge & Wobble Animation */}
        <div className="relative">
          <motion.button
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Notifications"
            className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-700 hover:text-black focus:outline-hidden"
            animate={
              isBuzzing
                ? {
                    rotate: [0, -18, 18, -14, 14, -8, 8, -4, 4, 0],
                    scale: [1, 1.25, 0.95, 1.15, 1],
                  }
                : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.9, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {unreadCount > 0 ? (
              <MdNotificationsActive className="w-6 h-6 text-yellow" />
            ) : (
              <MdNotificationsNone className="w-6 h-6" />
            )}

            {/* Unread Count Badge */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </motion.button>

          {/* Quick Dropdown Preview */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                {/* Dropdown Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllReadMutation.mutate()}
                      disabled={markAllReadMutation.isPending}
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <MdOutlineDoneAll className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Dropdown Notification List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {recentNotifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-1">
                      <MdCheckCircle className="w-8 h-8 text-gray-300" />
                      <span>No notifications yet</span>
                    </div>
                  ) : (
                    recentNotifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 flex gap-3 items-start cursor-pointer transition-colors hover:bg-gray-50 ${
                          !item.isRead ? "bg-amber-50/70" : ""
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-gray-100 shrink-0">
                          {getNotificationIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4
                              className={`text-xs truncate ${
                                !item.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {formatTimeAgo(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-2">{item.message}</p>
                        </div>
                        {!item.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Dropdown Footer */}
                <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                  <Link
                    href="/admin/notifications"
                    onClick={() => setDropdownOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-semibold text-gray-700 hover:text-green transition-colors"
                  >
                    <span>View All Notifications</span>
                    <MdArrowForward className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Logout Button */}
        <Logout />
      </div>
    </header>
  );
}
