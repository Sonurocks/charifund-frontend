"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../../services/admin/notificationApi";
import {
  NotificationListParams,
  NotificationListResponse,
} from "../../types/admin/notification";
import toast from "react-hot-toast";

export const useFetchNotifications = (params: NotificationListParams = {}) => {
  return useQuery<NotificationListResponse, Error>({
    queryKey: [
      "admin-notifications",
      params.page ?? 1,
      params.limit ?? 10,
      params.type ?? "all",
      params.status ?? "all",
    ],
    queryFn: () => fetchNotifications(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
  });
};

export const useFetchUnreadCount = () => {
  return useQuery<NotificationListResponse, Error>({
    queryKey: ["admin-notifications", "unread-count"],
    queryFn: () => fetchNotifications({ page: 1, limit: 1 }),
    staleTime: 30 * 1000,
    select: (data) => data,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to mark notification as read");
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast.success(data.msg || "All notifications marked as read");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to mark all as read");
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast.success("Notification deleted");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete notification");
    },
  });
};

export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (onlyRead?: boolean) => clearAllNotifications(onlyRead),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast.success(data.msg || "Notifications cleared");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to clear notifications");
    },
  });
};
