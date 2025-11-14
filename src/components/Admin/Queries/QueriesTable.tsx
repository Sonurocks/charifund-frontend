"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import DataTableWrapper from "../../UI/admin/DataTableWrapper";
import AdminCustomPagination from "../../UI/admin/CustomePagination";
import Drawer from "../../UI/admin/Drawer";

import { getQueryColumns } from "./getQueriesColumns";
import {
  useDeleteQuery,
  useFetchAllQueries,
  useFetchSingleQuery,
} from "@/src/hooks/admin/useQueries";
import { Query } from "@/src/types/web/query";
import QueryPreview from "./QueryPreview";
import Dropdown from "../../UI/admin/Dropdown";
import {
  filterFields,
  formTypeOptions,
  isViewedOptions,
} from "@/src/staticResource";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import ConfirmModal from "../../UI/admin/ConfirmModal";
import toast from "react-hot-toast";
import CustomLoader from "../../UI/web/Loader/CustomLoader";


const QueriesTable = () => {
  const [filterField, setFilterField] = useState<
    "none" | "isViewed" | "formType"
  >("none");
  const [filterValue, setFilterValue] = useState<string>("all");

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [queryId, setqueryId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Query | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuerry, setSelectedQuerry] = useState<Query | null>(null);
  const[deleteLoading,setDeleteLoading]=useState<boolean>(false)


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: allData, isLoading } = useFetchAllQueries(
    currentPage,
    itemsPerPage,
    filterValue,
    filterField
  ) as { data: { queries: Query[]; totalPages: number }, isLoading: boolean };

  const totalPages = allData?.totalPages ?? 1;

  // Fetch single query (optional - only if needed for preview)
  const {
    data: singleQueryData,
    isLoading: isSingleQueryLoading,
    refetch: refetchSingle,
  } = useFetchSingleQuery(queryId);

  // Delete mutation
  const deleteQuery = useDeleteQuery();

  // Handlers
  const handleView = useCallback(
    (e: Query) => {
      setqueryId(e.id ?? null);
      setPreviewData(e);
      setDrawerOpen(true);
      refetchSingle();
    },
    [refetchSingle]
  );

  const handleDelete = useCallback(
    (e: Query) => {
    
      setSelectedQuerry(e);
      setIsOpen(true);
    },
    [deleteQuery]
  );

  const confirmDelete = useCallback(() => {
    if (selectedQuerry?.id) {
      setDeleteLoading(true)
      toast.dismiss();
      toast.loading("Deleting Query....")
      deleteQuery.mutate(selectedQuerry.id.toString(), {
      onSuccess: () => {
        setDeleteLoading(false)
        setIsOpen(false);
      setSelectedQuerry(null);
      },
      onError: () => {
        setDeleteLoading(false)
        setIsOpen(false); 
      },
    });      
    }
  }, [selectedQuerry, deleteQuery]);

  const columns = useMemo(
    () =>
      getQueryColumns({
        onEdit: () => {}, 
        onDelete: handleDelete,
        onView: handleView,
      }),
    [handleDelete, handleView]
  );

  return (
    <section>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
      <AnimatedReveal
        direction="left"
        delay={0.1}
        className="w-full md:w-fit flex flex-row gap-2 mb-5 md:mb-0"
      >
        <Dropdown
          options={filterFields}
          value={filterField}
          onChange={(value) => {
            setFilterField(value as "none" | "isViewed" | "formType");
            setFilterValue("all");
          }}
        />

        <Dropdown
          options={
            filterField === "isViewed"
              ? isViewedOptions
              : filterField === "formType"
              ? formTypeOptions
              : [{ label: "Select option", value: "all" }]
          }
          value={filterValue}
          onChange={setFilterValue}
          disabled={filterField === "none"}
        />
      </AnimatedReveal>
          </div>
      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <CustomLoader />
        </div>
      ) : (
        <DataTableWrapper columns={columns} data={allData?.forms} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <AdminCustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* View Drawer */}
      {drawerOpen && previewData && (
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setqueryId(null);
            setPreviewData(null);
          }}
          title="Preview Query"
          mode="view"
        >
          {isSingleQueryLoading ? (
            <CustomLoader />
          ) : (
            <QueryPreview
              data={singleQueryData}
              onClose={() => {
                setDrawerOpen(false);
                setqueryId(null);
                setPreviewData(null);
              }}
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
    </section>
  );
};

export default QueriesTable;
