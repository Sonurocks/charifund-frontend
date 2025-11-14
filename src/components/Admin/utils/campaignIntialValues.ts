import { CampaignFormValues } from "@/src/utils/validations/FormValidation";
export const getInitialCanpaignValues = (initialData: any): CampaignFormValues =>( {
    title: {
    en: initialData?.title?.en ?? "",
    hi: initialData?.title?.hi ?? "",
  }, 
  category: {
    en: initialData?.category?.en ?? "",
    hi: initialData?.category?.hi ?? "",
  },
  description: {
    en: initialData?.description?.en ?? "",
    hi: initialData?.description?.hi ?? "",
  },
  goalAmount: initialData?.goalAmount ?? '',
  summary: {
    en: initialData?.summary?.en ?? "",
    hi: initialData?.summary?.hi ?? "",
  },
  keyPoints: {
    en: initialData?.keyPoints?.en ?? [],
    hi: initialData?.keyPoints?.hi ?? [],
  },
  images: initialData?.images ?? [],
existingImages: initialData?.existingImages ?? [],
   location: {
    en: initialData?.location?.en ?? "",
    hi: initialData?.location?.hi ?? "",
  },
  });