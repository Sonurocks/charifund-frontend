
import { useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { CampaignFormValues } from "@/src/utils/validations/FormValidation";
import toast from "react-hot-toast";
import { useLanguageAwareQuery } from "@/src/hooks/web/useLanguageAwareQuery";
import { deleteSingleCampaign, fetchAllCampaigns, fetchCampaignById } from "@/src/services/admin/campaignApi";
import { CampaignFormProps } from "@/src/types/admin/campaign";

// Convert values to FormData
const buildFormData = (values: CampaignFormValues) => {
  const formData = new FormData();

  const appendNestedObject = (key: string, obj: any) => {
    formData.append(key, JSON.stringify(obj));
  };

  appendNestedObject("title", values.title);
  appendNestedObject("category", values.category);
  appendNestedObject("description", values.description);
  appendNestedObject("summary", values.summary);
  appendNestedObject("location", values.location);

  // Goal amount
  formData.append("goalAmount", values.goalAmount.toString());

  // KeyPoints by language
  if (values.keyPoints) {
    appendNestedObject("keyPoints", values.keyPoints);
  }

  // Existing images URLs (send each under 'existingImages')
  values.existingImages?.forEach((url) => {
    if (url) formData.append("existingImages", url);
  });

  // New image files
  if (values.images && values.images.length > 0) {
    values.images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });
  }

  return formData;
};


//  function to handle campaign create
const handleCreateCampaign = (
  values: CampaignFormValues,
  createMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Creating campaign...");
  const formData = buildFormData(values);

  createMutation.mutate(formData, {
    onSuccess: () => {
      toast.dismiss();
      toast.success("Campaign created");
      resetForm();
      setSubmitting(false);
      onClose();
    },
    onError: (err: any) => {
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Failed to create");
      setSubmitting(false);
    },
  });
};

// function to handle campaign update
const handleUpdateCampaign = (
  id: string,
  values: CampaignFormValues,
  updateMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Updating campaign...");
  const formData = buildFormData(values);
  console.log("check", formData)
  updateMutation.mutate(
    { id, values: formData },
    {
      onSuccess: () => {
        toast.dismiss();
        toast.success("Campaign updated");
        resetForm();
        setSubmitting(false);
        onClose();
      },
      onError: (err: any) => {
        toast.dismiss();
        toast.error(err?.response?.data?.message || "Failed to update");
        setSubmitting(false);
      },
    }
  );
};

// unified form submit
export const submitCampaignForm = (
  values: CampaignFormValues,
  initialData: CampaignFormProps["initialData"],
  createMutation: any,
  updateMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  if (initialData?.id) {
    handleUpdateCampaign(initialData.id.toString(), values, updateMutation, resetForm, setSubmitting, onClose);
  } else {
    handleCreateCampaign(values, createMutation, resetForm, setSubmitting, onClose);
  }
};


export const useFetchAllCampaigns = (page: number, limit: number = 10, search?: string, searchField?: string) => {
  return useLanguageAwareQuery(
    ["campaigns", page, limit, search, searchField],
    () => fetchAllCampaigns(page, limit, search, searchField),
    {
      staleTime: 5 * 60 * 1000,
      placeholderData: keepPreviousData
    }
  );
};


export const useFetchSingleCampaign = (id?: string, options?: { enabled?: boolean }) => {
  return useLanguageAwareQuery(
    ["campaign", id],
    () => fetchCampaignById(id!),
    {
      enabled: options?.enabled ?? !!id,
      staleTime: 5 * 60 * 1000,
      placeholderData: keepPreviousData
    }
  );
};


//  Delete campaign
export const useDeleteSignleCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSingleCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.dismiss();
      toast.success("Campaign deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete campaign");
    }
  });
};


