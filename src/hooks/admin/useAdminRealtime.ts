"use client";

import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface DonationPayload {
  donationId?: string | number;
  type?: "online" | "offline" | "direct_offline";
  amount?: number;
  receiptNumber?: string;
  donorName?: string;
  campaignTitle?: string;
  emittedAt?: string;
}

interface CampaignPayload {
  action?: "create" | "update" | "delete";
  campaignId?: string | number;
  emittedAt?: string;
}

interface InquiryPayload {
  type?: "contact" | "volunteer";
  name?: string;
  email?: string;
  phone?: string;
  emittedAt?: string;
}

/**
 * Custom React Hook for real-time Server-Sent Events (SSE) updates on the Admin Dashboard.
 * Automatically invalidates relevant TanStack Query caches (dashboard metrics, donations table,
 * campaigns, inquiries) and displays subtle toast notifications when live events occur.
 */
export const useAdminRealtime = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSse = () => {
      // Retrieve auth token from cookies
      const token = Cookies.get("token");
      if (!token) {
        setIsConnected(false);
        return;
      }

      // Clean up any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // Determine backend API base URL
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const realtimeEndpoint = apiBase
        ? apiBase.endsWith("/api/V1")
          ? `${apiBase}/admin/realtime`
          : `${apiBase}/api/V1/admin/realtime`
        : "/api/V1/admin/realtime";

      const streamUrl = `${realtimeEndpoint}?token=${encodeURIComponent(token)}`;

      try {
        const es = new EventSource(streamUrl, { withCredentials: true });
        eventSourceRef.current = es;

        es.addEventListener("connected", () => {
          if (!isMounted) return;
          setIsConnected(true);
        });

        // 1. Live Donation Created (Online payment, offline pledge, or direct offline entry)
        es.addEventListener("donation:created", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: DonationPayload = JSON.parse(event.data);
            const formattedAmount = data.amount
              ? `₹${Number(data.amount).toLocaleString("en-IN")}`
              : "a donation";
            const donor = data.donorName || "Generous Donor";

            // Invalidate React Query caches for immediate UI sync without full page reload
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["unified-donations"] });

            // Display contextual toast notification
            if (data.type === "offline") {
              toast(`📝 New Offline Pledge: ${formattedAmount} from ${donor}`, {
                duration: 5000,
              });
            } else if (data.type === "direct_offline") {
              toast(`📋 Direct Offline Donation: ${formattedAmount} recorded for ${donor}`, {
                duration: 5000,
              });
            } else {
              toast(`🎉 New Donation: ${formattedAmount} received from ${donor}`, {
                duration: 5000,
              });
            }
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse donation:created payload", e);
          }
        });

        // 2. Offline Donation Verified by Admin
        es.addEventListener("donation:verified", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: DonationPayload = JSON.parse(event.data);
            const formattedAmount = data.amount
              ? `₹${Number(data.amount).toLocaleString("en-IN")}`
              : "a donation";
            const donor = data.donorName || "Donor";

            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["unified-donations"] });

            toast.success(`✅ Offline Donation Verified: ${formattedAmount} for ${donor}`, {
              duration: 5000,
            });
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse donation:verified payload", e);
          }
        });

        // 3. Campaign Created, Updated, or Deleted
        es.addEventListener("campaign:updated", () => {
          if (!isMounted) return;
          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
          queryClient.invalidateQueries({ queryKey: ["campaign"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        });

        // 4. Contact Query or Volunteer Inquiry Received
        es.addEventListener("inquiry:created", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: InquiryPayload = JSON.parse(event.data);
            const typeLabel =
              data.type === "volunteer" ? "Volunteer Application" : "Contact Inquiry";
            const sender = data.name || "Someone";

            queryClient.invalidateQueries({ queryKey: ["queries"] });
            queryClient.invalidateQueries({ queryKey: ["query"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });

            toast(`📬 New ${typeLabel} from ${sender}`, {
              duration: 5000,
            });
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse inquiry:created payload", e);
          }
        });

        es.onerror = () => {
          if (!isMounted) return;
          setIsConnected(false);
          // EventSource handles reconnection natively, but if the socket closed, retry after delay
          if (es.readyState === EventSource.CLOSED) {
            reconnectTimeout = setTimeout(() => {
              if (isMounted) connectSse();
            }, 5000);
          }
        };
      } catch (err) {
        console.error("[useAdminRealtime] Failed to establish SSE connection:", err);
        setIsConnected(false);
      }
    };

    connectSse();

    // Re-verify connection on tab visibility change (e.g. laptop wake or tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
          connectSse();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [queryClient]);

  return { isConnected };
};
