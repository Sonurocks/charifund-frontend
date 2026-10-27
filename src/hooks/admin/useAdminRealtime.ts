"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

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
 * Automatically connects to backend SSE stream, debounces queries to prevent server contention
 * during high-frequency donation bursts, and triggers bell notifications on the header.
 */
export const useAdminRealtime = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const debouncedRefetchTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced cache invalidator (200ms window)
  const scheduleDebouncedRefetch = useCallback(() => {
    if (debouncedRefetchTimer.current) {
      clearTimeout(debouncedRefetchTimer.current);
    }

    debouncedRefetchTimer.current = setTimeout(() => {
      // Invalidate queries so TanStack Query automatically refetches all active views with fresh data
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      queryClient.invalidateQueries({ queryKey: ["unified-donations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["queries"] });
    }, 200);
  }, [queryClient]);

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

    const triggerBellBuzz = (data?: any) => {
      try {
        window.dispatchEvent(
          new CustomEvent("admin-notification:buzz", { detail: data })
        );
      } catch (e) {
        console.error("[useAdminRealtime] Failed to dispatch buzz event", e);
      }
    };

    const triggerDataUpdate = (data?: any) => {
      try {
        window.dispatchEvent(
          new CustomEvent("admin-realtime:donation", { detail: data })
        );
      } catch (e) {
        console.error("[useAdminRealtime] Failed to dispatch donation event", e);
      }
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

        // 1. Live Notification Event (Dispatches bell shake animation + debounced refetch)
        es.addEventListener("notification:new", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            console.log("[useAdminRealtime] ⚡ Realtime notification:new event received:", data);
            triggerBellBuzz(data);
            triggerDataUpdate(data);
            scheduleDebouncedRefetch();
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse notification:new payload", e);
          }
        });

        // 2. Live Donation Event (online payment, offline pledge, direct offline entry)
        es.addEventListener("donation:created", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: DonationPayload = JSON.parse(event.data);
            console.log("[useAdminRealtime] ⚡ Realtime donation:created event received:", data);
            triggerBellBuzz(data);
            triggerDataUpdate(data);
            scheduleDebouncedRefetch();
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse donation:created payload", e);
          }
        });

        // 3. Offline Donation Verified
        es.addEventListener("donation:verified", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: DonationPayload = JSON.parse(event.data);
            console.log("[useAdminRealtime] ⚡ Realtime donation:verified event received:", data);
            triggerBellBuzz(data);
            triggerDataUpdate(data);
            scheduleDebouncedRefetch();
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse donation:verified payload", e);
          }
        });

        // 4. Campaign Created, Updated, or Deleted
        es.addEventListener("campaign:updated", (event: MessageEvent) => {
          if (!isMounted) return;
          console.log("[useAdminRealtime] ⚡ Realtime campaign:updated event received:", event.data);
          queryClient.invalidateQueries({ queryKey: ["campaigns"], refetchType: "all" });
          queryClient.invalidateQueries({ queryKey: ["campaign"], refetchType: "all" });
          triggerDataUpdate(event.data);
          scheduleDebouncedRefetch();
        });

        // 5. Contact or Volunteer Inquiry Created
        es.addEventListener("inquiry:created", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data: InquiryPayload = JSON.parse(event.data);
            console.log("[useAdminRealtime] ⚡ Realtime inquiry:created event received:", data);
            triggerBellBuzz(data);
            queryClient.invalidateQueries({ queryKey: ["queries"], refetchType: "all" });
            queryClient.invalidateQueries({ queryKey: ["query"], refetchType: "all" });
            scheduleDebouncedRefetch();
          } catch (e) {
            console.error("[useAdminRealtime] Failed to parse inquiry:created payload", e);
          }
        });

        // 6. Notification Mutations (Read, Deleted, Cleared)
        const handleNotifMutationEvent = () => {
          queryClient.invalidateQueries({ queryKey: ["admin-notifications"], refetchType: "all" });
          queryClient.refetchQueries({ queryKey: ["admin-notifications"], type: "active" });
        };
        es.addEventListener("notification:updated", handleNotifMutationEvent);
        es.addEventListener("notification:all_read", handleNotifMutationEvent);
        es.addEventListener("notification:deleted", handleNotifMutationEvent);
        es.addEventListener("notification:cleared", handleNotifMutationEvent);

        es.onerror = (err) => {
          if (!isMounted) return;
          setIsConnected(false);

          // Native EventSource auto-reconnects if readyState is CONNECTING.
          // Only manual reconnect if connection is completely CLOSED.
          if (es.readyState === EventSource.CLOSED) {
            console.warn("[useAdminRealtime] SSE connection closed. Reconnecting in 5s...");
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
              if (isMounted) connectSse();
            }, 5000);
          }
        };
      } catch (err) {
        console.error("[useAdminRealtime] Failed to instantiate EventSource:", err);
        setIsConnected(false);
      }
    };

    connectSse();

    // Re-verify connection on tab visibility change if closed
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
      if (debouncedRefetchTimer.current) {
        clearTimeout(debouncedRefetchTimer.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [queryClient, scheduleDebouncedRefetch]);

  return { isConnected };
};
