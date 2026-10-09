"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useFetchCampaignDonors } from "@/src/hooks/admin/useDonors";
import { donorColumns } from "./donorColumns";
import { exportCampaignDonorsCsv } from "@/src/services/admin/donorApi";
import { useQueryClient } from "@tanstack/react-query";
import useDebounce from "@/src/hooks/web/useDebounce";
import toast from "react-hot-toast";

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

  const { data: donorData, isLoading, isError } = useFetchCampaignDonors(
    campaignId,
    currentPage,
    itemsPerPage,
    searchedData
  );


  const totalPages = donorData?.totalPages || (donorData as any)?.data?.totalPages || 1;

  // Handle Search Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleExport = async () => {
    if (exporting) return;
    try {
      setExporting(true);
      toast.loading("Exporting donors...", { id: "exportDonors" });
      // We pass 'Campaign' or appropriate title. If title isn't available, pass campaignId.
      await exportCampaignDonorsCsv(campaignId, `Campaign_${campaignId}`);
      toast.success("Export successful", { id: "exportDonors" });
    } catch (error) {
      console.error("Export Failed", error);
      toast.error("Failed to export donors. Please try again.", { id: "exportDonors" });
    } finally {
      setExporting(false);
    }
  };

  const paginatedData = useMemo(() => {
    // Handling case where backend returns { data: { donors: [] } } or just { donors: [] }
    return donorData?.donors || (donorData as any)?.data?.donors || (donorData as any)?.data || [];
  }, [donorData]);

  if (isError) {
    return <div className="p-10 text-center text-red-500 font-semibold">Failed to load donors. Please try again.</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-6 gap-4 border-b pb-4">
        <div className="flex gap-2">
          <Button onClick={handleExport} disabled={exporting || paginatedData.length === 0}>
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <AnimatedReveal direction="left" delay={0.1}>
          <CustomInput
            placeholder="Search name, email or phone..."
            value={search}
            onChange={handleSearchChange}
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
        <AnimatedReveal direction="up" delay={0.3}>
          <AdminCustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </AnimatedReveal>
      )}
    </div>
  );
};

export default DonorTable;
