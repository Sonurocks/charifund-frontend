import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  fetchFeedbacks,
  fetchFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  fetchApprovedFeedbacks,
} from "@/src/services/admin/feedbackApi";
import { useLanguageAwareQuery } from "@/src/hooks/web/useLanguageAwareQuery";
import { FeedbackFormValues } from "@/src/utils/validations/FormValidation";

//  Fetch All Feedbacks (
export const useFetchFeedbacks = (
  page: number,
  limit: number,
  searchedData: string,
  searchField: string
) => {
  return useLanguageAwareQuery(
    ["feedbacks", page, limit, searchedData, searchField],
    () => fetchFeedbacks(page, limit, searchedData, searchField),
    {
      staleTime: 5 * 60 * 1000,
      placeholderData: keepPreviousData

    }
  );
};

export const useFetchApprovedFeedbacks = (
  page: number,
  limit: number,
  status: string
) => {
  return useLanguageAwareQuery(
    ["approved-feedbacks", page, limit, status],
    () => fetchApprovedFeedbacks(page, limit, status),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

//  Fetch Single Feedback (Admin)
export const useFetchFeedbackById = (id: string, enabled: boolean = true) => {
  return useLanguageAwareQuery(
    ["feedback", id],
    () => fetchFeedbackById(id),
    {
      enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};


// ✅ Convert values to FormData
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


  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
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

  console.log('🌐 Sending API request to backend...');
  createMutation.mutate(formData, {
    onSuccess: (response: any) => {
      toast.dismiss();
      toast.success("Feedback submitted successfully");
      resetForm();
      setSubmitting(false);
      onClose();
    },
    onError: (err: any) => {
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
      toast.dismiss();
      console.log("error check", err)
      toast.error(err?.response?.data?.message || "Failed to update blog");
    },
  });
};

// ✅ Unified feedback form submit
export const submitFeedbackForm = (
  values: FeedbackFormValues,
  createMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  handleCreateFeedback(values, createMutation, resetForm, setSubmitting, onClose);
};

// ======================= Update Feedback ======================= //

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: { approved?: boolean; status?: "approved" | "rejected" } }) =>
      updateFeedback(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.success("Feedback updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update feedback");
    },
  });
};

// ======================= Delete Feedback ======================= //

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      toast.dismiss();
      toast.success("Feedback deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete feedback");
    },
  });
};
