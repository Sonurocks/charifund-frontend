import api from "./api";
import {
  AdminNotification,
  NotificationListParams,
  NotificationListResponse,
} from "../../types/admin/notification";

const buildNotificationQueryParams = (params: NotificationListParams = {}): string => {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }
  if (params.type && params.type !== "all") {
    query.set("type", params.type);
  }
  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Fetch paginated admin notifications
 */
export const fetchNotifications = async (
  params: NotificationListParams = {}
): Promise<NotificationListResponse> => {
  const queryStr = buildNotificationQueryParams(params);
  const { data } = await api.get<NotificationListResponse>(`/admin/notification${queryStr}`);
  return data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (
  id: string
): Promise<{ msg: string; notification: AdminNotification; unreadCount: number }> => {
  const { data } = await api.patch<{ msg: string; notification: AdminNotification; unreadCount: number }>(
    `/admin/notification/${id}/read`
  );
  return data;
};

/**
 * Mark all unread notifications as read
 */
export const markAllNotificationsRead = async (): Promise<{
  msg: string;
  updatedCount: number;
  unreadCount: number;
}> => {
  const { data } = await api.patch<{ msg: string; updatedCount: number; unreadCount: number }>(
    `/admin/notification/mark-all-read`
  );
  return data;
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (
  id: string
): Promise<{ msg: string; deletedId: string; unreadCount: number }> => {
  const { data } = await api.delete<{ msg: string; deletedId: string; unreadCount: number }>(
    `/admin/notification/${id}`
  );
  return data;
};

/**
 * Clear notifications (either all or only read ones)
 */
export const clearAllNotifications = async (
  onlyRead: boolean = false
): Promise<{ msg: string; deletedCount: number; unreadCount: number }> => {
  const query = onlyRead ? "?onlyRead=true" : "";
  const { data } = await api.delete<{ msg: string; deletedCount: number; unreadCount: number }>(
    `/admin/notification/clear-all${query}`
  );
  return data;
};
