// src/hooks/useBanners.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBanner, fetchAllBanners, fetchBannerById } from "@/src/services/admin/bannerApi";
import { BannerFormValues } from "@/src/utils/validations/FormValidation";


const buildFormData = (values: BannerFormValues) => {
   const formData = new FormData();

 
  formData.append("title", JSON.stringify(values.title ?? {}));
  formData.append("subtitle", JSON.stringify(values.subtitle ?? {}));

  formData.append("priority", (values.priority ?? 0).toString());

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
        onSuccess: () => {
            toast.dismiss();
            toast.success("Banner created successfully");
            resetForm();
            setSubmitting(false);
            onClose();
        },
        onError: (err: any) => {
            toast.dismiss();
            toast.error(err?.response?.data?.message || "Failed to create banner");
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
            onSuccess: () => {
                toast.dismiss();
                toast.success("Banner updated successfully");
                resetForm();
                setSubmitting(false);
                onClose();
            },
            onError: (err: any) => {
                toast.dismiss();
                toast.error(err?.response?.data?.message|| "Failed to update banner");
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


// ✅ Fetch banners with pagination and optional search
export const useFetchAllBanners = (
  page: number, 
  limit: number = 10, 
  search?: string, 
  searchField?: string
) => {
  return useQuery({
    queryKey: ["banners", page, limit, search, searchField],
    queryFn: () => fetchAllBanners(page, limit, search, searchField),
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["banners"] });
            toast.dismiss();
            toast.success("Banner deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete banner");
        },
    });
};
