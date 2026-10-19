import { EventFormValues } from "@/src/utils/validations/FormValidation";
export const getInitialEventValues = (initialData: any): EventFormValues =>( {
    title: {
    en: initialData?.title?.en ?? "",
    hi: initialData?.title?.hi ?? "",
  }, 
  description: {
    en: initialData?.description?.en ?? "",
    hi: initialData?.description?.hi ?? "",
  },
 startDate: (initialData?.startDate
    ? new Date(initialData.startDate)
    : initialData?.startTime
    ? new Date(initialData.startTime)
    : null) as any,
  endDate: (initialData?.endDate
    ? new Date(initialData.endDate)
    : initialData?.endTime
    ? new Date(initialData.endTime)
    : null) as any,
  startTime: (initialData?.startTime
    ? new Date(initialData.startTime)
    : null) as any,
  endTime: (initialData?.endTime ? new Date(initialData.endTime) : null) as any,
  summary: {
    en: initialData?.summary?.en ?? "",
    hi: initialData?.summary?.hi ?? "",
  },
  keyPoints: {
    en: initialData?.keyPoints?.en ?? [],
    hi: initialData?.keyPoints?.hi ?? [],
  },
  images: initialData?.images ?? [],
  existingImages: Array.isArray(initialData?.existingImages)
    ? initialData.existingImages
    : Array.isArray(initialData?.images)
      ? initialData.images.filter((img: any) => typeof img === "string")
      : [],

   location: {
    en: initialData?.location?.en ?? "",
    hi: initialData?.location?.hi ?? "",
  },
  latitude: initialData?.latitude ?? null,
  longitude: initialData?.longitude ?? null,
  });