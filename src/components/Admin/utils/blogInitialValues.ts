import { BlogFormValues } from "@/src/utils/validations/FormValidation";

export const getInitialBlogValues = (initialData: any): BlogFormValues => ({
  title: {
    en: initialData?.title?.en ?? "",
    hi: initialData?.title?.hi ?? "",
  },
  creator: {
    en: initialData?.creator?.en ?? "",
    hi: initialData?.creator?.hi ?? "",
  },
  description: {
    en: initialData?.description?.en ?? "",
    hi: initialData?.description?.hi ?? "",
  },
  summary: {
    en: initialData?.summary?.en ?? "",
    hi: initialData?.summary?.hi ?? "",
  },
  quote: {
    en: initialData?.quote?.en ?? "",
    hi: initialData?.quote?.hi ?? "",
  },
  quoteAuthor: {
    en: initialData?.quoteAuthor?.en ?? "",
    hi: initialData?.quoteAuthor?.hi ?? "",
  },
  tags: {
    en: initialData?.tags?.en ?? [],
    hi: initialData?.tags?.hi ?? [],
  },
  keyPoints: {
    en: initialData?.keyPoints?.en ?? [],
    hi: initialData?.keyPoints?.hi ?? [],
  },
  location: {
    en: initialData?.location?.en ?? "",
    hi: initialData?.location?.hi ?? "",
  },
  category: {
    en: initialData?.category?.en ?? "",
    hi: initialData?.category?.hi ?? "",
  },
  images: initialData?.images ?? [],
  existingImages:initialData?.existingImages ?? [],
});
