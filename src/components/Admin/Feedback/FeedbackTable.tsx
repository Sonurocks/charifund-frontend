"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import Dropdown from "../../UI/admin/Dropdown";
import DataTableWrapper from "../../UI/admin/DataTableWrapper";
import Drawer from "../../UI/admin/Drawer";
import AdminCustomPagination from "../../UI/admin/CustomePagination";
import { getFeedbackColumns } from "./getFeedbackColumns";
import {
  useFetchFeedbacks,
  useFetchFeedbackById,
  useDeleteFeedback,
} from "@/src/hooks/admin/useFeedback";
import { Feedback, FeedbackApiResponse } from "@/src/types/web/feedback";
import FeedbackForm from "./FeedbackForm";
import ConfirmModal from "../../UI/admin/ConfirmModal";
import toast from "react-hot-toast";
import { FeedbackSearchField, FeedbackStatusField } from "@/src/types/admin/feedback";
import CustomInput from "../../UI/admin/CustomInput";
import useDebounce from "@/src/hooks/web/useDebounce";
import CustomLoader from "../../UI/web/Loader/CustomLoader";

const FeedbackTable = () => {
  const [search, setSearch] = useState<string>('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [searchField, setSearchField] = useState<string>('');
  const [mode, setMode] = useState<"edit" | "view">("view");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [statusField, setStatusField] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeedBack, setSelectedFeedBack] = useState<Feedback | null>(
    null
  );
  const searchedData = useDebounce(searchField === 'status' ? statusField : search, 1000);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Fetch feedback data with filters
  const { data: feedbackData, isLoading } = useFetchFeedbacks(
    currentPage,
    itemsPerPage,
    searchedData,
    searchField
  ) as { data: FeedbackApiResponse; isLoading: boolean, };

  const deleteFeedback = useDeleteFeedback();

  const totalPages = feedbackData?.totalPages || 1;

  // Fetch single feedback for drawer
  const {
    data: singleFeedbackData,
    isLoading: loadingFeedback,
    refetch: refetchSingleFeedback,
  } = useFetchFeedbackById(feedbackId || "");

  // Handlers
  const handleEdit = useCallback(
    (feedback: Feedback) => {
      setFeedbackId(feedback.id);
      setMode("edit");
      setDrawerOpen(true);
      refetchSingleFeedback();
    },
    [refetchSingleFeedback]
  );

  const handleView = useCallback(
    (feedback: Feedback) => {
      setFeedbackId(feedback.id);
      setMode("view");
      setDrawerOpen(true);
      refetchSingleFeedback();
    },
    [refetchSingleFeedback]
  );

  const handleDelete = useCallback(
    (feedback: Feedback) => {
      setSelectedFeedBack(feedback);
      setIsOpen(true);
    },
    [deleteFeedback]
  );
  const confirmDelete = useCallback(() => {
    if (selectedFeedBack) {
      setDeleteLoading(true)
      toast.dismiss();
      toast.loading("Deleting Feedback....")
      deleteFeedback.mutate(selectedFeedBack.id.toString(), {
        onSuccess: () => {
          setDeleteLoading(false)
          setIsOpen(false);
          setSelectedFeedBack(null);
        },
        onError: () => {
          setDeleteLoading(false)
          setIsOpen(false);
        },
      });
    }
  }, [selectedFeedBack, deleteFeedback]);

  const tableData = feedbackData?.feedback || [];

  const columns = useMemo(
    () =>
      getFeedbackColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
      }),
    [handleEdit, handleDelete, handleView]
  );

  return (
    <div>
      {/* Filter */}
      <div className="flex justify-start mb-4 gap-4 w-fit">
        <Dropdown
          options={FeedbackSearchField}
          value={searchField}
          onChange={(value) => {
            setSearchField(value);
            setSearch('');
            setStatusField(''); // reset status
            setCurrentPage(1);
            setTimeout(() => searchInputRef.current?.focus(), 0);
          }}
        />

        {searchField === 'status' ? (
          <Dropdown
            options={FeedbackStatusField}
            value={statusField}
            onChange={(value) => setStatusField(value)}
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


      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <CustomLoader />
        </div>
      ) : (
        <DataTableWrapper columns={columns} data={tableData} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
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
            setFeedbackId(null);
            setMode("view");
          }}
          mode={mode}
          title={mode === "edit" ? "Edit Feedback" : "View Feedback"}
          width="500px"
        >
          {loadingFeedback || !singleFeedbackData ? (
            <div className="flex justify-center py-8">
              <CustomLoader />
            </div>
          ) : (
            <FeedbackForm
              initialData={singleFeedbackData}
              onClose={() => setDrawerOpen(false)}
              mode={mode}
            />
          )}
        </Drawer>
      )}
      <ConfirmModal
        isOpen={isOpen}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setIsOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete these record ?"
        buttonText="Delete"
      />
    </div>
  );
};

export default FeedbackTable;
