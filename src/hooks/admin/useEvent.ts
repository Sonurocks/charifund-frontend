import { getApiErrorMessage, getApiSuccessMessage } from "@/src/utils/apiHelpers";
// src/hooks/useEvents.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { EventFormValues } from "@/src/utils/validations/FormValidation";
import { deleteSingleEvent, fetchAllEvent, fetchEventById } from "@/src/services/admin/eventApi";
import { EventFormProps } from "@/src/types/admin/event";
import { mergeDateTime } from "@/src/helper/mergeDateTime";

const buildFormData = (values: EventFormValues & { existingImages?: string[] }) => {
  const formData = new FormData();

  const appendNestedObject = (key: string, obj: any) => {
    formData.append(key, JSON.stringify(obj));
  };

  appendNestedObject("title", values.title);
  appendNestedObject("description", values.description);
  appendNestedObject("summary", values.summary);
  appendNestedObject("location", values.location);

  if (values.keyPoints) appendNestedObject("keyPoints", values.keyPoints);

  // 1️⃣ Ensure URLs in values.images are added to existingImages
  const urlsFromImages: string[] = [];
  const filesFromImages: File[] = [];

  values.images?.forEach((img) => {
    if (typeof img === "string") {
      urlsFromImages.push(img);
    } else if (img instanceof File) {
      filesFromImages.push(img);
    }
  });

  // Combine with already existing URLs
  const allExistingImages = [...(values.existingImages || []), ...urlsFromImages];

  // Append existing images URLs
  allExistingImages.forEach((url) => {
    if (url) formData.append("existingImages[]", url);
  });

  // Append new image files
  filesFromImages.forEach((file) => {
    formData.append("images", file);
  });

  const start = mergeDateTime(values.startDate, values.startTime);
  const end = mergeDateTime(values.endDate, values.endTime);

  if (start) formData.append("startTime", start.toISOString());
  if (end) formData.append("endTime", end.toISOString());

  if (values.latitude) formData.append("latitude", values.latitude.toString());
  if (values.longitude) formData.append("longitude", values.longitude.toString());

  return formData;
};


// ✅ Handle event create
const handleCreateEvent = (
  values: EventFormValues,
  createMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Creating event...");
  const formData = buildFormData(values);

  createMutation.mutate(formData, {
    onSuccess: (data: any) => {
      toast.dismiss();
      toast.success(getApiSuccessMessage(data, "Event created successfully"));
      resetForm();
      setSubmitting(false);
      onClose();
    },
    onError: (err: any) => {
      toast.dismiss();
      toast.error(getApiErrorMessage(err, "Failed to create event"));
      setSubmitting(false);
    },
  });
};

// ✅ Handle event update
const handleUpdateEvent = (
  id: string,
  values: EventFormValues,
  updateMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  toast.dismiss();
  toast.loading("Updating event...");
  const formData = buildFormData(values);

  updateMutation.mutate(
    { id, values: formData },
    {
      onSuccess: (data: any) => {
        toast.dismiss();
        toast.success(getApiSuccessMessage(data, "Event updated successfully"));
        resetForm();
        setSubmitting(false);
        onClose();
      },
      onError: (err: any) => {
        toast.dismiss();
        toast.error(getApiErrorMessage(err, "Failed to update event"));
        setSubmitting(false);
      },
    }
  );
};

// ✅ Unified event form submit
export const submitEventForm = (
  values: EventFormValues & { existingImages?: string[] },
  initialData: EventFormProps["initialData"],
  createMutation: any,
  updateMutation: any,
  resetForm: () => void,
  setSubmitting: (isSubmitting: boolean) => void,
  onClose: () => void
) => {
  if (initialData?.id) {
    handleUpdateEvent(initialData.id.toString(), values, updateMutation, resetForm, setSubmitting, onClose);
  } else {
    handleCreateEvent(values, createMutation, resetForm, setSubmitting, onClose);
  }
};

// ✅ Fetch all events with pagination
export const useFetchAllEvent = (page: number, limit: number = 10, search?: string, searchField?: string) => {
  return useQuery({
    queryKey: ["events", page, limit, search, searchField],
    queryFn: () => fetchAllEvent(page, limit, search, searchField),
    placeholderData: keepPreviousData,
  });
};

// ✅ Fetch single event
export const useFetchSingleEvent = (id?: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  });
};

// ✅ Delete single event
export const useDeleteSingleEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSingleEvent,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.dismiss();
      toast.success(getApiSuccessMessage(data, "Event deleted successfully"));
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to delete event"));
    },
  });
};
