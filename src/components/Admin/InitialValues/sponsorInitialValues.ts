import { SponsorFormValues } from "@/src/utils/validations/FormValidation";

export const getInitialSponsorValues = (rawInitialData: any): SponsorFormValues => {
  const initialData = rawInitialData?.sponsor || rawInitialData?.data || rawInitialData;

  const getNestedValue = (obj: any, path: string, fallback: any = "") => {
    if (!obj) return fallback;
    const keys = path.split(".");
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }
    return current ?? fallback;
  };

  const getValue = (path: string, fallback: any = "") => {
    const value = getNestedValue(initialData, path, null);
    if (value !== null && value !== undefined) return value;

    const directPath = path.split(".")[0];
    if (initialData && initialData[directPath] !== undefined) {
      return initialData[directPath];
    }

    return fallback;
  };

  const initialLogo = initialData?.logo || initialData?.image || "";
  const existingImages = typeof initialLogo === "string" && initialLogo
    ? [initialLogo]
    : Array.isArray(initialData?.existingImages)
    ? initialData.existingImages
    : [];

  return {
    name: {
      en: getValue("name.en", typeof initialData?.name === "string" ? initialData.name : ""),
      hi: getValue("name.hi", ""),
    },
    category: {
      en: getValue("category.en", typeof initialData?.category === "string" ? initialData.category : ""),
      hi: getValue("category.hi", ""),
    },
    location: {
      en: getValue("location.en", typeof initialData?.location === "string" ? initialData.location : ""),
      hi: getValue("location.hi", ""),
    },
    shortDescription: {
      en: getValue(
        "shortDescription.en",
        typeof initialData?.shortDescription === "string" ? initialData.shortDescription : ""
      ),
      hi: getValue("shortDescription.hi", ""),
    },
    description: {
      en: getValue("description.en", typeof initialData?.description === "string" ? initialData.description : ""),
      hi: getValue("description.hi", ""),
    },
    website: initialData?.website || "",
    logo: initialLogo,
    existingImages,
  };
};
