"use client";

import React from "react";
import Dropdown from "@/src/components/UI/admin/Dropdown";
import DateSelect from "@/src/components/UI/admin/DateSelect";
import Button from "@/src/components/UI/web/Buttons/Button";
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
  campaignId: string;
  onCampaignChange: (id: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onClearFilters: () => void;
  onExportCsv: () => void;
  isExporting: boolean;
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
  campaignId,
  onCampaignChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
  onExportCsv,
  isExporting,
  campaigns = [],
  isLoadingCampaigns = false,
  currentLang = "en",
}) => {
  const { t } = useTranslation();

  // Tabs with full and short labels for responsive display without scroll
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-6 min-w-0">
      {/* Donation Type Tabs & Export CSV */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 sm:pb-4 mb-4">
        {/* Tab switch without scroll */}
        <div className="grid grid-cols-3 w-full sm:w-auto sm:flex bg-gray-100/80 p-1 rounded-lg gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer text-center justify-center flex items-center ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span className="hidden lg:inline whitespace-nowrap">{tab.fullLabel}</span>
                <span className="lg:hidden whitespace-nowrap">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Action: Export CSV */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            text={isExporting ? "Exporting..." : t("Export CSV") || "Export CSV"}
            icon={isExporting ? "" : "mdi:file-download-outline"}
            onClick={onExportCsv}
            disabled={isExporting}
            bgColor="bg-lime-green"
            hoverBg="before:bg-primaryColor"
            textColor="text-white"
            hoverTextColor="group-hover:text-foreground"
            paddingx="px-3 sm:px-4"
            paddingy="py-1.5 sm:py-2"
            rounded="rounded-[6px]"
          />
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 items-end">
        {/* Search Filter */}
        <div>
          <label className="block mb-1 text-xs font-medium text-gray-600">
            {t("Search Donor") || "Search Donor"}
          </label>
          <div className="flex items-center gap-2 bg-gray-100/70 px-3 py-2 rounded-md border border-gray-200 focus-within:border-primaryColor transition-colors">
            <Icon icon="mdi:magnify" className="text-gray-400 text-lg flex-shrink-0" />
            <input
              type="text"
              placeholder={t("Name, email or phone...") || "Name, email or phone..."}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-gray-400 hover:text-gray-600 text-xs"
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
          <DateSelect
            label={t("Start Date") || "Start Date"}
            value={startDate}
            onChange={onStartDateChange}
            placeholder="Select start date"
            maxDate={endDate ? new Date(endDate) : undefined}
          />
        </div>

        {/* End Date & Clear Button */}
        <div className="flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <DateSelect
              label={t("End Date") || "End Date"}
              value={endDate}
              onChange={onEndDateChange}
              placeholder="Select end date"
              minDate={startDate ? new Date(startDate) : undefined}
            />
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            title="Clear all filters"
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap h-[35px] flex-shrink-0"
          >
            <FaTimes className="text-[10px]" />
            <span>{t("Clear") || "Clear"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationFilters;
