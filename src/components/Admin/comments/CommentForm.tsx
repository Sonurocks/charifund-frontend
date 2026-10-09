"use client";

import React from "react";
import { Formik, Form } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomInput from "../../UI/admin/CustomInput";
import { toast } from "react-hot-toast";
import { commentSchema, CommentFormValues } from "@/src/utils/validations/FormValidation";
import Dropdown from "../../UI/admin/Dropdown";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import CancelButton from "../../UI/web/Buttons/CancelButton";
import { updateComment } from "@/src/services/admin/commentsApi";
import { CommentFormProps } from "@/src/types/admin";


const CommentForm: React.FC<CommentFormProps> = ({ initialData, onClose, mode }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: { approved: boolean } }) =>
      updateComment(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  // Map backend status to form status (lowercase)
  const mapBackendStatusToFormStatus = (status?: string): string => {
    if (!status) return "pending";
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "PENDING":
      default:
        return "pending";
    }
  };

  const initialValues: CommentFormValues = {
    name: initialData?.name ?? "",
    comment: initialData?.comment ?? "",
    status: mapBackendStatusToFormStatus(initialData?.status),
    email: (initialData as any)?.email ?? "",
  };

  const hasBeenReviewed = initialData?.status && initialData.status.toUpperCase() !== "PENDING";

  const options = [
    ...(hasBeenReviewed ? [] : [{ label: "Pending", value: "pending" as const }]),
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];


  const handleSubmit = (
    values: CommentFormValues,
    resetForm: () => void,
    setSubmitting: (v: boolean) => void
  ) => {
    toast.dismiss();
    toast.loading("Updating comment...");

    const approvedValue =
      values.status === "approved" ? true : values.status === "rejected" ? false : undefined;

    if (approvedValue === undefined) {
      toast.dismiss();
      toast.error("Please select Approved or Rejected.");
      setSubmitting(false);
      return;
    }

    if (isEdit && initialData?.id) {
      updateMutation.mutate(
        {
          id: initialData.id,
          values: {
            approved: approvedValue,
          },
        },
        {
          onSuccess: () => {
            toast.dismiss();
            // toast success delegated to hook
            resetForm();
            setSubmitting(false);
            onClose();
          },
          onError: (err: any) => {
            toast.dismiss();
            // toast error delegated to hook
            setSubmitting(false);
          },
        }
      );
    }
  };

  return (
    <div className="w-full pb-6">
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={commentSchema}
        onSubmit={(values, { resetForm, setSubmitting }) =>
          handleSubmit(values, resetForm, setSubmitting)
        }
      >
        {({ values, handleChange, errors, touched, isSubmitting }) => (
          <Form className="flex flex-col gap-3">
            <CustomInput
              label="Name"
              placeholder="Enter name"
              value={values.name ?? ""}
              name="name"
              onChange={handleChange}
              error={touched.name ? errors.name : ""}
              disabled
            />

            <CustomInput
              label="Comment"
              as="textarea"
              placeholder="Enter comment"
              value={values.comment ?? ""}
              name="comment"
              onChange={handleChange}
              error={touched.comment ? errors.comment : ""}
              disabled
            />
            {mode === "view" &&(
            <CustomInput
              label="Email"
              placeholder="email"
              value={values.email ?? ""}
              name="email"
              onChange={handleChange}
              error={touched.comment ? errors.comment : ""}
              disabled
            />
            )}

            <Dropdown
              label="Status"
              value={values.status}
              onChange={(val) => handleChange({ target: { name: "status", value: val } })}
              options={options}
              error={touched.status && errors.status ? errors.status : ""}
              disabled={isView}
            />



            {!isView && (
              <div className="flex gap-2 mt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || updateMutation.isPending}
                  bgColor="bg-lime-green"
                  paddingx="px-4"
                  paddingy="py-2"
                  rounded="rounded-[5px]"
                >
                  {isSubmitting || updateMutation.isPending ? <ButtonLoader /> : "Update"}
                </Button>
                <CancelButton
                  text="Cancel"
                  onClose={onClose}
                />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CommentForm;


