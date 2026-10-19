


"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

//  Dynamic Imports (large UI/animation modules)
const CampaignForm = dynamic(() => import("./CampaignForm"), { ssr: false });
const CampaignPreview = dynamic(() => import("./CampaignPreview"), { ssr: false });
const Drawer = dynamic(() => import("../../UI/admin/Drawer"), { ssr: false });
const DataTableWrapper = dynamic(() => import("../../UI/admin/DataTableWrapper"), { ssr: false });
const CustomInput = dynamic(() => import("../../UI/admin/CustomInput"), { ssr: false });
const Dropdown = dynamic(() => import("../../UI/admin/Dropdown"), { ssr: false });
const AnimatedReveal = dynamic(() => import("@/src/animations/AnimatedReveal"), { ssr: false });
const Button = dynamic(() => import("../../UI/web/Buttons/Button"), { ssr: false });
const AdminCustomPagination = dynamic(() => import("../../UI/admin/CustomePagination"), { ssr: false });
const ConfirmModal = dynamic(() => import("../../UI/admin/ConfirmModal"), { ssr: false });
const CustomLoader = dynamic(() => import("../../UI/web/Loader/CustomLoader"), { ssr: false });

//  Hooks & Utilities (keep static)
import { CampaignSearchOptions } from "../../../static-resource/admin";
import { getCampaignColumns } from "./campaignColumns";
import {
  useDeleteSignleCampaign,
  useFetchAllCampaigns,
  useFetchSingleCampaign,
  submitCampaignForm
} from "@/src/hooks/admin/useCampaigns";
import { CampaignFormValues } from "@/src/utils/validations/FormValidation";
import { createCampaign, updateCampaign } from "@/src/services/admin/campaignApi";
import { Campaign, statusValue } from "@/src/types/admin/campaign";
import { useLanguageToggle } from "@/src/hooks/web/useLanguageToggle";
import useDebounce from "@/src/hooks/web/useDebounce";
import { useFetchCategory } from "@/src/hooks/admin/useCategory";
import { Category } from "@/src/types/admin/category";
import { useRouter } from "next/navigation";

