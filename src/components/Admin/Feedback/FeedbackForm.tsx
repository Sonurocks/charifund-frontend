"use client";

import React from "react";
import { Formik, Form } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomInput from "../../UI/admin/CustomInput";
import Dropdown from "../../UI/admin/Dropdown";
import { toast } from "react-hot-toast";
import { feedbackSchema, FeedbackFormValues } from "@/src/utils/validations/FormValidation";
import { Feedback } from "@/src/types/web/feedback";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import Button from "../../UI/web/Buttons/Button";
import CancelButton from "../../UI/web/Buttons/CancelButton";
import { updateFeedback } from "@/src/services/admin/feedbackApi";
import { FeedbackFormProps } from "@/src/types/admin";
import Image from "next/image";



const FeedbackForm: React.FC<FeedbackFormProps> = ({ initialData, onClose, mode }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const queryClient = useQueryClient();

  // Map backend status to form status
  const mapBackendStatusToFormStatus = (
    status?: string
  ): "PENDING" | "APPROVED" | "REJECTED" => {
    if (!status) return "PENDING";
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "APPROVED";
      case "REJECTED":
        return "REJECTED";
      case "PENDING":
      default:
        return "PENDING";
    }
  };

  const initialValues: FeedbackFormValues = {
    name: initialData?.name ?? "",
    designation: initialData?.designation ?? "",
    image: initialData?.image as string | undefined,
    feedback: initialData?.feedback ?? "",
    rating: initialData?.rating ?? 0,
    status: mapBackendStatusToFormStatus(initialData?.status),
  };

  const hasBeenReviewed =
    initialData?.status && initialData.status.toUpperCase() !== "PENDING";

  const options = [
    ...(hasBeenReviewed ? [] : [{ label: "Pending", value: "PENDING" as const }]),
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: { approved?: boolean } }) =>
      updateFeedback(id, values),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  const handleSubmit = (
    values: FeedbackFormValues,
    resetForm: () => void,
    setSubmitting: (v: boolean) => void
  ) => {
    toast.dismiss();
    toast.loading("Updating feedback...");

    let statusBoolean: boolean | undefined;

    if (values.status === "APPROVED") {
      statusBoolean = true;
    } else if (values.status === "REJECTED") {
      statusBoolean = false;
    } else {
      statusBoolean = undefined;
    }

    const payload: { approved?: boolean } = {
      ...(statusBoolean !== undefined ? { approved: statusBoolean } : {}),
    };


    if (isEdit && initialData?.id) {
      updateMutation.mutate(
        {
          id: initialData.id,
          values: payload,
        },
        {
          onSuccess: () => {
            toast.dismiss();
            toast.success("Feedback updated");
            resetForm();
            setSubmitting(false);
            onClose();
          },
          onError: (err: any) => {
            toast.dismiss();
            toast.error(err?.message || "Failed to update feedback");
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
        validationSchema={feedbackSchema}
        onSubmit={(values, { resetForm, setSubmitting }) =>
          handleSubmit(values, resetForm, setSubmitting)
        }
      >
        {({ values, handleChange, errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="flex flex-col gap-3">
            <CustomInput
              label="Name"
              placeholder="Enter name"
              value={values.name}
              name="name"
              onChange={handleChange}
              error={touched.name ? errors.name : ""}
              disabled
            />

            <CustomInput
              label="Designation"
              placeholder="Enter designation"
              value={values.designation}
              name="designation"
              onChange={handleChange}
              error={touched.designation ? errors.designation : ""}
              disabled
            />

            

            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden">
              <Image
                src={values.image || "/default-avatar.webp"} // fallback agar image missing ho
                alt="Feedback user"
                fill
                className="object-cover object-center rounded-lg"
                priority
              />
            </div>



            <CustomInput
              label="Feedback"
              as="textarea"
              placeholder="Enter feedback"
              value={values.feedback}
              name="feedback"
              onChange={handleChange}
              error={touched.feedback ? errors.feedback : ""}
              disabled
            />

            <CustomInput
              label="Rating"
              placeholder="Enter rating (1-5)"
              type="number"
              value={values.rating}
              name="rating"
              onChange={handleChange}
              error={touched.rating ? errors.rating : ""}
              disabled
            />

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
                  disabled={isSubmitting}
                  bgColor="bg-lime-green"
                  paddingx="px-4"
                  paddingy="py-2"
                  rounded="rounded-[5px]"
                >
                  {isSubmitting ? <ButtonLoader /> : "Update"}
                </Button>
                <CancelButton text="Cancel" onClose={onClose} />
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FeedbackForm;
