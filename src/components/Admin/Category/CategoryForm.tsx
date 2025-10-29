










"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Formik, Form } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  CategoryFormValues,
  categorySchema,
} from "@/src/utils/validations/FormValidation";
import { getInitialCategoryValues } from "../utils/categoryInitialValues";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";
import { createCategory, updateCategory } from "@/src/services/admin/categoryApi";
import { CategoryFormProps } from "@/src/types/admin/campaign";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";

//  Dynamic Imports (for performance)
const CustomInput = dynamic(() => import("../../UI/admin/CustomInput"), {
  ssr: false,
});
const LanguageToggle = dynamic(() => import("../../UI/admin/LanguageToggle"), {
  ssr: false,
});
const Button = dynamic(() => import("../../UI/web/Buttons/Button"), {
  ssr: false,
});
const CancelButton = dynamic(() => import("../../UI/web/Buttons/CancelButton"), {
  ssr: false,
});
const ButtonLoader = dynamic(() => import("../../UI/web/Loader/ButtonLoader"), {
  ssr: false,
});

const CategoryForm = ({ initialData, onClose, mode }: CategoryFormProps) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const { language, toggleLanguage } = useLanguageToggle();
  const queryClient = useQueryClient();

  //  Mutations
  const createMutation = useMutation({
    mutationFn: (values: CategoryFormValues) => createCategory(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CategoryFormValues }) =>
      updateCategory(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const initialValues = getInitialCategoryValues(initialData);

  const handleSubmit = (
    values: CategoryFormValues,
    resetForm: () => void,
    setSubmitting: (v: boolean) => void
  ) => {
    toast.dismiss();
    toast.loading(isEdit ? "Updating category..." : "Creating category...");

    const mutationFn = isEdit && initialData?.id
      ? updateMutation.mutateAsync({ id: initialData.id, values })
      : createMutation.mutateAsync(values);

    mutationFn
      .then(() => {
        toast.dismiss();
        toast.success(isEdit ? "Category updated" : "Category created");
        resetForm();
        setSubmitting(false);
        onClose();
      })
      .catch((err: any) => {
        toast.dismiss();
        toast.error(err?.message || "Failed to process category");
        setSubmitting(false);
      });
  };

  return (
    <div className="w-full pb-6">
      {/* Language Toggle */}
      <LanguageToggle language={language} onChange={toggleLanguage} />

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={categorySchema}
        onSubmit={(values, { resetForm, setSubmitting }) =>
          handleSubmit(values, resetForm, setSubmitting)
        }
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
          validateForm,
          submitForm,
          setTouched,
        }) => {
          const lang = language;

          const handleSubmitClick = async () => {
            // Mark all fields as touched
            const markAllTouched = (obj: any): any =>
              typeof obj === "object" && obj !== null
                ? Object.keys(obj).reduce((acc, key) => {
                    acc[key] = markAllTouched(obj[key]);
                    return acc;
                  }, {} as any)
                : true;

            setTouched(markAllTouched(values));

            const formErrors = await validateForm();
            for (const l of ["en", "hi"] as const) {
              if (hasErrorsForLang(formErrors, l)) {
                toggleLanguage(l);
                return;
              }
            }

            submitForm();
          };

          return (
            <Form className="flex flex-col gap-3">
              <CustomInput
                label={
                  lang === "en"
                    ? "Category Name*"
                    : "श्रेणी का नाम*"
                }
                placeholder={
                  lang === "en"
                    ? "Enter category name"
                    : "श्रेणी का नाम दर्ज करें"
                }
                value={values.name[lang]}
                name={`name.${lang}`}
                onChange={(e) =>
                  setFieldValue(`name.${lang}`, e.target.value)
                }
                error={touched.name?.[lang] ? errors.name?.[lang] : ""}
                disabled={isView}
              />

              {!isView && (
                <div className="flex gap-2 mt-2 w-fit">
                  <Button
                    type="button"
                    onClick={handleSubmitClick}
                    disabled={
                      isSubmitting ||
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
                    bgColor="bg-lime-green"
                    paddingx="px-4"
                    paddingy="py-2"
                    rounded="rounded-[5px]"
                  >
                    {isSubmitting ||
                    createMutation.isPending ||
                    updateMutation.isPending ? (
                      <ButtonLoader />
                    ) : isEdit ? (
                      <>{lang === "hi" ? "अद्यतन" : "Update"}</>
                    ) : (
                      <>{lang === "hi" ? "बनाएं" : "Create"}</>
                    )}
                  </Button>
                  <CancelButton
                    text={lang === "hi" ? "रद्द करें" : "Cancel"}
                    onClose={onClose}
                  />
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CategoryForm;
