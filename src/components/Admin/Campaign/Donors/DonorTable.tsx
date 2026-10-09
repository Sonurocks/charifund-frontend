"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useFetchCampaignDonors } from "@/src/hooks/admin/useDonors";
import { donorColumns } from "./donorColumns";
import { exportCampaignDonorsCsv } from "@/src/services/admin/donorApi";
import useDebounce from "@/src/hooks/web/useDebounce";
import toast from "react-hot-toast";
import { getApiErrorMessage, getApiSuccessMessage } from "@/src/utils/apiHelpers";

const DataTableWrapper = dynamic(() => import("@/src/components/UI/admin/DataTableWrapper"), { ssr: false });
const CustomInput = dynamic(() => import("@/src/components/UI/admin/CustomInput"), { ssr: false });
const AdminCustomPagination = dynamic(() => import("@/src/components/UI/admin/CustomePagination"), { ssr: false });
const Button = dynamic(() => import("@/src/components/UI/web/Buttons/Button"), { ssr: false });
const AnimatedReveal = dynamic(() => import("@/src/animations/AnimatedReveal"), { ssr: false });

const DonorTable = ({ campaignId }: { campaignId: string }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [exporting, setExporting] = useState(false);

  // Debounce search input to avoid hitting API continuously
  const searchedData = useDebounce(search, 800);

  const { data: donorData, isLoading, isError, error } = useFetchCampaignDonors(
    campaignId,
    currentPage,
    itemsPerPage,
    searchedData
  );


  const totalPages = donorData?.totalPages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    
    // Create a promise wrapper for the API call
    const exportPromise = exportCampaignDonorsCsv(campaignId, `Campaign_${campaignId}`);
    
    toast.promise(exportPromise, {
      loading: "Generating CSV...",
      success: (data) => getApiSuccessMessage(data, "Export downloaded successfully!"),
      error: (err) => getApiErrorMessage(err, "Failed to export donors. Please try again."),
    });

    try {
      await exportPromise;
    } catch (error) {
      console.error("Export Failed", error);
    } finally {
      setExporting(false);
    }
  };

  const paginatedData = useMemo(() => {
    return donorData?.donors || [];
  }, [donorData]);

  if (isError) {
    return <div className="p-10 text-center text-red-500 font-semibold">{getApiErrorMessage(error, "Failed to load donors. Please try again.")}</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {/* Search Input on the Left */}
        <AnimatedReveal direction="left" delay={0.1}>
          <CustomInput
            placeholder="Search name, email or phone..."
            value={search}
            onChange={handleSearchChange}
          />
        </AnimatedReveal>

        {/* Action Button on the Right */}
        <AnimatedReveal direction="left" delay={0.3}>
          <Button
            text={exporting ? "Exporting..." : "Export CSV"}
            onClick={handleExport}
            disabled={exporting}
            bgColor="bg-lime-green"
            hoverBg="before:bg-primaryColor"
            textColor="text-white"
            hoverTextColor="group-hover:text-foreground"
            paddingx="px-4"
            paddingy="py-2"
            rounded="rounded-[5px]"
          />
        </AnimatedReveal>
      </div>

      <AnimatedReveal direction="up" delay={0.2} className="relative z-0">
        <DataTableWrapper
          columns={donorColumns as any}
          data={paginatedData}
          loading={isLoading}
        />
      </AnimatedReveal>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <AnimatedReveal direction="up" delay={0.3}>
            <AdminCustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </AnimatedReveal>
        </div>
      )}
    </div>
  );
};

export default DonorTable;
