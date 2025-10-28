"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import Dropdown from "../../UI/admin/Dropdown";
import DataTableWrapper from "../../UI/admin/DataTableWrapper";
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import {
  useDeleteComment,
  useFetchComments,
  useFetchCommentById,
} from "@/src/hooks/admin/useComments";
import { getCommentColumns } from "./getCommentColumns";
import { Comment } from "@/src/types/web/comments";
import Drawer from "../../UI/admin/Drawer";
import CommentForm from "./CommentForm";
import AdminCustomPagination from "../../UI/admin/CustomePagination";
import ConfirmModal from "../../UI/admin/ConfirmModal";
import toast from "react-hot-toast";
import CustomLoader from "../../UI/web/Loader/CustomLoader";

const CommentTable = () => {
  const [status, setStatus] = useState<
    "all" | "approved" | "rejected" | "pending"
  >("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [CommentId, setCommentId] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [currentPage, setCurrentPage] = useState(1);
  const[deleteLoading,setDeleteLoading]=useState<boolean>(false);
  const [itemsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const { data: commentData, isLoading } = useFetchComments(
    currentPage,
    itemsPerPage,
    status
  );

  const deleteComment = useDeleteComment();
  const totalPages = commentData?.totalPages || 1;

  const {
    data: singleCommentData,
    isLoading: loadingComment,
    refetch: refetchSingleComment,
  } = useFetchCommentById(CommentId || "");

  const handleEdit = useCallback(
    (comment: Comment) => {
      setCommentId(comment.id);
      setMode("edit");
      setDrawerOpen(true);
      refetchSingleComment();
    },
    [refetchSingleComment]
  );

  const handleView = useCallback(
    (comment: Comment) => {
      setCommentId(comment.id);
      setMode("view");
      setDrawerOpen(true);
      refetchSingleComment();
    },
    [refetchSingleComment]
  );

  const handleDelete = useCallback(
    (comment: Comment) => {
      // if (
      //   confirm(
      //     `Are you sure you want to delete this comment by "${comment.name}"?`
      //   )
      // ) {
      //   deleteComment(comment.id);
      // }
      setSelectedComment(comment);
      setIsOpen(true);
    },
    [deleteComment]
  );

  const confirmDelete = useCallback(() => {
    if (selectedComment) {
      setDeleteLoading(true)
      toast.dismiss();
        toast.loading("Deleting Comment....")
        deleteComment.mutate(selectedComment.id.toString(), {
      onSuccess: () => {
        setDeleteLoading(false)
        setIsOpen(false);
      setSelectedComment(null);
      },
      onError: () => {
        setDeleteLoading(false)
        setIsOpen(false); 
      },
    });      
    }
  }, [selectedComment, deleteComment]);

  const tableData = commentData?.comments || [];

  const columns = useMemo(
    () =>
      getCommentColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
      }),
    [handleEdit, handleDelete, handleView]
  );

  return (
    <div>
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <AnimatedReveal direction="left" delay={0.1}>
          <div className=" flex flex-col sm:flex-row gap-2"></div>
          <Dropdown
            options={[
              { label: "All", value: "all" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
              { label: "Pending", value: "pending" },
            ]}
            value={status}
            onChange={(value) => {
              setStatus(value);
              setCurrentPage(1); // reset to first page on status change
            }}
          />
        </AnimatedReveal>
      </div>

      {/* Data table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
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

      {/* Drawer */}
      {drawerOpen && (
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setCommentId(null);
            setMode("view");
          }}
          mode={mode}
          title={mode === "edit" ? "Edit Comment" : "View Comment"}
          width="500px"
        >
          {loadingComment || !singleCommentData ? (
            <div className="flex justify-center py-8">
              <CustomLoader />
            </div>
          ) : (
            <CommentForm
              initialData={singleCommentData}
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

export default CommentTable;





