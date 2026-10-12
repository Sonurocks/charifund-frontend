"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import DataTableWrapper from "../../UI/admin/DataTableWrapper";
import CustomInput from "../../UI/admin/CustomInput";
import Dropdown from "../../UI/admin/Dropdown";
import Drawer from "../../UI/admin/Drawer";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { SponsorFormValues } from "@/src/utils/validations/FormValidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SponsorForm from "./SponsorForm";
import SponsorPreview from "./SponsorPreview";
import { AdminSponsor, SponsorSearchField } from "@/src/types/admin/sponsor";
import { getSponsorColumns } from "./sponsorColumns";
import {
  submitSponsorForm,
  useDeleteSingleSponsor,
  useFetchAllSponsors,
  useFetchSingleSponsor,
} from "@/src/hooks/admin/useSponsors";
import { createSponsor, updateSponsor } from "@/src/services/admin/sponsorApi";
import { SponsorSearchOptions } from "../../../static-resource/admin";
import AdminCustomPagination from "../../UI/admin/CustomePagination";
import ConfirmModal from "../../UI/admin/ConfirmModal";
import useDebounce from "@/src/hooks/web/useDebounce";
import Button from "../../UI/web/Buttons/Button";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import toast from "react-hot-toast";
import { sponsorsData } from "@/src/data/sponsors";
import { FaInfoCircle } from "react-icons/fa";

