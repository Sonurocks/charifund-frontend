import { getApiErrorMessage, getApiSuccessMessage } from "@/src/utils/apiHelpers";
// src/hooks/useBanners.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBanner, fetchAllBanners, fetchBannerById } from "@/src/services/admin/bannerApi";
import { BannerFormValues } from "@/src/utils/validations/FormValidation";


const buildFormData = (values: BannerFormValues) => {
   const formData = new FormData();

 
  formData.append("title", JSON.stringify(values.title ?? {}));
  formData.append("subtitle", JSON.stringify(values.subtitle ?? {}));

  if ((values as any).description) {
    formData.append("description", JSON.stringify((values as any).description));
  }

  formData.append("priority", (values.priority ?? 0).toString());

  if ((values as any).pageName) {
    formData.append("pageName", (values as any).pageName);
  }

  if (values.image instanceof File) {
    formData.append("image", values.image);
  } else if (typeof values.image === "string" && values.image !== "") {
    formData.append("existingImage", values.image);
  }
  return formData;
};

// ✅ Handle banner create
const handleCreateBanner = (
    values: BannerFormValues,
    createMutation: any,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void,
    onClose: () => void
) => {
    toast.dismiss();
    toast.loading("Creating banner...");
    const formData = buildFormData(values);

    createMutation.mutate(formData, {
        onSuccess: (data: any) => {
            toast.dismiss();
            toast.success(getApiSuccessMessage(data, "Banner created successfully"));
            resetForm();
            setSubmitting(false);
            onClose();
        },
        onError: (err: any) => {
            toast.dismiss();
            toast.error(getApiErrorMessage(err, "Failed to create banner"));
            setSubmitting(false);
        },
    });
};

// ✅ Handle banner update
const handleUpdateBanner = (
    id: string,
    values: BannerFormValues,
    updateMutation: any,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void,
    onClose: () => void
) => {
    toast.dismiss();
    toast.loading("Updating banner...");
    const formData = buildFormData(values);

    updateMutation.mutate(
        { id, values: formData },
        {
            onSuccess: (data: any) => {
                toast.dismiss();
                toast.success(getApiSuccessMessage(data, "Banner updated successfully"));
                resetForm();
                setSubmitting(false);
                onClose();
            },
            onError: (err: any) => {
                toast.dismiss();
                toast.error(getApiErrorMessage(err, "Failed to update banner"));
                setSubmitting(false);
            },
        }
    );
};

// ✅ Unified banner form submit
export const submitBannerForm = (
    values: BannerFormValues,
    initialData: { id?: string } | undefined,
    createMutation: any,
    updateMutation: any,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void,
    onClose: () => void
) => {
    if (initialData?.id) {
        handleUpdateBanner(initialData.id.toString(), values, updateMutation, resetForm, setSubmitting, onClose);
    } else {
        handleCreateBanner(values, createMutation, resetForm, setSubmitting, onClose);
    }
};


// ✅ Fetch banners with pagination, search, and pageName filter
export const useFetchAllBanners = (
  page: number, 
  limit: number = 10, 
  search?: string, 
  searchField?: string,
  pageName?: string
) => {
  return useQuery({
    queryKey: ["banners", pageName, page, limit, search, searchField],
    queryFn: () => fetchAllBanners(page, limit, search, searchField, pageName),
    placeholderData: keepPreviousData,
  });
};



// ✅ Fetch single banner
export const useFetchSingleBanner = (id?: string) => {
    return useQuery({
        queryKey: ["banner", id],
        queryFn: () => fetchBannerById(id!),
        enabled: !!id,
    });
};

// ✅ Delete banner
export const useDeleteBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBanner,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["banners"] });
            toast.dismiss();
            toast.success(getApiSuccessMessage(data, "Banner deleted successfully"));
        },
        onError: (error: any) => {
            toast.error(getApiErrorMessage(error, "Failed to delete banner"));
        },
    });
};
