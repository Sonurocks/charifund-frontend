"use client";

import React from "react";
import { Formik, Form } from "formik";
import { SponsorFormProps } from "@/src/types/admin/sponsor";
import { sponsorSchema, SponsorFormValues } from "@/src/utils/validations/FormValidation";
import CustomInput from "../../UI/admin/CustomInput";
import CustomFileInput from "../../UI/admin/CustomFileInput";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";
import { getInitialSponsorValues } from "../InitialValues/sponsorInitialValues";
import Button from "../../UI/web/Buttons/Button";
import CancelButton from "../../UI/web/Buttons/CancelButton";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { IMAGE_STANDARDS } from "@/src/utils/imageStandards";

const SponsorForm = ({
  initialData,
  onClose,
  mode = "add",
  onPreview,
}: SponsorFormProps) => {
  const isView = mode === "view";
  const { language, toggleLanguage } = useLanguageToggle();

  const initialValues = React.useMemo(() => {
    return getInitialSponsorValues(initialData);
  }, [initialData]);

  const initialLogoUrl = React.useMemo((): string[] => {
    if (!initialData) return [];
    const data = initialData as any;
    const logo = data.logo || data.image;
    if (typeof logo === "string" && logo.trim() !== "") {
      return [logo];
    }
    if (Array.isArray(data.existingImages) && data.existingImages.length > 0) {
      return data.existingImages.filter((x: any): x is string => typeof x === "string" && Boolean(x));
    }
    return [];
  }, [initialData]);

  return (
    <div className="w-full pb-10">
      {/* Bilingual Language Switcher */}
      <LanguageToggle language={language} onChange={toggleLanguage} />

      <Formik<SponsorFormValues>
        key={initialData?.id || "new-sponsor"}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={sponsorSchema}
        onSubmit={(values) => {
          if (onPreview) {
            onPreview(values);
          }
        }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          validateForm,
          submitForm,
          setTouched,
        }) => {
          const lang = language;

          const handlePreviewClick = async () => {
            const touchAllFields = (obj: any): any => {
              if (typeof obj !== "object" || obj === null) return true;
              const touchedObj: any = {};
              for (const key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                const value = obj[key];
                if (typeof value === "object" && value !== null && !(value instanceof File)) {
                  touchedObj[key] = touchAllFields(value);
                } else {
                  touchedObj[key] = true;
                }
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

            if (formErrors.logo) {
              return;
            }

            submitForm();
          };

          const locationError =
            touched.location && typeof touched.location === "object" && (touched.location as any)[lang]
              ? ((errors.location as any)?.[lang] || "")
              : "";

          return (
            <Form className="flex flex-col gap-3.5 mt-2">
              {/* Sponsor Name */}
              <CustomInput
                label={`${lang === "en" ? "Sponsor Name" : "प्रायोजक का नाम"}*`}
                name={`name.${lang}`}
                value={values.name[lang]}
                onChange={handleChange}
                placeholder={lang === "en" ? "e.g. Tata Trusts / Google" : "उदा. टाटा ट्रस्ट्स"}
                error={touched.name?.[lang] ? errors.name?.[lang] : ""}
                disabled={isView}
              />

              {/* Category */}
              <CustomInput
                label={`${lang === "en" ? "Category" : "श्रेणी"}*`}
                name={`category.${lang}`}
                value={values.category[lang]}
                onChange={handleChange}
                placeholder={lang === "en" ? "e.g. Healthcare & Education / Partner" : "उदा. शिक्षा और स्वास्थ्य"}
                error={touched.category?.[lang] ? errors.category?.[lang] : ""}
                disabled={isView}
              />

              {/* Location */}
              <CustomInput
                label={`${lang === "en" ? "Location / Region" : "स्थान / क्षेत्र"}`}
                name={`location.${lang}`}
                value={values.location?.[lang] ?? ""}
                onChange={handleChange}
                placeholder={lang === "en" ? "e.g. India / Global" : "उदा. भारत"}
                error={locationError}
                disabled={isView}
              />

              {/* Website URL */}
              <CustomInput
                label={`${lang === "en" ? "Website URL" : "वेबसाइट लिंक"}`}
                name="website"
                value={values.website ?? ""}
                onChange={handleChange}
                placeholder="https://example.org"
                error={touched.website ? errors.website : ""}
                disabled={isView}
              />

              {/* Short Description */}
              <CustomInput
                label={`${lang === "en" ? "Short Description" : "संक्षिप्त विवरण"}*`}
                name={`shortDescription.${lang}`}
                as="textarea"
                value={values.shortDescription[lang]}
                onChange={handleChange}
                placeholder={lang === "en" ? "Brief 1-2 sentence overview for cards..." : "संक्षिप्त विवरण..."}
                error={touched.shortDescription?.[lang] ? errors.shortDescription?.[lang] : ""}
                disabled={isView}
              />

              {/* Detailed Description */}
              <CustomInput
                label={`${lang === "en" ? "Detailed Description" : "विस्तृत विवरण"}*`}
                name={`description.${lang}`}
                as="textarea"
                value={values.description[lang]}
                onChange={handleChange}
                placeholder={
                  lang === "en"
                    ? "Full partnership background and details..."
                    : "विस्तृत साझेदारी विवरण..."
                }
                error={touched.description?.[lang] ? errors.description?.[lang] : ""}
                disabled={isView}
              />

              {/* Logo Upload */}
              <CustomFileInput
                label={`${lang === "en" ? "Sponsor Logo" : "प्रायोजक लोगो"}*`}
                name="logo"
                mode={mode}
                standard={IMAGE_STANDARDS.sponsor}
                uploadType="single"
                initialUrls={initialLogoUrl}
                error={touched.logo && typeof errors.logo === "string" ? errors.logo : ""}
                onChange={(files, existingUrls) => {
                  if (files.length > 0) {
                    setFieldValue("logo", files[0]);
                  } else if (existingUrls && existingUrls.length > 0) {
                    setFieldValue("logo", existingUrls[0]);
                    setFieldValue("existingImages", existingUrls);
                  } else {
                    setFieldValue("logo", "");
                    setFieldValue("existingImages", []);
                  }
                }}
              />

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 w-fit">
                {!isView && (
                  <Button
                    type="button"
                    onClick={handlePreviewClick}
                    bgColor="bg-lime-green"
                    paddingx="px-4"
                    paddingy="py-2"
                    rounded="rounded-[5px]"
                    text={lang === "en" ? "Preview" : "पूर्वावलोकन"}
                    icon=""
                  />
                )}
                <CancelButton
                  text={lang === "en" ? (isView ? "Close" : "Cancel") : (isView ? "बंद करें" : "रद्द करें")}
                  onClose={onClose}
                  icon=""
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SponsorForm;
