"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import DataTableWrapper from "../../UI/admin/DataTableWrapper";
import CustomInput from "../../UI/admin/CustomInput";
import Dropdown from "../../UI/admin/Dropdown";
import Drawer from "../../UI/admin/Drawer";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BannerForm from "./BannerForm";
import { getBannerColumns } from "./getBannerColumns";
import { Banner } from "@/src/types/admin/banner";
import { BannerFormValues } from "@/src/utils/validations/FormValidation";
import {
  submitBannerForm,
  useDeleteBanner,
  useFetchAllBanners,
  useFetchSingleBanner,
} from "@/src/hooks/admin/useBanner";
import { BannerSearchOptions } from "../../../static-resource/admin";
import BannerPreview from "./BannerPreview";
import AdminCustomPagination from "../../UI/admin/CustomePagination";
import ConfirmModal from "../../UI/admin/ConfirmModal";
import toast from "react-hot-toast";
import useDebounce from "@/src/hooks/web/useDebounce";
import Button from "../../UI/web/Buttons/Button";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { createBanner, updateBanner } from "@/src/services/admin/bannerApi";
import { BannerSearchField } from "@/src/types/web/banner";

const BannerTable = () => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<BannerSearchField>("title");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editBannerId, setEditBannerId] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view" | "preview-edit">("add");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading,setDeleteLoading]=useState<boolean>(false)
  const [itemsPerPage] = useState(10);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<BannerFormValues | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const debounceValue = useDebounce(search, 1000);
  const queryClient = useQueryClient();

  //  Updated: Pass both field & search value
  const { data: bannerData, isLoading } = useFetchAllBanners(
    currentPage,
    itemsPerPage,
    debounceValue,
    searchField    

  );

  const deleteMutation = useDeleteBanner();
  const totalPages = bannerData?.totalPages || 1;

  const [bannerId, setBannerId] = useState<string | null>(null);
  const { data: singleBannerData, isLoading: isPreviewLoading, refetch } = useFetchSingleBanner(
    bannerId || undefined
  );

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: BannerFormValues }) => updateBanner(data.id, data.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      if (bannerId) queryClient.invalidateQueries({ queryKey: ["banner", bannerId] });
    },
  });

  const handleDelete = useCallback((b: Banner) => {
    if (!b.id) {
      console.error("Cannot delete banner: ID is missing.");
      return;
    }
    setSelectedBanner(b);
    setIsOpen(true);
  }, [deleteMutation]);

  const confirmDelete = useCallback(() => {
    if (selectedBanner?.id) {
      setDeleteLoading(true)
      toast.dismiss();
      toast.loading("Deleting banner...");
      deleteMutation.mutate(selectedBanner.id.toString(), {
      onSuccess: () => {
        setDeleteLoading(false)
        setIsOpen(false);
      setSelectedBanner(null);
      },
      onError: () => {
        setIsOpen(false); 
      },
    });
    }
  }, [selectedBanner, deleteMutation]);

  const handlePreview = useCallback(
    async (banner: Banner) => {
      if (!banner.id) return;
      setBannerId(banner.id);
      setMode("view");
      setDrawerOpen(true);
      setPreviewData(null);
      setShowPreview(false);

      try {
        setTimeout(async () => {
          const { data } = await refetch();
          if (data) {
            setShowPreview(true);
            setPreviewData(data);
          }
        }, 100);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      }
    },
    [refetch]
  );

  const handleEdit = useCallback((b: Banner) => {
    setBannerId(b.id?.toString() ?? null);
    setMode("edit");
    setDrawerOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getBannerColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handlePreview,
      }),
    [handleEdit, handleDelete, handlePreview]
  );

  return (
    <section>
      {/* === Top Controls === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        {/* Left: search field */}
        <AnimatedReveal direction="left" delay={0.1}>
          <div className="w-fit flex flex-row gap-2">
            <Dropdown
              options={BannerSearchOptions}
              value={searchField}
              onChange={(value: BannerSearchField) => {
                setSearchField(value);
                setSearch("");
              }}
            />
            <CustomInput
              ref={searchInputRef}
              placeholder={`Search by ${searchField}...`}
              value={search}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </AnimatedReveal>

        {/* Right: Add button */}
        <AnimatedReveal direction="left" delay={0.3}>
          <div className="w-fit">
            <Button
              text="Add Banner"
              onClick={() => {
                setEditBannerId(null);
                setMode("add");
                setDrawerOpen(true);
                setPreviewData(null);
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

      {/* === Table Data === */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <CustomLoader />
        </div>
      ) : (
        <DataTableWrapper columns={columns} data={bannerData?.banners || []} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <AdminCustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* === Drawer === */}
      {drawerOpen && (
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditBannerId(null);
            setMode("add");
            setPreviewData(null);
            setShowPreview(false);
          }}
          title={
            mode === "edit"
              ? "Edit Banner"
              : mode === "view" || mode === "preview-edit"
              ? "View Banner"
              : "Add Banner"
          }
          mode={mode}
        >
          {(mode === "view" || mode === "preview-edit") &&
            (!previewData || isPreviewLoading ? (
              <div className="flex justify-center py-10">
                <CustomLoader />
              </div>
            ) : (
              <BannerPreview
                mode={mode}
                showButtons={mode === "preview-edit"}
                data={previewData!}
                onBack={() => {
                  setShowPreview(false);
                  setMode(editBannerId ? "edit" : "add");
                }}
                createMutation={createMutation}
                updateMutation={updateMutation}
                onSubmit={() => {
                  if (!previewData) return;
                  const editBannerData = singleBannerData ?? null;

                  submitBannerForm(
                    previewData,
                    editBannerData,
                    createMutation,
                    updateMutation,
                    () => {
                      setShowPreview(false);
                      setPreviewData(null);
                      setDrawerOpen(false);
                    },
                    () => {},
                    () => setDrawerOpen(false)
                  );
                }}
              />
            ))}

          {(mode === "add" || mode === "edit") &&
            (isPreviewLoading ? (
              <div>
                <CustomLoader />
              </div>
            ) : (
              <BannerForm
                initialData={{
                  ...(singleBannerData || {}),
                  ...(previewData || {}),
                  image: previewData?.image || singleBannerData?.image || "",
                  priority:
                    previewData?.priority || singleBannerData?.priority || 0,
                }}
                onClose={() => {
                  setDrawerOpen(false);
                  setPreviewData(null);
                  setShowPreview(false);
                }}
                mode={mode}
                onPreview={(data:any) => {
                  setPreviewData(data);
                  setShowPreview(true);
                  setMode("preview-edit");
                }}
                createMutation={createMutation}
                updateMutation={updateMutation}
              />
            ))}
        </Drawer>
      )}

      <ConfirmModal
        isOpen={isOpen}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setIsOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this record?"
        buttonText="Delete"
      />
    </section>
  );
};

export default BannerTable;


