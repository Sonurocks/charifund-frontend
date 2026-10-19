export interface CampaignDonor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface CampaignDonorResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  donors: CampaignDonor[];
}
