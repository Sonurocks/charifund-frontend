



"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useFetchCategory } from "@/src/hooks/admin/useCategory";
import {
  CampaignFormValues,
  campaignSchema,
} from "@/src/utils/validations/FormValidation";
import { getInitialCanpaignValues } from "../InitialValues/campaignIntialValues";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";
import { CampaignFormProps } from "@/src/types/admin/campaign";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";

//  Dynamic Imports
const { Formik, Form } = require("formik");
const CustomInput = dynamic(() => import("../../UI/admin/CustomInput"), { ssr: false });
const CustomFileInput = dynamic(() => import("../../UI/admin/CustomFileInput"), { ssr: false });
const Dropdown = dynamic(() => import("../../UI/admin/Dropdown"), { ssr: false });
const LanguageToggle = dynamic(() => import("../../UI/admin/LanguageToggle"), { ssr: false });
const MultiInputList = dynamic(() => import("../../UI/admin/MultiInputList"), { ssr: false });
const Button = dynamic(() => import("../../UI/web/Buttons/Button"), { ssr: false });
const CancelButton = dynamic(() => import("../../UI/web/Buttons/CancelButton"), { ssr: false });

const CampaignForm: React.FC<CampaignFormProps> = ({
  initialData,
  onClose,
  mode,
  onPreview,
}) => {
  const initialValues: CampaignFormValues = getInitialCanpaignValues(initialData);
  const { language, toggleLanguage } = useLanguageToggle();
  const [categories, setCategories] = useState<{ en?: any[]; hi?: any[] }>({});
  const { data: categoryData } = useFetchCategory();

  useEffect(() => {
    if (categoryData?.category) {
      setCategories((prev) => ({
        ...prev,
        [language]: categoryData.category,
      }));
    }
  }, [categoryData, language]);

  const mergedCategories =
    categoryData?.category?.map((cat: any) => ({
      label: cat.name[language],
      value: cat._id || cat.name,
      names: cat.name,
    })) || [
      {
        label: "No category available, add category first",
        value: "",
        disabled: true,
      },
    ];

  const isView = mode === "view";

  const handlePreviewClick = async (
    values: CampaignFormValues,
    setTouched: (touched: any) => void,
    validateForm: () => Promise<any>,
    submitForm: () => void,
    toggleLanguage: (lang: "en" | "hi") => void
  ) => {
    const touchAllFields = (obj: any): any => {
      if (typeof obj !== "object" || obj === null) return true;
      const touchedObj: any = {};
      for (const key in obj) {
        touchedObj[key] = typeof obj[key] === "object" ? touchAllFields(obj[key]) : true;
      }
      return touchedObj;
    };

    setTouched(touchAllFields(values));
    const formErrors = await validateForm();

    for (const l of ["en", "hi"] as const) {
      if (hasErrorsForLang(formErrors, l)) {
        toggleLanguage(l);
        return;
      }
    }

    if (formErrors.images) return;
    submitForm();
  };

  return (
    <div className="w-full pb-10">
      <LanguageToggle language={language} onChange={toggleLanguage} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={campaignSchema}
        validateOnChange={true}
        onSubmit={(values: CampaignFormValues) => {
          const payload: CampaignFormValues = {
            ...values,
            keyPoints: {
              en: Array.isArray(values.keyPoints.en)
                ? values.keyPoints.en
                : [],
              hi: Array.isArray(values.keyPoints.hi)
                ? values.keyPoints.hi
                : [],
            },
          };
          onPreview?.(payload as any);
        }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
          validateForm,
          submitForm,
          setTouched,
        }: any) => {
          const lang: "en" | "hi" = language;

          return (
            <Form className="flex flex-col gap-3">
              {/* Title */}
              <CustomInput
                label={`${lang === "en" ? "Title" : "शीर्षक"}*`}
                placeholder={lang === "en" ? "Title of the campaign" : "अभियान का शीर्षक"}
                value={values.title?.[lang] || ""}
                name={`title.${lang}`}
                onChange={handleChange}
                error={touched.title?.[lang] && errors.title?.[lang] ? errors.title[lang] : ""}
                disabled={isView}
              />

              {/* Category */}
              <Dropdown
                label={lang === "en" ? "Category" : "श्रेणी"}
                options={mergedCategories}
                value={values.category?.id || ""}
                onChange={(val: any) => {
                  const selected = mergedCategories.find((opt: any) => opt.value === val);
                  if (selected) {
                    setFieldValue("category", {
                      id: val,
                      en: selected.names.en,
                      hi: selected.names.hi,
                    });
                  }
                }}
                placeholder={lang === "en" ? "Select category" : "श्रेणी चुनें"}
                width="w-full"
                error={
                  (touched.category?.en && errors.category?.en) ||
                    (touched.category?.hi && errors.category?.hi)
                    ? errors.category?.en || errors.category?.hi
                    : ""
                }


              />

              {/* Location */}
              <CustomInput
                label={`${lang === "en" ? "Location" : "स्थान"}*`}
                placeholder={lang === "en" ? "Location of the campaign" : "अभियान का स्थान"}
                value={values.location?.[lang] || ""}
                name={`location.${lang}`}
                onChange={handleChange}
                error={touched.location?.[lang] && errors.location?.[lang] ? errors.location[lang] : ""}
                disabled={isView}
              />

              {/* Goal Amount */}
              <CustomInput
                label={`${lang === "en" ? "Goal Amount" : "लक्ष्य राशि"}*`}
                type="number"
                placeholder={lang === "en" ? "Enter goal amount" : "लक्ष्य राशि दर्ज करें"}
                value={values.goalAmount || ""}
                name="goalAmount"
                onChange={handleChange}
                error={touched.goalAmount ? errors.goalAmount : ""}
                disabled={isView}
              />

              {/* Description */}
              <CustomInput
                label={`${lang === "en" ? "Description" : "विवरण"}*`}
                as="textarea"
                placeholder={lang === "en" ? "Campaign description" : "अभियान का विवरण"}
                value={values.description?.[lang] || ""}
                name={`description.${lang}`}
                onChange={handleChange}
                error={touched.description?.[lang] && errors.description?.[lang] ? errors.description[lang] : ""}
                disabled={isView}
              />

              {/* Summary */}
              <CustomInput
                label={`${lang === "en" ? "Summary" : "सारांश"}*`}
                as="textarea"
                placeholder={lang === "en" ? "Short summary" : "संक्षिप्त सारांश"}
                value={values.summary?.[lang] || ""}
                name={`summary.${lang}`}
                onChange={handleChange}
                error={touched.summary?.[lang] && errors.summary?.[lang] ? errors.summary[lang] : ""}
                disabled={isView}
              />

              {/* Key Points */}
              <MultiInputList
                label={lang === "en" ? "Key Points" : "मुख्य बिंदु"}
                values={values.keyPoints?.[lang] || []}
                onChange={(newPoints: string[]) =>
                  setFieldValue(`keyPoints.${lang}`, newPoints)
                }
                placeholder={lang === "en" ? "Add a key point" : "मुख्य बिंदु जोड़ें"}
                isView={isView}
                error={
                  touched.keyPoints?.[lang] && errors.keyPoints?.[lang]
                    ? errors.keyPoints[lang]
                    : ""
                }

              />

              {/* Images */}
              <CustomFileInput
                label={lang === "en" ? "Campaign Images" : "अभियान की छवियाँ"}
                name="images"
                error={
                  (errors as any)?.images ||
                  (errors as any)?.existingImages ||
                  (errors as any)?._combinedImagesGuard
                }
                initialUrls={Array.isArray(values.existingImages) ? values.existingImages : []}
                onChange={(files: File[], existingUrls?: string[]) => {
                  setFieldValue("images", files);
                  setFieldValue("existingImages", existingUrls || []);
                }}
                uploadType="multiple"
                disabled={isView}
                mode={mode}
                initialFiles={
                  Array.isArray(values.images)
                    ? values.images.filter((f: any) => f instanceof File)
                    : []
                }
              />

              {/* Buttons */}
              {!isView && (
                <div className="flex gap-2 mt-4 w-fit">
                  <Button
                    type="button"
                    onClick={() =>
                      handlePreviewClick(values, setTouched, validateForm, submitForm, toggleLanguage)
                    }
                    disabled={isSubmitting}
                    bgColor="bg-lime-green"
                    paddingx="px-4"
                    paddingy="py-2"
                    rounded="rounded-[5px]"
                    text={lang === "en" ? "Preview" : "पूर्वावलोकन"}
                  />
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

export default CampaignForm;


