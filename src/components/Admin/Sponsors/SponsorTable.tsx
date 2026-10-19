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

const SponsorTable = () => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<SponsorSearchField>("name");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editSponsorId, setEditSponsorId] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view" | "preview-edit">("add");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = useState<SponsorFormValues | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<AdminSponsor | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const searchedData = useDebounce(search, 500);

  const {
    data: apiSponsorData,
    isLoading,
  } = useFetchAllSponsors(currentPage, itemsPerPage, searchedData, searchField);

  const {
    data: singleSponsorData,
    isLoading: isLoadingSingle,
    refetch: refetchSingle,
  } = useFetchSingleSponsor(editSponsorId || undefined);

  const deleteSponsorMutation = useDeleteSingleSponsor();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSponsor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["web-sponsors"] });
    },
  });

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

  const tableData: AdminSponsor[] = useMemo(() => {
    if (apiSponsorData?.sponsors && Array.isArray(apiSponsorData.sponsors)) {
      return apiSponsorData.sponsors;
    }
    return [];
  }, [apiSponsorData]);

  const totalPages = apiSponsorData?.totalPages || 1;

  const handleEdit = useCallback((sponsor: AdminSponsor) => {
    const id = sponsor.id || (sponsor as any)._id;
    setEditSponsorId(id);
    setPreviewData(null);
    setMode("edit");
    setDrawerOpen(true);
  }, []);

  const handleView = useCallback(
    (sponsor: AdminSponsor) => {
      const id = sponsor.id || (sponsor as any)._id;
      setEditSponsorId(id);
      setPreviewData(null);
      setMode("view");
      setDrawerOpen(true);
      refetchSingle();
    },
    [refetchSingle]
  );

  const handleDelete = useCallback((sponsor: AdminSponsor) => {
    setSelectedSponsor(sponsor);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!selectedSponsor) return;
    const id = selectedSponsor.id || (selectedSponsor as any)._id;
    setDeleteLoading(true);
    toast.dismiss();
    toast.loading("Deleting sponsor...");

    deleteSponsorMutation.mutate(id, {
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

  const currentFormData = useMemo(() => {
    if (!editSponsorId) return null;
    let data = singleSponsorData || tableData.find((s) => s.id === editSponsorId || (s as any)._id === editSponsorId) || null;
    if (data && (data as any).sponsor) data = (data as any).sponsor;
    if (data && (data as any).data) data = (data as any).data;
    return data;
  }, [editSponsorId, singleSponsorData, tableData]);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setEditSponsorId(null);
    setMode("add");
    setPreviewData(null);
  }, []);

  return (
    <section>
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

      {isLoading ? (
        <div className="flex justify-center py-10">
          <CustomLoader />
        </div>
      ) : (
        <DataTableWrapper columns={columns} data={tableData} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-4">
          <AdminCustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {drawerOpen && (
        <Drawer
          isOpen={drawerOpen}
          onClose={handleDrawerClose}
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
          {(mode === "view" || mode === "preview-edit") && (
            <SponsorPreview
              data={previewData || currentFormData}
              showButton={mode === "preview-edit"}
              mode={mode}
              createMutation={createMutation}
              updateMutation={updateMutation}
              onBack={() => {
                setMode(editSponsorId ? "edit" : "add");
              }}
              onSubmit={() => {
                if (!previewData) return;
                submitSponsorForm(
                  previewData,
                  currentFormData,
                  createMutation,
                  updateMutation,
                  handleDrawerClose,
                  () => {},
                  handleDrawerClose
                );
              }}
            />
          )}

          {(mode === "add" || mode === "edit") && (
            isLoadingSingle ? (
              <div className="flex justify-center py-10">
                <CustomLoader />
              </div>
            ) : (
              <SponsorForm
                key={`${editSponsorId || "new"}-${mode}`}
                initialData={previewData || currentFormData || undefined}
                onClose={handleDrawerClose}
                mode={mode}
                onPreview={(data) => {
                  setPreviewData(data);
                  setMode("preview-edit");
                }}
              />
            )
          )}
        </Drawer>
      )}

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
