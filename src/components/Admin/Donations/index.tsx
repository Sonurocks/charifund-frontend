"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "../Breadcrumb";
import DonationSummaryCards from "./DonationSummaryCards";
import DonationFilters, {
  DonationTypeTab,
  PaymentMethodFilter,
} from "./DonationFilters";
import DonationsTable from "./DonationsTable";
import { useFetchDonations } from "@/src/hooks/admin/useDonations";
import { useFetchAllCampaigns } from "@/src/hooks/admin/useCampaigns";
import { exportDonationsCsv } from "@/src/services/admin/donationApi";
import { useLanguageToggle } from "@/src/hooks/web/useLanguageToggle";
import useDebounce from "@/src/hooks/web/useDebounce";
import toast from "react-hot-toast";
import { getApiErrorMessage, getApiSuccessMessage } from "@/src/utils/apiHelpers";
import { Campaign } from "@/src/types/admin/campaign";

export const UnifiedDonations = () => {
  const { language } = useLanguageToggle();

  // Filters State
  const [activeTab, setActiveTab] = useState<DonationTypeTab>("all");
  const [search, setSearch] = useState<string>("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodFilter>("all");
  const [campaignId, setCampaignId] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Debounced search (350 ms satisfies 300–400 ms requirement)
  const debouncedSearch = useDebounce(search, 350);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, paymentMethod, campaignId, startDate, endDate]);

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

  return (
    <div className="w-full min-w-0">
      <Breadcrumb lable="Donations" />

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
        campaignId={campaignId}
        onCampaignChange={setCampaignId}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onClearFilters={handleClearFilters}
        onExportCsv={handleExportCsv}
        isExporting={isExporting}
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
        currentLang={language}
      />
    </div>
  );
};

export default UnifiedDonations;
