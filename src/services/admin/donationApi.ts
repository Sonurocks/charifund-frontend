import api from "./api";
import {
  DonationFilterParams,
  DonationListResponse,
  CreateOfflineDonationPayload,
  VerifyOfflineDonationPayload,
  UnifiedDonation,
} from "../../types/admin/donation";

/**
 * Builds query string from DonationFilterParams according to API specs
 */
const buildDonationQueryParams = (params: DonationFilterParams = {}): string => {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }
  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.type && params.type !== "all") {
    query.set("type", params.type);
  }
  if (params.paymentMethod && params.paymentMethod !== "all") {
    query.set("paymentMethod", params.paymentMethod);
  }
  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }
  if (params.campaignId && params.campaignId !== "all" && params.campaignId.trim()) {
    query.set("campaignId", params.campaignId.trim());
  }
  if (params.startDate && params.startDate.trim()) {
    query.set("startDate", params.startDate.trim());
  }
  if (params.endDate && params.endDate.trim()) {
    query.set("endDate", params.endDate.trim());
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * Fetch unified donations list with filtering, searching, and pagination
 */
export const fetchDonations = async (
  params: DonationFilterParams = {}
): Promise<DonationListResponse> => {
  const queryStr = buildDonationQueryParams(params);
  const { data } = await api.get<DonationListResponse>(`/admin/donation${queryStr}`);
  return data;
};

/**
 * Create a direct offline donation by authorized admin
 */
export const createOfflineDonation = async (
  payload: CreateOfflineDonationPayload
): Promise<{ success?: boolean; message?: string; donation?: UnifiedDonation }> => {
  const { data } = await api.post("/admin/donation/create-offline", payload);
  return data;
};

/**
 * Verify an offline donation by admin (record received payment, receipt, status)
 */
export const verifyOfflineDonation = async (
  id: string,
  payload: VerifyOfflineDonationPayload = {}
): Promise<{ success?: boolean; message?: string; donation?: UnifiedDonation }> => {
  const { data } = await api.put(
    `/admin/donation/verify-offline/${encodeURIComponent(id)}`,
    payload
  );
  return data;
};

/**
 * Export filtered donations as a CSV Blob and trigger browser download
 */
export const exportDonationsCsv = async (
  params: DonationFilterParams = {}
): Promise<void> => {
  try {
    // For export, omit page & limit so all matching records are exported
    const exportParams = { ...params };
    delete exportParams.page;
    delete exportParams.limit;

    const queryStr = buildDonationQueryParams(exportParams);
    const response = await api.get(`/admin/donation/export${queryStr}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const objectUrl = window.URL.createObjectURL(blob);

    const typePrefix = params.type && params.type !== "all" ? params.type : "all";
    const dateStamp = new Date().toISOString().split("T")[0];
    const filename = `donations_${typePrefix}_${dateStamp}.csv`;

    const link = document.createElement("a");
    link.href = objectUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(objectUrl);
  } catch (error: any) {
    // If the response is a Blob that actually contains a JSON error message
    if (
      error.response &&
      error.response.data instanceof Blob &&
      error.response.data.type?.includes("application/json")
    ) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        error.response.data = json;
      } catch (parseError) {
        console.error("Failed to parse Blob error JSON", parseError);
      }
    }
    throw error;
  }
};
