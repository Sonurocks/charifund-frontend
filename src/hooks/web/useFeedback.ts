import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFeedback, fetchApprovedFeedbacks } from "@/src/services/web";
import { useLanguageAwareQuery } from "./useLanguageAwareQuery";
import { FeedbackFormValues } from "@/src/utils/validations/FormValidation";

export const useFetchApprovedFeedbacks = (
  page: number,
  limit: number,
  status: any
) => {
  return useLanguageAwareQuery(
    ["approved-feedbacks", page, limit, status],
    () => fetchApprovedFeedbacks(page, limit, status),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

//  Convert values to FormData
const buildFeedbackFormData = (values: FeedbackFormValues) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("designation", values.designation);
  formData.append("feedback", values.feedback);
  formData.append("rating", values.rating.toString());

  // Handle image
  if (values.image && values.image instanceof File) {
    formData.append("image", values.image);
  }

  return formData;
};

// ✅ Handle feedback create
const handleCreateFeedback = (
  values: FeedbackFormValues,
  createMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
 
  
  toast.dismiss();
  toast.loading("Submitting feedback...");
  const formData = buildFeedbackFormData(values);

  createMutation.mutate(formData, {
    onSuccess: (response: any) => {
      toast.dismiss();
      toast.success("Feedback submitted successfully");
      resetForm();
      setSubmitting(false);
      onClose();
    },
    onError: (err: any) => {
      console.log(' FEEDBACK SUBMISSION FAILED!');
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Failed to submit feedback");
      setSubmitting(false);
    },
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createFeedback(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: (err: any) => {
      // Error handling is done in handleCreateFeedback
    },
  });
};

// Unified feedback form submit
export const submitFeedbackForm = (
  values: FeedbackFormValues,
  createMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  handleCreateFeedback(values, createMutation, resetForm, setSubmitting, onClose);
};

