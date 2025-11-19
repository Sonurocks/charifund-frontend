// src/hooks/useEvents.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { EventFormValues } from "@/src/utils/validations/FormValidation";
import { deleteSingleEvent, fetchAllEvent, fetchEventById } from "@/src/services/admin/eventApi";
import { EventFormProps } from "@/src/types/admin/event";
import { mergeDateTime } from "@/src/helper/mergeDateTime";

const buildFormData = (values: EventFormValues) => {
  const formData = new FormData();

  const appendNestedObject = (key: string, obj: any) => {
    formData.append(key, JSON.stringify(obj));
  };

  appendNestedObject("title", values.title);
  appendNestedObject("description", values.description);
  appendNestedObject("summary", values.summary);
  appendNestedObject("location", values.location);

  if (values.keyPoints) appendNestedObject("keyPoints", values.keyPoints);

  // Existing images URLs
  values.existingImages?.forEach((url) => {
    if (url) formData.append("existingImages[]", url);
  });

  // New image files
  values.images?.forEach((file) => {
    if (file instanceof File) formData.append("images", file);
  });

  const start = mergeDateTime(values.startDateTime
, values.startTime);
const end = mergeDateTime(values.endDateTime, values.endTime);

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
    onSuccess: () => {
      toast.dismiss();
      toast.success("Event created successfully");
      resetForm();
      setSubmitting(false);
      onClose();
    },
    onError: (err: any) => {
      toast.dismiss();
      toast.error(err?.response?.data?.message || "Failed to create event");
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
      onSuccess: () => {
        toast.dismiss();
        toast.success("Event updated successfully");
        resetForm();
        setSubmitting(false);
        onClose();
      },
      onError: (err: any) => {
        toast.dismiss();
        toast.error(err?.response?.data?.message || "Failed to update event");
        setSubmitting(false);
      },
    }
  );
};

// ✅ Unified event form submit
export const submitEventForm = (
  values: EventFormValues,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.dismiss();
      toast.success("Event deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete event");
    },
  });
};
