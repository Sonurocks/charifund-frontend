export interface DonationSummary {
  totalAmount?: number;
  totalCollected?: number;
  generalAmount?: number;
  generalDonations?: number;
  campaignAmount?: number;
  campaignDonations?: number;
  offlineAmount?: number;
  offlineCollections?: number;
  onlineAmount?: number;
  onlineCount?: number;
  totalDonationsCount?: number;
  totalCount?: number;
  generalDonationsCount?: number;
  generalCount?: number;
  campaignDonationsCount?: number;
  campaignCount?: number;
  offlineDonationsCount?: number;
  offlineCount?: number;
}

export interface UnifiedDonation {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  donorName?: string;
  email?: string;
  phone?: string;
  address?: string;
  amount: number;
  type: "general" | "campaign" | string;
  paymentMethod: "online" | "offline" | string;
  status: "completed" | "pending" | "failed" | "success" | string;
  campaignId?: string | number | null;
  campaign?: {
    id?: string | number;
    title?: { en?: string; hi?: string } | string;
    name?: string;
  } | null;
  campaignTitle?: { en?: string; hi?: string } | string;
  transactionId?: string;
  orderId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DonationListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  donations: UnifiedDonation[];
  summary: DonationSummary;
}

export interface DonationFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "all" | "general" | "campaign";
  paymentMethod?: "all" | "online" | "offline";
  campaignId?: string;
  startDate?: string;
  endDate?: string;
}
