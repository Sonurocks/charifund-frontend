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
 * Automatically connects to backend SSE stream, refetches active TanStack Query caches,
 * and triggers live toast alerts when events occur.
 */
export const useAdminRealtime = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const getToken = () => {
      return (
        Cookies.get("token") ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : null)
      );
    };

    const connectSse = () => {
      const token = getToken();
      if (!token) {
        setIsConnected(false);
        return;
      }

      // Close previous connection if active
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // Resolve backend API URL with localhost fallback
      let apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      if (!apiBase && typeof window !== "undefined") {
        if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          apiBase = "http://localhost:8081/api/V1";
        } else {
          apiBase = "https://tunnel.yuwaindia.org/api/V1";
        }
      }

      const realtimeEndpoint = apiBase.endsWith("/api/V1")
        ? `${apiBase}/admin/realtime`
        : `${apiBase}/api/V1/admin/realtime`;

      const streamUrl = `${realtimeEndpoint}?token=${encodeURIComponent(token)}`;
      console.log("[useAdminRealtime] Connecting to SSE endpoint:", streamUrl);

      try {
        // Standard EventSource without withCredentials prevents CORS wildcard rejection in browsers
        const es = new EventSource(streamUrl);
        eventSourceRef.current = es;

        es.addEventListener("open", () => {
          if (!isMounted) return;
          setIsConnected(true);
          console.log("[useAdminRealtime] SSE connection established successfully ✅");
        });

        es.addEventListener("connected", (event: MessageEvent) => {
          if (!isMounted) return;
          setIsConnected(true);
          console.log("[useAdminRealtime] Received 'connected' handshake event:", event.data);
        });

        // 1. Live Donation Event (online payment, offline pledge, direct offline entry)
        es.addEventListener("donation:created", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: DonationPayload = JSON.parse(event.data);
            console.log("[useAdminRealtime] ⚡ Realtime donation:created event received:", data);

            const formattedAmount = data.amount
              ? `₹${Number(data.amount).toLocaleString("en-IN")}`
              : "a donation";
            const donor = data.donorName || "Generous Donor";

            // Invalidate all related caches
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["dashboard"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["unified-donations"], refetchType: "all" });

            // Force immediate active network refetch on the currently viewed page
            queryClient.refetchQueries({ queryKey: ["dashboard-data"], type: "active" });
            queryClient.refetchQueries({ queryKey: ["dashboard"], type: "active" });
            queryClient.refetchQueries({ queryKey: ["unified-donations"], type: "active" });

            // Display toast notification
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

        // 2. Offline Donation Verified
        es.addEventListener("donation:verified", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: DonationPayload = JSON.parse(event.data);
            console.log("[useAdminRealtime] ⚡ Realtime donation:verified event received:", data);

            const formattedAmount = data.amount
              ? `₹${Number(data.amount).toLocaleString("en-IN")}`
              : "a donation";
            const donor = data.donorName || "Donor";

            queryClient.invalidateQueries({ queryKey: ["dashboard-data"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["dashboard"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["unified-donations"], refetchType: "all" });

            queryClient.refetchQueries({ queryKey: ["dashboard-data"], type: "active" });
            queryClient.refetchQueries({ queryKey: ["dashboard"], type: "active" });
            queryClient.refetchQueries({ queryKey: ["unified-donations"], type: "active" });

            toast.success(`✅ Offline Donation Verified: ${formattedAmount} for ${donor}`, {
              duration: 5000,
            });
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse donation:verified payload", e);
          }
        });

        // 3. Campaign Created, Updated, or Deleted
        es.addEventListener("campaign:updated", (event: MessageEvent) => {
          if (!isMounted) return;
          console.log("[useAdminRealtime] ⚡ Realtime campaign:updated event received:", event.data);

          queryClient.invalidateQueries({ queryKey: ["campaigns"], refetchType: "all" });
          queryClient.invalidateQueries({ queryKey: ["campaign"], refetchType: "all" });
          queryClient.invalidateQueries({ queryKey: ["dashboard-data"], refetchType: "all" });
          queryClient.invalidateQueries({ queryKey: ["dashboard"], refetchType: "all" });

          queryClient.refetchQueries({ queryKey: ["campaigns"], type: "active" });
          queryClient.refetchQueries({ queryKey: ["dashboard-data"], type: "active" });
          queryClient.refetchQueries({ queryKey: ["dashboard"], type: "active" });
        });

        // 4. Contact or Volunteer Inquiry Created
        es.addEventListener("inquiry:created", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: InquiryPayload = JSON.parse(event.data);
            console.log("[useAdminRealtime] ⚡ Realtime inquiry:created event received:", data);

            const typeLabel =
              data.type === "volunteer" ? "Volunteer Application" : "Contact Inquiry";
            const sender = data.name || "Someone";

            queryClient.invalidateQueries({ queryKey: ["queries"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["query"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"], refetchType: "all" });

            queryClient.refetchQueries({ queryKey: ["queries"], type: "active" });
            queryClient.refetchQueries({ queryKey: ["dashboard-data"], type: "active" });

            toast(`📬 New ${typeLabel} from ${sender}`, {
              duration: 5000,
            });
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse inquiry:created payload", e);
          }
        });

        es.onerror = (err) => {
          if (!isMounted) return;
          console.warn("[useAdminRealtime] EventSource error or disconnect:", err);
          setIsConnected(false);

          if (es.readyState === EventSource.CLOSED) {
            reconnectTimeout = setTimeout(() => {
              if (isMounted) connectSse();
            }, 3000);
          }
        };
      } catch (err) {
        console.error("[useAdminRealtime] Failed to instantiate EventSource:", err);
        setIsConnected(false);
      }
    };

    connectSse();

    // Check periodically if auth token appeared (e.g. user just logged in)
    const tokenCheckInterval = setInterval(() => {
      if (!eventSourceRef.current && getToken()) {
        connectSse();
      }
    }, 3000);

    // Re-verify connection on tab visibility change
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
      clearInterval(tokenCheckInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [queryClient]);

  return { isConnected };
};
