"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineDoneAll,
  MdDeleteOutline,
  MdCheckCircle,
  MdVolunteerActivism,
  MdEmail,
  MdCampaign,
  MdCheck,
  MdArrowForward,
  MdRefresh,
} from "react-icons/md";
import { FaHandHoldingHeart, FaRegBell } from "react-icons/fa";
import AdminCustomPagination from "@/src/components/UI/admin/CustomePagination";
import {
  useFetchNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useClearAllNotifications,
} from "@/src/hooks/admin/useNotifications";
import { AdminNotification } from "@/src/types/admin/notification";

type FilterTab = "all" | "donation" | "inquiry" | "unread";

export default function NotificationsComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Map active tab to API params
  const apiParams = {
    page: currentPage,
    limit: 10,
    type: activeTab === "unread" ? "all" : activeTab,
    status: (activeTab === "unread" ? "unread" : "all") as "all" | "unread" | "read",
  };

  const {
    data: notifData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchNotifications(apiParams);

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();
  const clearAllMutation = useClearAllNotifications();

  const notifications = notifData?.notifications ?? [];
  const totalPages = notifData?.totalPages ?? 1;
  const total = notifData?.total ?? 0;
  const unreadCount = notifData?.unreadCount ?? 0;

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const formatRelativeTime = (dateString: string) => {
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
      if (diffDay === 1) return "Yesterday";
      if (diffDay < 7) return `${diffDay}d ago`;
      return past.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "donation":
        return <FaHandHoldingHeart className="w-5 h-5 text-emerald-600" />;
      case "offline_verification":
        return <MdVolunteerActivism className="w-5 h-5 text-blue-600" />;
      case "inquiry":
        return <MdEmail className="w-5 h-5 text-purple-600" />;
      case "campaign":
        return <MdCampaign className="w-5 h-5 text-amber-600" />;
      default:
        return <FaRegBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "donation":
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Donation
          </span>
        );
      case "offline_verification":
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Verification
          </span>
        );
      case "inquiry":
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Inquiry
          </span>
        );
      case "campaign":
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Campaign
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
            System
          </span>
        );
    }
  };

  const handleClearAll = () => {
    clearAllMutation.mutate(false, {
      onSuccess: () => {
        setShowClearConfirm(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time feed of incoming donations, inquiries, verifications, and system events.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
            title="Refresh notifications"
          >
            <MdRefresh className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <MdOutlineDoneAll className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={clearAllMutation.isPending}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <MdDeleteOutline className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange("all")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "all"
              ? "bg-yellow text-foreground shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Activities {total > 0 && `(${total})`}
        </button>

        <button
          onClick={() => handleTabChange("donation")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "donation"
              ? "bg-yellow text-foreground shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Donations
        </button>

        <button
          onClick={() => handleTabChange("inquiry")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "inquiry"
              ? "bg-yellow text-foreground shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Inquiries & Volunteers
        </button>

        <button
          onClick={() => handleTabChange("unread")}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === "unread"
              ? "bg-yellow text-foreground shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Unread Only {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow border-t-transparent mb-3" />
            <p className="text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
              <MdCheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-gray-800">All caught up!</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm">
              No notifications found under the "{activeTab}" filter. Real-time updates will appear
              here automatically when activity happens.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((item: AdminNotification) => {
              const metadata = item.metadata || {};
              const hasAmount = metadata.amount !== undefined && metadata.amount !== null;
              const formattedAmount = hasAmount
                ? `₹${Number(metadata.amount).toLocaleString("en-IN")}`
                : null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    !item.isRead
                      ? "bg-amber-50/30 border-amber-200/80 shadow-xs"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Icon & Content */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="p-3 rounded-2xl bg-gray-100 shrink-0">
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {getTypeBadge(item.type)}
                          <h4
                            className={`text-sm ${
                              !item.isRead ? "font-bold text-gray-900" : "font-semibold text-gray-700"
                            }`}
                          >
                            {item.title}
                          </h4>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-yellow shrink-0" />
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-relaxed">
                          {item.message}
                        </p>

                        {/* Metadata Pills */}
                        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                          {formattedAmount && (
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Amount: {formattedAmount}
                            </span>
                          )}

                          {metadata.donorName && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                              Donor: <strong className="text-gray-700">{metadata.donorName}</strong>
                            </span>
                          )}

                          {metadata.receiptNumber && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono text-[11px]">
                              Receipt: {metadata.receiptNumber}
                            </span>
                          )}

                          {metadata.campaignTitle && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-xs">
                              Campaign: {metadata.campaignTitle}
                            </span>
                          )}

                          {metadata.email && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono text-[11px]">
                              Email: {metadata.email}
                            </span>
                          )}

                          {metadata.phone && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                              Phone: {metadata.phone}
                            </span>
                          )}

                          <span className="text-gray-400 text-[11px] ml-auto">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0 pt-1 sm:pt-0">
                      {(item.type === "donation" || item.type === "offline_verification") && (
                        <Link
                          href="/admin/donations"
                          className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-green hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                          title="View in donations table"
                        >
                          <span>View</span>
                          <MdArrowForward className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {item.type === "inquiry" && (
                        <Link
                          href="/admin/queries"
                          className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-green hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                          title="View in inquiries table"
                        >
                          <span>View</span>
                          <MdArrowForward className="w-3.5 h-3.5" />
                        </Link>
                      )}

                      {!item.isRead && (
                        <button
                          onClick={() => markReadMutation.mutate(item.id)}
                          disabled={markReadMutation.isPending}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <MdCheck className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-red hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete notification"
                      >
                        <MdDeleteOutline className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="pt-4 flex justify-end">
          <AdminCustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear All Notifications?</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              This will permanently delete all notifications from your notification feed. This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearAllMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-white bg-red hover:bg-red/90 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {clearAllMutation.isPending ? "Clearing..." : "Yes, Clear All"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
