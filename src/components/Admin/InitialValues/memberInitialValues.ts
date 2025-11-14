import { MemberFormValues } from "@/src/utils/validations/FormValidation";

export const getInitialMemberValues = (initialData: any): MemberFormValues => {
  
  // Helper function to safely get nested values
  const getNestedValue = (obj: any, path: string, fallback: any = "") => {
    if (!obj) return fallback;
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }
    return current ?? fallback;
  };

  // Helper function to ensure array format
  const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) return [value];
    return [];
  };

  // Handle different possible data structures
  const getValue = (path: string, fallback: any = "") => {
    // Try direct path first
    let value = getNestedValue(initialData, path, null);
    if (value !== null) return value;
    
    // Try without nested structure (flat object)
    const directPath = path.split('.')[0];
    if (initialData && initialData[directPath]) {
      return initialData[directPath];
    }
    
    return fallback;
  };

  const result = {
    name: {
      en: getValue('name.en', initialData?.name?.en || initialData?.name || ""),
      hi: getValue('name.hi', initialData?.name?.hi || ""),
    },
    position: {
      en: getValue('position.en', initialData?.position?.en || initialData?.position || ""),
      hi: getValue('position.hi', initialData?.position?.hi || ""),
    },
    title: {
      en: getValue('title.en', initialData?.title?.en || initialData?.title || ""),
      hi: getValue('title.hi', initialData?.title?.hi || ""),
    },
    description: {
      en: getValue('description.en', initialData?.description?.en || initialData?.description || ""),
      hi: getValue('description.hi', initialData?.description?.hi || ""),
    },
    about: {
      en: getValue('about.en', initialData?.about?.en || initialData?.about || ""),
      hi: getValue('about.hi', initialData?.about?.hi || ""),
    },
    keyPoints: {
      en: ensureArray(getValue('keyPoints.en', initialData?.keyPoints?.en || [])),
      hi: ensureArray(getValue('keyPoints.hi', initialData?.keyPoints?.hi || [])),
    },
    image: initialData?.image ?? initialData?.img ?? "",
    existingImages: Array.isArray(initialData?.existingImages) ? initialData.existingImages : [],
    facebookUrl: initialData?.facebookUrl ?? "",
    twitterUrl: initialData?.twitterUrl ?? "",
    instagramUrl: initialData?.instagramUrl ?? "",
    linkedInUrl: initialData?.linkedInUrl ?? "",
  };

  return result;
};
