export interface AdminNotification {
  id: string;
  type: "donation" | "offline_verification" | "inquiry" | "campaign" | string;
  title: string;
  message: string;
  metadata?: {
    donationId?: string | number;
    amount?: number;
    receiptNumber?: string;
    donorName?: string;
    campaignTitle?: string;
    inquiryType?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  } | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: "all" | "unread" | "read";
}

export interface NotificationListResponse {
  notifications: AdminNotification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}