const CampaignTable = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<"title" | "category" | "status">("title");
  const [statusField, setStatusField] = useState<"active" | "completed" | "inactive" | "status">("active");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view" | "preview-edit">("add");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<CampaignFormValues | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const searchedData = useDebounce(search, 1000);
  const { language } = useLanguageToggle();
  const queryClient = useQueryClient();

  const { data: campaignData, isLoading } = useFetchAllCampaigns(
    currentPage,
    itemsPerPage,
    searchedData,
    searchField
  ) as { data: { campaigns: Campaign[]; totalPages: number }, isLoading: boolean };

  const { data: singleCampaignData, isLoading: isLoadingCampaign, refetch } = useFetchSingleCampaign(
    editCampaign || undefined
  ) as { data: Campaign, isLoading: boolean, refetch: any };

  const deleteMutation = useDeleteSignleCampaign();
  const { data: categoryData } = useFetchCategory();

  const totalPages = campaignData?.totalPages || 1;

  //  React Query Mutations
  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: CampaignFormValues }) =>
      updateCampaign(data.id, data.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "campaigns" });
      queryClient.invalidateQueries({ queryKey: ["campaign", editCampaign] });
    },
  });

  //  Category Options
  const categoryOptions =
    categoryData?.category?.map((category: Category) => ({
      label: category.name?.[language] || category.name.en,
      value: category.name?.[language] || category.name.en,
    })) ?? [];

  //  Normalize Data
  const normalizeCampaignData = (data: any): CampaignFormValues & { existingImages: string[] } => {
    const hasFileImages = Array.isArray(data.images) && data.images.some((img: any) => typeof img !== "string");
    const serverUrlsFrom = (arr: any[]) => arr.filter((img: any): img is string => typeof img === "string" && !!img);

    return {
      title: data.title ?? { en: "", hi: "" },
      category: data.category ?? { en: "", hi: "" },
      description: data.description ?? { en: "", hi: "" },
      goalAmount: data.goalAmount ?? "",
      summary: data.summary ?? { en: "", hi: "" },
      keyPoints: data.keyPoints ?? { en: [], hi: [] },
      location: data.location ?? { en: "", hi: "" },
      images: hasFileImages ? (data.images as any[]) : [],
      existingImages: hasFileImages
        ? (Array.isArray(data.existingImages) ? serverUrlsFrom(data.existingImages) : [])
        : Array.isArray(data.existingImages)
          ? serverUrlsFrom(data.existingImages)
          : Array.isArray(data.images)
            ? serverUrlsFrom(data.images)
            : [],
    };
  };

  //  Handlers
  const handleEdit = useCallback((c: Campaign) => {
    setEditCampaign(c.id.toString());
    setMode("edit");
    setDrawerOpen(true);
  }, []);

  const handleView = useCallback(async (c: Campaign) => {
    setEditCampaign(c.id.toString());
    setMode("view");
    setDrawerOpen(true);
    setPreviewData(null);
    setShowPreview(false);

    try {
      setTimeout(async () => {
        const { data } = await refetch();
        if (data) {
          setPreviewData(normalizeCampaignData(data));
          setShowPreview(true);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
    }
  }, [refetch]);

  const handleDelete = useCallback((c: Campaign) => {
    if (!c.id) return console.error("Cannot delete Campaign: ID is missing.");
    setSelectedCampaign(c);
    setIsOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedCampaign?.id) {
      setDeleteLoading(true);
      toast.dismiss();
      toast.loading("Deleting Campaign...");
      deleteMutation.mutate(selectedCampaign.id.toString(), {
        onSuccess: () => {
          setDeleteLoading(false);
          setIsOpen(false);
          setSelectedCampaign(null);
        },
        onError: () => {
          setDeleteLoading(false);
          setIsOpen(false);
        },
      });
    }
  }, [selectedCampaign, deleteMutation]);

  const handleViewDonors = useCallback((c: Campaign) => {
    router.push(`/admin/campaign/${c.id}/donors`);
  }, [router]);

  const handleDeleteClick = useCallback((c: Campaign) => {
    setSelectedCampaign(c);
    setIsOpen(true);
  }, []);

  const columns = useMemo(
    () => getCampaignColumns({ onEdit: handleEdit, onDelete: handleDeleteClick, onView: handleView, onDonors: handleViewDonors }),
    [handleEdit, handleDeleteClick, handleView, handleViewDonors]
  );

  const paginatedData = useMemo(() => {
    if (!campaignData?.campaigns) return [];
    return campaignData.campaigns.map((c: any) => ({ ...c, organizer: c.organizer || "Admin" }));
  }, [campaignData]);

  const normalizedCampaignData = useMemo(() => {
    if (!singleCampaignData) return undefined;
    const stringImages = Array.isArray(singleCampaignData.images)
      ? singleCampaignData.images.filter((img: any) => typeof img === "string" && !!img)
      : [];
    return {
      ...singleCampaignData,
      images: Array.isArray(singleCampaignData.images)
        ? singleCampaignData.images.filter((img: any) => typeof img !== "string")
        : [],
      existingImages: singleCampaignData.existingImages?.length
        ? singleCampaignData.existingImages
        : stringImages,
    };
  }, [singleCampaignData]);

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <AnimatedReveal direction="left" delay={0.1}>
          <div className="flex flex-row gap-2">
            <Dropdown
              options={CampaignSearchOptions}
              value={searchField}
              onChange={(value: any) => {
                setSearchField(value);
                setSearch("");
                setTimeout(() => searchInputRef.current?.focus(), 0);
              }}
            />

            {searchField === "category" ? (
              <Dropdown
                options={categoryOptions}
                value={search || ""}
                onChange={(value: any) => value && setSearch(value)}
              />
            ) : searchField === "status" ? (
              <Dropdown
                options={statusValue}
                value={statusField}
                onChange={(value: any) => {
                  setSearch(value);
                  setStatusField(value);
                }}
              />
            ) : (
              <CustomInput
                ref={searchInputRef}
                placeholder={`Search by ${searchField}...`}
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            )}
          </div>
        </AnimatedReveal>

        <AnimatedReveal direction="left" delay={0.3}>
          <Button
            text="Add Campaign"
            onClick={() => {
              setDrawerOpen(true);
              setEditCampaign(null);
              setPreviewData(null);
              setMode("add");
            }}
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

      {/*  Table */}
      {isLoading ? (
        <div className="flex justify-center py-8"><CustomLoader /></div>
      ) : (
        <DataTableWrapper columns={columns as any} data={paginatedData} />
      )}

      {/*  Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-4">
          <AdminCustomPagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      )}

      {/*  Drawer */}
      {drawerOpen && (
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditCampaign(null);
            setMode("add");
            setPreviewData(null);
          }}
          title={
            mode === "edit"
              ? "Edit Campaign"
              : mode === "view" || mode === "preview-edit"
              ? "View Campaign"
              : "Add Campaign"
          }
          mode={mode}
        >
          {(mode === "view" || mode === "preview-edit") && (
            !previewData || isLoadingCampaign ? (
              <div className="flex justify-center py-10"><CustomLoader /></div>
            ) : (
              <CampaignPreview
                mode={mode}
                showButton={mode === "preview-edit"}
                data={normalizeCampaignData(previewData as any) as any}
                onBack={() => {
                  setShowPreview(false);
                  setMode(editCampaign ? "edit" : "add");
                }}
                createMutation={createMutation}
                updateMutation={updateMutation}
                onSubmit={() =>
                  submitCampaignForm(
                    { ...previewData!, keyPoints: previewData!.keyPoints } as any,
                    singleCampaignData as any,
                    createMutation,
                    updateMutation,
                    () => {
                      setPreviewData(null);
                      setShowPreview(false);
                      setDrawerOpen(false);
                    },
                    () => {},
                    () => setDrawerOpen(false)
                  )
                }
              />
            )
          )}

          {(mode === "add" || mode === "edit") && (
            localLoading ? (
              <div><CustomLoader /></div>
            ) : (
              <CampaignForm
                initialData={{
                  ...(normalizedCampaignData ?? {}),
                  ...(previewData ?? {}),
                  images: previewData?.images?.length
                    ? previewData.images
                    : normalizedCampaignData?.images ?? [],
                  existingImages: previewData?.existingImages?.length
                    ? previewData.existingImages
                    : normalizedCampaignData?.existingImages ?? [],
                } as any}
                onClose={() => {
                  setDrawerOpen(false);
                  setPreviewData(null);
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

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={isOpen}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setIsOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
        buttonText="Delete"
      />
    </div>
  );
};

export default CampaignTable;

