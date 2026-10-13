"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { UnifiedDonation } from "@/src/types/admin/donation";
import { getDonationColumns } from "./donationColumns";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle, FaFolderOpen, FaRedo } from "react-icons/fa";

const DataTableWrapper = dynamic(
  () => import("@/src/components/UI/admin/DataTableWrapper"),
  { ssr: false }
);
const AdminCustomPagination = dynamic(
  () => import("@/src/components/UI/admin/CustomePagination"),
  { ssr: false }
);

interface DonationsTableProps {
  donations: UnifiedDonation[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRetry: () => void;
  onClearFilters: () => void;
  currentLang?: string;
}

const TableSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-primaryColor/10 p-4 border-b border-gray-200">
        <div className="grid grid-cols-9 gap-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
          <div className="h-4 bg-gray-300 rounded col-span-1" />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5].map((rowIdx) => (
          <div key={rowIdx} className="p-4 animate-pulse">
            <div className="grid grid-cols-9 gap-4 items-center">
              <div className="h-4 bg-gray-200 rounded w-8 col-span-1" />
              <div className="h-4 bg-gray-200 rounded w-24 col-span-1" />
              <div className="h-4 bg-gray-200 rounded w-28 col-span-1" />
              <div className="h-4 bg-gray-200 rounded w-20 col-span-1" />
              <div className="h-5 bg-gray-200 rounded-full w-16 col-span-1" />
              <div className="h-4 bg-gray-200 rounded w-24 col-span-1" />
              <div className="h-5 bg-gray-200 rounded w-16 col-span-1" />
              <div className="h-4 bg-gray-200 rounded w-16 col-span-1" />
              <div className="h-4 bg-gray-200 rounded w-20 col-span-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DonationsTable: React.FC<DonationsTableProps> = ({
  donations = [],
  total = 0,
  currentPage = 1,
  totalPages = 1,
  limit = 10,
  isLoading = false,
  isError = false,
  errorMessage,
  onPageChange,
  onLimitChange,
  onRetry,
  onClearFilters,
  currentLang = "en",
}) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    return getDonationColumns({
      lang: currentLang,
      currentPage,
      limit,
    });
  }, [currentLang, currentPage, limit]);

  const pageSizes = [10, 25, 50];

  // Error State
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center my-6">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaExclamationTriangle size={20} />
        </div>
        <h3 className="text-base font-bold text-red-800 mb-1">
          {t("Failed to load donations") || "Failed to load donations"}
        </h3>
        <p className="text-xs text-red-600 mb-4 max-w-md mx-auto">
          {errorMessage || "An unexpected error occurred while fetching donations."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
        >
          <FaRedo size={12} />
          <span>{t("Retry") || "Retry"}</span>
        </button>
      </div>
    );
  }

  // Loading State with 5 Skeleton Rows
  if (isLoading && donations.length === 0) {
    return <TableSkeleton />;
  }

  // Empty State
  if (!isLoading && donations.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-12 text-center my-6 shadow-sm">
        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaFolderOpen size={28} />
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-1">
          {t("No donations found") || "No donations found"}
        </h3>
        <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
          {t("No records match your selected criteria. Try adjusting or clearing your filters.") ||
            "No records match your selected criteria. Try adjusting or clearing your filters."}
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primaryColor hover:bg-green text-foreground hover:text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
        >
          <span>{t("Clear Filters") || "Clear Filters"}</span>
        </button>
      </div>
    );
  }

  // Calculate Range text
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="space-y-4">
      {/* Table Component */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
            <div className="text-primaryColor flex items-center gap-2 font-medium text-xs">
              <span className="w-4 h-4 border-2 border-primaryColor border-t-transparent rounded-full animate-spin" />
              <span>Updating...</span>
            </div>
          </div>
        )}
        <DataTableWrapper columns={columns as any} data={donations} loading={false} />
      </div>

      {/* Pagination & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Page size limit selector & info */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>{t("Show") || "Show"}</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-primaryColor cursor-pointer"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>{t("entries") || "entries"}</span>

          <span className="text-gray-400 mx-1">|</span>

          <span>
            {t("Showing") || "Showing"} <span className="font-semibold text-gray-800">{startItem}</span> -{" "}
            <span className="font-semibold text-gray-800">{endItem}</span> of{" "}
            <span className="font-semibold text-gray-800">{total}</span>
          </span>
        </div>

        {/* Custom Pagination Component */}
        {totalPages > 1 && (
          <div>
            <AdminCustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationsTable;
