"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "../Breadcrumb";
import DonationSummaryCards from "./DonationSummaryCards";
import DonationFilters, {
  DonationTypeTab,
  PaymentMethodFilter,
} from "./DonationFilters";
import DonationsTable from "./DonationsTable";

import DonationDetailModal from "./DonationDetailModal";
import VerifyOfflineModal from "./VerifyOfflineModal";
import CreateOfflineDonationModal from "./CreateOfflineDonationModal";
import { useFetchDonations } from "@/src/hooks/admin/useDonations";
import { useFetchAllCampaigns } from "@/src/hooks/admin/useCampaigns";
import { exportDonationsCsv } from "@/src/services/admin/donationApi";
import { fetchDonationReceipt } from "@/src/services/web/client/clientServices";
import { useLanguageToggle } from "@/src/hooks/web/useLanguageToggle";
import useDebounce from "@/src/hooks/web/useDebounce";
import toast from "react-hot-toast";
import { getApiErrorMessage, getApiSuccessMessage } from "@/src/utils/apiHelpers";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { Campaign } from "@/src/types/admin/campaign";
import { UnifiedDonation } from "@/src/types/admin/donation";
import { DonationReceipt } from "@/src/types/web/receipt";

export const UnifiedDonations = () => {
  const { language } = useLanguageToggle();

  // Filters State
  const [activeTab, setActiveTab] = useState<DonationTypeTab>("all");
  const [search, setSearch] = useState<string>("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodFilter>("all");
  const [status, setStatus] = useState<string>("all");
  const [campaignId, setCampaignId] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Modal / Drawer States
  const [selectedDonationForView, setSelectedDonationForView] =
    useState<UnifiedDonation | null>(null);
  const [selectedDonationForVerify, setSelectedDonationForVerify] =
    useState<UnifiedDonation | null>(null);
  const [isCreateOfflineOpen, setIsCreateOfflineOpen] =
    useState<boolean>(false);
  const [isDownloadingReceipt, setIsDownloadingReceipt] =
    useState<boolean>(false);

  // Debounced search (350 ms satisfies 300–400 ms requirement)
  const debouncedSearch = useDebounce(search, 350);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, paymentMethod, status, campaignId, startDate, endDate]);

  // Handle Tab Change
  const handleTabChange = (tab: DonationTypeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === "general") {
      setCampaignId("all"); // Campaign is not applicable for general donations
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch("");
    setPaymentMethod("all");
    setStatus("all");
    setCampaignId("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // Fetch unified donations
  const {
    data: donationData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchDonations({
    page: currentPage,
    limit,
    search: debouncedSearch,
    type: activeTab,
    paymentMethod,
    status: status === "all" ? undefined : status,
    campaignId: activeTab === "general" ? undefined : campaignId,
    startDate,
    endDate,
  });

  // Fetch campaigns for campaign selector dropdown
  const { data: campaignResponse, isLoading: isLoadingCampaigns } =
    useFetchAllCampaigns(1, 100) as {
      data?: { campaigns: Campaign[]; totalPages: number };
      isLoading: boolean;
    };

  const campaigns = campaignResponse?.campaigns || [];

  // Export CSV handler
  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);

    const exportPromise = exportDonationsCsv({
      type: activeTab,
      paymentMethod,
      status: status === "all" ? undefined : status,
      campaignId: activeTab === "general" ? undefined : campaignId,
      startDate,
      endDate,
      search: debouncedSearch,
    });

    toast.promise(exportPromise, {
      loading: "Generating donations CSV export...",
      success: (data) =>
        getApiSuccessMessage(data, "Donations CSV downloaded successfully!"),
      error: (err) =>
        getApiErrorMessage(
          err,
          "Failed to export donations. Please try again."
        ),
    });

    try {
      await exportPromise;
    } catch (err) {
      console.error("Donation CSV Export Error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Download Receipt Handler for Confirmed/Completed Donations
  const handleDownloadReceipt = async (donation: UnifiedDonation) => {
    const statusLower = (donation.status || "").toLowerCase();
    const isConfirmed =
      statusLower === "completed" ||
      statusLower === "success" ||
      statusLower === "paid" ||
      statusLower === "verified";

    if (!isConfirmed) {
      toast.error(
        "Donation is pending verification. Official receipt is not generated yet."
      );
      return;
    }

    const identifier =
      donation.receiptNumber ||
      donation.id ||
      donation.orderId ||
      donation.transactionId;

    if (!identifier) {
      toast.error("Donation identifier missing. Cannot generate receipt.");
      return;
    }

    setIsDownloadingReceipt(true);
    const toastId = toast.loading("Preparing donation certificate PDF...");

    try {
      let receiptData: DonationReceipt | null = null;
      try {
        const res = await fetchDonationReceipt(identifier);
        receiptData = res?.receipt || res?.data?.receipt || res?.data;
      } catch (fetchErr: any) {
        // If backend explicitly rejected receipt generation (e.g., 400 Pending or 403 Forbidden or 404 Not Found)
        if (
          fetchErr?.response?.status &&
          fetchErr.response.status >= 400 &&
          fetchErr.response.status < 500
        ) {
          throw new Error(
            getApiErrorMessage(
              fetchErr,
              "Official receipt is not available or donation is pending verification."
            )
          );
        }
        console.warn(
          "Could not retrieve fresh receipt from backend, generating from record data:",
          fetchErr
        );
      }

      const donorFullName =
        donation.name?.trim() ||
        `${donation.firstName || ""} ${donation.lastName || ""}`.trim() ||
        donation.donorName ||
        "Generous Supporter";

      const receiptNumber =
        receiptData?.receiptNumber ||
        donation.receiptNumber ||
        `YUWA-${new Date().getFullYear()}-${donation.id.slice(-6).toUpperCase()}`;

      const normalizedReceipt: DonationReceipt = {
        receiptNumber,
        orderId: donation.orderId || donation.id,
        paymentId:
          donation.transactionId ||
          donation.referenceNumber ||
          donation.id,
        amount: Number(donation.amount || 0),
        amountInWords: receiptData?.amountInWords,
        paymentDate:
          donation.receivedDate || donation.createdAt || new Date().toISOString(),
        paymentStatus: donation.status || "Completed",
        paymentMethod:
          donation.paymentMethod?.toLowerCase() === "online"
            ? "Online (Razorpay)"
            : "Offline (Direct / Field)",
        campaignTitle:
          typeof donation.campaignTitle === "object"
            ? (donation.campaignTitle as any)[language] ||
              (donation.campaignTitle as any).en
            : donation.campaignTitle || "General Welfare Fund",
        campaignId: donation.campaignId
          ? String(donation.campaignId)
          : undefined,
        donor: {
          name: donorFullName,
          email: donation.email,
          phone: donation.phone,
          address: donation.address,
        },
        organization: receiptData?.organization,
        isVerified: true,
      };

      const exportResponse = await fetch("/api/donation-certificate/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receipt: normalizedReceipt,
          format: "pdf",
        }),
      });

      if (!exportResponse.ok) {
        throw new Error(`Export failed with status ${exportResponse.status}`);
      }

      const blob = await exportResponse.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `YUWA-India-Donation-Receipt-${receiptNumber}.pdf`;
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Donation certificate downloaded successfully!", {
        id: toastId,
      });
    } catch (error: any) {
      console.error("Receipt Download Error:", error);
      toast.error(
        error?.message ||
          "Failed to generate receipt PDF. Please retry or contact technical support.",
        { id: toastId }
      );
    } finally {
      setIsDownloadingReceipt(false);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="w-full min-w-0">
      <Breadcrumb lable="Donations" />

      {/* Header Row: Title & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 -mt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {t("Donations") || "Donations"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t("Monitor donor contributions, verify offline pledges, and generate official 80G receipts.") ||
              "Monitor donor contributions, verify offline pledges, and generate official 80G receipts."}
          </p>
        </div>

        {/* Action Toolbar: Primary (Record Offline) & Secondary (Export CSV) */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          {/* Secondary Action: Export CSV */}
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 h-[38px]"
            title="Export filtered records as CSV"
          >
            {isExporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                <span>{t("Exporting...") || "Exporting..."}</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:file-download-outline" className="w-4 h-4 text-gray-600" />
                <span>{t("Export CSV") || "Export CSV"}</span>
              </>
            )}
          </button>

          {/* Primary Action: Record Offline Donation */}
          <button
            type="button"
            onClick={() => setIsCreateOfflineOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00715D] hover:bg-[#005a4a] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer h-[38px]"
            title="Record direct offline donation"
          >
            <Icon icon="mdi:plus-circle" className="w-4 h-4 text-emerald-200" />
            <span>{t("Record Offline Donation") || "Record Offline Donation"}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <DonationSummaryCards
        summary={donationData?.summary}
        totalCount={donationData?.total}
        isLoading={isLoading && !donationData}
      />

      {/* Filter Tabs & Controls */}
      <DonationFilters
        activeTab={activeTab}
        onTabChange={handleTabChange}
        search={search}
        onSearchChange={setSearch}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        status={status}
        onStatusChange={setStatus}
        campaignId={campaignId}
        onCampaignChange={setCampaignId}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onClearFilters={handleClearFilters}
        campaigns={campaigns}
        isLoadingCampaigns={isLoadingCampaigns}
        currentLang={language}
      />

      {/* Table & Pagination */}
      <DonationsTable
        donations={donationData?.donations || []}
        total={donationData?.total || 0}
        currentPage={donationData?.page || currentPage}
        totalPages={donationData?.totalPages || 1}
        limit={donationData?.limit || limit}
        isLoading={isLoading}
        isError={isError}
        errorMessage={getApiErrorMessage(
          error,
          "Failed to load donations from server."
        )}
        onPageChange={setCurrentPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setCurrentPage(1);
        }}
        onRetry={() => refetch()}
        onClearFilters={handleClearFilters}
        onViewDetails={(donation) => setSelectedDonationForView(donation)}
        onVerifyOffline={(donation) => setSelectedDonationForVerify(donation)}
        onDownloadReceipt={handleDownloadReceipt}
        currentLang={language}
      />

      {/* View Donation Details Drawer */}
      <DonationDetailModal
        isOpen={!!selectedDonationForView}
        onClose={() => setSelectedDonationForView(null)}
        donation={selectedDonationForView}
        onVerifyOffline={(donation) => setSelectedDonationForVerify(donation)}
        onDownloadReceipt={handleDownloadReceipt}
        isDownloadingReceipt={isDownloadingReceipt}
        currentLang={language}
      />

      {/* Verify Offline Donation Modal */}
      <VerifyOfflineModal
        isOpen={!!selectedDonationForVerify}
        onClose={() => setSelectedDonationForVerify(null)}
        donation={selectedDonationForVerify}
        onSuccess={() => refetch()}
        currentLang={language}
      />

      {/* Direct Offline Donation Entry Modal */}
      <CreateOfflineDonationModal
        isOpen={isCreateOfflineOpen}
        onClose={() => setIsCreateOfflineOpen(false)}
        campaigns={campaigns}
        currentLang={language}
      />
    </div>
  );
};

export default UnifiedDonations;
