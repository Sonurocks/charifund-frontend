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

export const buildSponsorFormData = (values: SponsorFormValues, isUpdate: boolean = false): FormData => {
  const formData = new FormData();

  const appendNestedObject = (key: string, obj: any) => {
    formData.append(key, JSON.stringify(obj));
  };

  appendNestedObject("name", values.name);
  appendNestedObject("category", values.category);
  if (values.location) {
    appendNestedObject("location", values.location);
  }
  appendNestedObject("shortDescription", values.shortDescription);
  appendNestedObject("description", values.description);

  formData.append("website", (values.website || "").trim());

  if (values.logo instanceof File) {
    formData.append("logo", values.logo);
  } else if (typeof values.logo === "string" && values.logo.trim() !== "") {
    formData.append("logo", values.logo);
    formData.append("existingLogo", values.logo);
    formData.append("existingImages[]", values.logo);
  }

  if (Array.isArray(values.existingImages)) {
    values.existingImages.forEach((url) => {
      if (url && typeof url === "string" && url !== values.logo) {
        formData.append("existingImages[]", url);
      }
    });
  }

  return formData;
};

const handleCreateSponsor = (
  values: SponsorFormValues,
  createMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Creating sponsor...");
  const formData = buildSponsorFormData(values, false);

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
  const formData = buildSponsorFormData(values, true);

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

export const submitSponsorForm = (
  values: SponsorFormValues,
  initialData: any,
  createMutation: any,
  updateMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  const targetId =
    initialData?.id ||
    initialData?._id ||
    initialData?.sponsor?.id ||
    initialData?.sponsor?._id ||
    initialData?.data?.id ||
    initialData?.data?._id;

  if (targetId) {
    handleUpdateSponsor(targetId.toString(), values, updateMutation, resetForm, setSubmitting, onClose);
  } else {
    handleCreateSponsor(values, createMutation, resetForm, setSubmitting, onClose);
  }
};

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
    retry: 1,
  });
};

export const useFetchSingleSponsor = (id?: string) => {
  return useQuery({
    queryKey: ["admin-sponsor", id],
    queryFn: () => fetchSponsorById(id!),
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
  });
};

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
