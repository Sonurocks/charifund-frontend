import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SponsorFormValues } from "@/src/utils/validations/FormValidation";
import {
  createSponsor,
  deleteSponsor,
  fetchAllSponsors,
  fetchSponsorById,
  updateSponsor,
} from "@/src/services/admin/sponsorApi";
import { getApiErrorMessage, getApiSuccessMessage } from "@/src/utils/apiHelpers";

// Convert form values to FormData for multipart upload
export const buildSponsorFormData = (values: SponsorFormValues): FormData => {
  const formData = new FormData();

  const appendNestedObject = (key: string, obj: any) => {
    formData.append(key, JSON.stringify(obj));
  };

  // Bilingual fields as JSON strings
  appendNestedObject("name", values.name);
  appendNestedObject("category", values.category);
  if (values.location) {
    appendNestedObject("location", values.location);
  }
  appendNestedObject("shortDescription", values.shortDescription);
  appendNestedObject("description", values.description);

  // Website URL
  if (values.website) {
    formData.append("website", values.website);
  }

  // Existing Images/Logo URL preservation (supports multiple backend naming patterns)
  if (Array.isArray(values.existingImages) && values.existingImages.length > 0) {
    values.existingImages.forEach((url) => {
      if (url) {
        formData.append("existingImages[]", url);
        formData.append("existingImage", url);
      }
    });
  } else if (typeof values.logo === "string" && values.logo.trim() !== "") {
    formData.append("existingImages[]", values.logo);
    formData.append("existingImage", values.logo);
    formData.append("logo", values.logo);
    formData.append("image", values.logo);
  }

  // Logo file (supports both 'logo' and 'image' field names)
  if (values.logo && values.logo instanceof File) {
    formData.append("logo", values.logo);
    formData.append("image", values.logo);
  }

  return formData;
};

// Handle create sponsor
const handleCreateSponsor = (
  values: SponsorFormValues,
  createMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Creating sponsor...");
  const formData = buildSponsorFormData(values);

  createMutation.mutate(formData, {
    onSuccess: (data: any) => {
      toast.dismiss();
      toast.success(getApiSuccessMessage(data, "Sponsor created successfully"));
      resetForm();
      setSubmitting(false);
      onClose();
    },
    onError: (err: any) => {
      toast.dismiss();
      toast.error(getApiErrorMessage(err, "Failed to create sponsor"));
      setSubmitting(false);
    },
  });
};

// Handle update sponsor
const handleUpdateSponsor = (
  id: string,
  values: SponsorFormValues,
  updateMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Updating sponsor...");
  const formData = buildSponsorFormData(values);

  updateMutation.mutate(
    { id, values: formData },
    {
      onSuccess: (data: any) => {
        toast.dismiss();
        toast.success(getApiSuccessMessage(data, "Sponsor updated successfully"));
        resetForm();
        setSubmitting(false);
        onClose();
      },
      onError: (err: any) => {
        toast.dismiss();
        toast.error(getApiErrorMessage(err, "Failed to update sponsor"));
        setSubmitting(false);
      },
    }
  );
};

// Unified sponsor form submit
export const submitSponsorForm = (
  values: SponsorFormValues,
  initialData: any,
  createMutation: any,
  updateMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  if (initialData?.id) {
    handleUpdateSponsor(initialData.id.toString(), values, updateMutation, resetForm, setSubmitting, onClose);
  } else {
    handleCreateSponsor(values, createMutation, resetForm, setSubmitting, onClose);
  }
};

// Fetch sponsors with pagination and search
export const useFetchAllSponsors = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  searchField?: string
) => {
  return useQuery({
    queryKey: ["admin-sponsors", page, limit, search, searchField],
    queryFn: () => fetchAllSponsors(page, limit, search, searchField),
    placeholderData: keepPreviousData,
  });
};

// Fetch single sponsor
export const useFetchSingleSponsor = (id?: string) => {
  return useQuery({
    queryKey: ["admin-sponsor", id],
    queryFn: () => fetchSponsorById(id!),
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
  });
};

// Delete sponsor
export const useDeleteSingleSponsor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSponsor,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["admin-sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["web-sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["web-sponsor"] });
      toast.dismiss();
      toast.success(getApiSuccessMessage(data, "Sponsor deleted successfully"));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to delete sponsor"));
    },
  });
};