const SponsorTable = () => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<SponsorSearchField>("name");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editSponsorId, setEditSponsorId] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view" | "preview-edit">("add");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<SponsorFormValues | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<AdminSponsor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const searchedData = useDebounce(search, 500);

  // Queries
  const {
    data: apiSponsorData,
    isLoading,
    isError,
  } = useFetchAllSponsors(currentPage, itemsPerPage, searchedData, searchField);

  const {
    data: singleSponsorData,
    isLoading: isLoadingSingle,
    refetch: refetchSingle,
  } = useFetchSingleSponsor(editSponsorId || undefined);

  const deleteSponsorMutation = useDeleteSingleSponsor();
  const queryClient = useQueryClient();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createSponsor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["web-sponsors"] });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: FormData }) =>
      updateSponsor(data.id, data.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-sponsor"] });
      queryClient.invalidateQueries({ queryKey: ["web-sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["web-sponsor"] });
    },
  });

  // Map static sponsors to AdminSponsor shape for baseline preview when backend is not yet deployed
  const staticFallbackSponsors: AdminSponsor[] = useMemo(() => {
    const toStr = (v: any) => (typeof v === "string" ? v : v?.en || "");
    const toHiStr = (v: any) => (typeof v === "string" ? v : v?.hi || v?.en || "");

    return sponsorsData.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: { en: toStr(s.name), hi: toHiStr(s.name) },
      category: { en: toStr(s.category), hi: toHiStr(s.category) },
      location: { en: toStr(s.location || "India"), hi: toHiStr(s.location || "भारत") },
      shortDescription: { en: toStr(s.shortDescription), hi: toHiStr(s.shortDescription) },
      description: { en: toStr(s.description), hi: toHiStr(s.description) },
      website: s.website || undefined,
      logo: s.logo,
    }));
  }, []);

  // Determine active dataset (API data if present, otherwise fallback)
  const isUsingFallback = isError || !apiSponsorData?.sponsors;

  const tableData: AdminSponsor[] = useMemo(() => {
    if (apiSponsorData?.sponsors && Array.isArray(apiSponsorData.sponsors)) {
      return apiSponsorData.sponsors;
    }
    // Filter fallback data if search query is provided
    if (searchedData.trim() !== "") {
      const q = searchedData.toLowerCase();
      return staticFallbackSponsors.filter((item) => {
        const val =
          searchField === "name"
            ? typeof item.name === "string" ? item.name : item.name.en
            : searchField === "category"
            ? typeof item.category === "string" ? item.category : item.category.en
            : typeof item.location === "string" ? item.location : item.location?.en;
        return (val || "").toLowerCase().includes(q);
      });
    }
    return staticFallbackSponsors;
  }, [apiSponsorData, searchedData, searchField, staticFallbackSponsors]);

  const totalPages = apiSponsorData?.totalPages || 1;

  // Actions
  const handleEdit = useCallback((sponsor: AdminSponsor) => {
    setEditSponsorId(sponsor.id);
    setMode("edit");
    setDrawerOpen(true);
  }, []);

  const handleView = useCallback(
    (sponsor: AdminSponsor) => {
      setEditSponsorId(sponsor.id);
      setMode("view");
      setDrawerOpen(true);
      setShowPreview(true);

      // If backend single sponsor is available, refetch it
      if (!isUsingFallback) {
        setTimeout(async () => {
          try {
            const res = await refetchSingle();
            if (res.data) {
              setPreviewData(res.data as any);
            }
          } catch (e) {
            console.error("Failed to fetch sponsor details:", e);
          }
        }, 50);
      } else {
        // Use row data directly for preview
        setPreviewData(sponsor as any);
      }
    },
    [isUsingFallback, refetchSingle]
  );

  const handleDelete = useCallback((sponsor: AdminSponsor) => {
    setSelectedSponsor(sponsor);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!selectedSponsor) return;
    setDeleteLoading(true);
    toast.dismiss();
    toast.loading("Deleting sponsor...");

    deleteSponsorMutation.mutate(selectedSponsor.id, {
      onSuccess: () => {
        setDeleteLoading(false);
        setIsDeleteModalOpen(false);
        setSelectedSponsor(null);
      },
      onError: () => {
        setDeleteLoading(false);
        setIsDeleteModalOpen(false);
      },
    });
  }, [selectedSponsor, deleteSponsorMutation]);

  const columns = useMemo(
    () =>
      getSponsorColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
      }),
    [handleEdit, handleDelete, handleView]
  );

  // Selected item data for form
  const currentFormData = useMemo(() => {
    if (!editSponsorId) return null;
    if (singleSponsorData) return singleSponsorData;
    return tableData.find((s) => s.id === editSponsorId) || null;
  }, [editSponsorId, singleSponsorData, tableData]);

  return (
    <section>
      {/* Backend API status notice */}
      {isUsingFallback && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-amber-800 text-sm">
          <FaInfoCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <div className="flex-1">
            <span className="font-semibold">Backend API Integration Ready:</span> Endpoints (
            <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">/admin/sponsor/*</code>) are not yet live on the server.
            The frontend UI and service layer are fully configured and showing local preview data until the backend is connected.
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <AnimatedReveal direction="left" delay={0.1}>
          <div className="w-fit flex flex-row gap-2">
            <Dropdown
              options={SponsorSearchOptions}
              value={searchField}
              onChange={(value: any) => {
                setSearchField(value);
                setSearch("");
                setTimeout(() => {
                  searchInputRef.current?.focus();
                }, 0);
              }}
            />
            <CustomInput
              ref={searchInputRef}
              placeholder={`Search by ${searchField}...`}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </AnimatedReveal>

        <AnimatedReveal direction="left" delay={0.3}>
          <div className="w-fit">
            <Button
              text="Add Sponsor"
              onClick={() => {
                setDrawerOpen(true);
                setEditSponsorId(null);
                setMode("add");
                setPreviewData(null);
                setShowPreview(false);
              }}
              bgColor="bg-lime-green"
              hoverBg="before:bg-primaryColor"
              textColor="text-white"
              hoverTextColor="group-hover:text-foreground"
              paddingx="px-4"
              paddingy="py-2"
              rounded="rounded-[5px]"
            />
          </div>
        </AnimatedReveal>
      </div>

      {/* Table content */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <CustomLoader />
        </div>
      ) : (
        <DataTableWrapper columns={columns} data={tableData} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-4">
          <AdminCustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditSponsorId(null);
            setMode("add");
            setPreviewData(null);
            setShowPreview(false);
          }}
          title={
            mode === "edit"
              ? "Edit Sponsor"
              : mode === "view"
              ? "View Sponsor"
              : mode === "preview-edit"
              ? "Preview Sponsor"
              : "Add Sponsor"
          }
          mode={mode}
        >
          {/* View or Preview mode */}
          {(mode === "view" || mode === "preview-edit") && (
            <SponsorPreview
              data={previewData || currentFormData}
              showButton={mode === "preview-edit"}
              mode={mode}
              createMutation={createMutation}
              updateMutation={updateMutation}
              onBack={() => {
                setShowPreview(false);
                setMode(editSponsorId ? "edit" : "add");
              }}
              onSubmit={() => {
                if (!previewData) return;
                submitSponsorForm(
                  previewData,
                  currentFormData,
                  createMutation,
                  updateMutation,
                  () => {
                    setPreviewData(null);
                    setDrawerOpen(false);
                  },
                  () => {},
                  () => setDrawerOpen(false)
                );
              }}
            />
          )}

          {/* Add or Edit mode */}
          {(mode === "add" || mode === "edit") && (
            isLoadingSingle ? (
              <div className="flex justify-center py-10">
                <CustomLoader />
              </div>
            ) : (
              <SponsorForm
                key={`${editSponsorId || "new"}-${mode}`}
                initialData={currentFormData || previewData || undefined}
                onClose={() => {
                  setDrawerOpen(false);
                  setEditSponsorId(null);
                  setShowPreview(false);
                }}
                mode={mode}
                onPreview={(data) => {
                  setPreviewData(data);
                  setShowPreview(true);
                  setMode("preview-edit");
                }}
                createMutation={createMutation}
                updateMutation={updateMutation}
              />
            )
          )}
        </Drawer>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        message={`Are you sure you want to delete sponsor "${
          selectedSponsor
            ? typeof selectedSponsor.name === "string"
              ? selectedSponsor.name
              : selectedSponsor.name?.en
            : ""
        }"?`}
        buttonText="Delete"
      />
    </section>
  );
};

export default SponsorTable;
