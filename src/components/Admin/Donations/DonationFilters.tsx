"use client";

import React from "react";
import Dropdown from "@/src/components/UI/admin/Dropdown";
import DatePicker from "@/src/components/UI/admin/DatePicker";
import { Campaign } from "@/src/types/admin/campaign";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { FaTimes } from "react-icons/fa";

export type DonationTypeTab = "all" | "general" | "campaign";
export type PaymentMethodFilter = "all" | "online" | "offline";

interface DonationFiltersProps {
  activeTab: DonationTypeTab;
  onTabChange: (tab: DonationTypeTab) => void;
  search: string;
  onSearchChange: (val: string) => void;
  paymentMethod: PaymentMethodFilter;
  onPaymentMethodChange: (method: PaymentMethodFilter) => void;
  status: string;
  onStatusChange: (status: string) => void;
  campaignId: string;
  onCampaignChange: (id: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onClearFilters: () => void;
  campaigns: Campaign[];
  isLoadingCampaigns: boolean;
  currentLang?: string;
}

export const DonationFilters: React.FC<DonationFiltersProps> = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  paymentMethod,
  onPaymentMethodChange,
  status,
  onStatusChange,
  campaignId,
  onCampaignChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
  campaigns = [],
  isLoadingCampaigns = false,
  currentLang = "en",
}) => {
  const { t } = useTranslation();

  // Tabs with full and short labels for responsive display without horizontal scroll
  const tabs: { key: DonationTypeTab; fullLabel: string; shortLabel: string }[] = [
    {
      key: "all",
      fullLabel: t("All Donations") || "All Donations",
      shortLabel: t("All") || "All",
    },
    {
      key: "general",
      fullLabel: t("General Donations") || "General Donations",
      shortLabel: t("General") || "General",
    },
    {
      key: "campaign",
      fullLabel: t("Campaign Donations") || "Campaign Donations",
      shortLabel: t("Campaign") || "Campaign",
    },
  ];

  // Payment Method Options
  const paymentMethodOptions = [
    { label: t("All Methods") || "All Methods", value: "all" },
    { label: t("Online") || "Online", value: "online" },
    { label: t("Offline") || "Offline", value: "offline" },
  ];

  // Status Options
  const statusOptions = [
    { label: t("All Statuses") || "All Statuses", value: "all" },
    { label: t("Pending Verification") || "Pending Verification", value: "pending" },
    { label: t("Confirmed / Paid") || "Confirmed / Paid", value: "completed" },
  ];

  // Campaign Options
  const campaignOptions = [
    { label: t("All Campaigns") || "All Campaigns", value: "all" },
    ...campaigns.map((camp) => {
      let label = `Campaign #${camp.id}`;
      const titleObj = camp.title;
      if (titleObj) {
        if (typeof titleObj === "object") {
          label =
            (titleObj as any)[currentLang] ||
            (titleObj as any).en ||
            (titleObj as any).hi ||
            label;
        } else {
          label = String(titleObj);
        }
      }
      return {
        label,
        value: String(camp.id),
      };
    }),
  ];

  const isGeneralTab = activeTab === "general";
  const hasActiveFilters = Boolean(
    search ||
      paymentMethod !== "all" ||
      status !== "all" ||
      (campaignId !== "all" && !isGeneralTab) ||
      startDate ||
      endDate
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 min-w-0">
      {/* Category Tabs Header */}
      <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
        <div className="inline-flex bg-gray-100/90 p-1 rounded-lg gap-1 max-w-full overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer text-center flex items-center whitespace-nowrap ${
                  isActive
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span className="hidden sm:inline">{tab.fullLabel}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <FaTimes className="text-[10px]" />
            <span>{t("Reset Filters") || "Reset Filters"}</span>
          </button>
        )}
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 items-end">
        {/* Search Filter */}
        <div className="sm:col-span-2 md:col-span-1 xl:col-span-1">
          <label className="block mb-1 text-xs font-semibold text-gray-900">
            {t("Search Donor") || "Search Donor"}
          </label>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300 focus-within:border-primaryColor focus-within:ring-1 focus-within:ring-primaryColor/20 transition-all h-[38px]">
            <Icon icon="mdi:magnify" className="text-gray-400 text-lg flex-shrink-0" />
            <input
              type="text"
              placeholder={t("Name, email or phone...") || "Name, email or phone..."}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder:text-gray-400 font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-gray-400 hover:text-gray-600 text-xs p-0.5"
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Payment Method Dropdown */}
        <div>
          <Dropdown
            label={t("Payment Method") || "Payment Method"}
            options={paymentMethodOptions}
            value={paymentMethod}
            onChange={(val) => onPaymentMethodChange(val as PaymentMethodFilter)}
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <Dropdown
            label={t("Status") || "Status"}
            options={statusOptions}
            value={status}
            onChange={(val) => onStatusChange(String(val))}
          />
        </div>

        {/* Campaign Dropdown */}
        <div>
          <Dropdown
            label={
              isGeneralTab
                ? `${t("Filter by Campaign") || "Filter by Campaign"} (N/A)`
                : t("Filter by Campaign") || "Filter by Campaign"
            }
            options={campaignOptions}
            value={isGeneralTab ? "all" : campaignId}
            onChange={(val) => onCampaignChange(String(val))}
            disabled={isGeneralTab || isLoadingCampaigns}
            searchable={campaignOptions.length > 5}
            searchPlaceholder="Search campaign..."
            placeholder={
              isGeneralTab
                ? "Disabled for General"
                : isLoadingCampaigns
                ? "Loading campaigns..."
                : "All Campaigns"
            }
          />
        </div>

        {/* Start Date */}
        <div>
          <DatePicker
            label={t("Start Date") || "Start Date"}
            value={startDate}
            onChange={onStartDateChange}
            placeholder="Start Date"
            maxDate={endDate ? new Date(endDate) : undefined}
          />
        </div>

        {/* End Date */}
        <div>
          <DatePicker
            label={t("End Date") || "End Date"}
            value={endDate}
            onChange={onEndDateChange}
            placeholder="End Date"
            minDate={startDate ? new Date(startDate) : undefined}
          />
        </div>

        {/* Clear Filters Action */}
        <div>
          <button
            type="button"
            onClick={onClearFilters}
            title="Clear all filters"
            className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap h-[38px] border border-gray-200 shadow-xs"
          >
            <FaTimes className="text-[11px] text-gray-500" />
            <span>{t("Clear Filters") || "Clear Filters"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationFilters;
