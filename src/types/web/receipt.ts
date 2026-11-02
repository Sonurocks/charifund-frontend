export interface ReceiptDonorInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  pan?: string;
}

export interface ReceiptOrgInfo {
  name: string;
  tagline?: string;
  address?: string;
  branchAddress?: string;
  email?: string;
  phone?: string;
  website?: string;
  regNumber?: string;
  panNumber?: string;
  signatoryTitle?: string;
}

export interface DonationReceipt {
  receiptNumber: string;
  orderId: string;
  paymentId: string;
  paymentMethod?: string;
  paymentStatus: string;
  paymentDate: string;
  amount: number;
  amountInWords?: string;
  currency?: string;
  campaignTitle?: string;
  campaignId?: string;
  donor: ReceiptDonorInfo;
  organization?: ReceiptOrgInfo;
  taxNote?: string;
  isVerified: boolean;
}
