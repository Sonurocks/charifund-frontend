/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryFormValues } from "@/src/utils/validations/FormValidation";

export const getInitialCategoryValues = (initialData: any): CategoryFormValues => ({
  name: {
    en: initialData?.name?.en ?? "",
    hi: initialData?.name?.hi ?? "",
  },
});
