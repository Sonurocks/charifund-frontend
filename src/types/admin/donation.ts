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
  pendingAmount?: number;
  pendingCount?: number;
  pendingDonationsCount?: number;
}

export interface UnifiedDonation {
  id: string;
  donationId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  donorName?: string;
  email?: string;
  phone?: string;
  address?: string;
  message?: string;
  amount: number;
  receivedAmount?: number;
  type: "general" | "campaign" | string;
  paymentMethod: "online" | "offline" | string;
  paymentSubMethod?: "cash" | "cheque" | "bank_transfer" | "dd" | "other" | string;
  status: "completed" | "pending" | "failed" | "success" | "paid" | "verified" | string;
  campaignId?: string | number | null;
  campaign?: {
    id?: string | number;
    title?: { en?: string; hi?: string } | string;
    name?: string;
  } | null;
  campaignTitle?: { en?: string; hi?: string } | string;
  transactionId?: string;
  orderId?: string;
  referenceNumber?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  notes?: string;
  receivedDate?: string;
  verifiedAt?: string;
  verifiedBy?: string;
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
  status?: "all" | "pending" | "completed" | string;
  campaignId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateOfflineDonationPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  amount: number;
  type: "general" | "campaign";
  campaignId?: string;
  campaignTitle?: string;
  paymentSubMethod?: "cash" | "cheque" | "bank_transfer" | "dd" | "other" | string;
  referenceNumber?: string;
  receivedDate?: string;
  notes?: string;
}

export interface VerifyOfflineDonationPayload {
  receivedAmount?: number;
  amount?: number;
  receivedDate?: string;
  referenceNumber?: string;
  paymentSubMethod?: string;
  notes?: string;
}

export interface OfflinePledgeData {
  donationId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  donorAddress?: string;
  campaignTitle?: string;
  message?: string;
  createdAt?: string;
}

