



"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Formik,
  Form,
  FormikHelpers,
  FormikErrors,
} from "formik";
import {
  BannerFormValues,
  bannerSchema,
} from "@/src/utils/validations/FormValidation";
import { BannerFormProps } from "@/src/types/admin/banner";
import { submitBannerForm } from "@/src/hooks/admin/useBanner";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";
import { IMAGE_STANDARDS } from "@/src/utils/imageStandards";

//  Dynamic Imports
const CustomInput = dynamic(() => import("../../UI/admin/CustomInput"), { ssr: false });
const CustomFileInput = dynamic(() => import("../../UI/admin/CustomFileInput"), { ssr: false });
const LanguageToggle = dynamic(() => import("../../UI/admin/LanguageToggle"), { ssr: false });
const CancelButton = dynamic(() => import("../../UI/web/Buttons/CancelButton"), { ssr: false });
const ButtonLoader = dynamic(() => import("../../UI/web/Loader/ButtonLoader"), { ssr: false });
const Button = dynamic(() => import("../../UI/web/Buttons/Button"), { ssr: false });

const BannerForm: React.FC<BannerFormProps> = ({
  initialData,
  onClose,
  mode,
  createMutation,
  updateMutation,
  onPreview,
}) => {
  const { language, toggleLanguage } = useLanguageToggle();
  const isView = mode === "view";

  //Typed initial values
  const initialValues: BannerFormValues & { existingImage?: string } = {
    title: {
      en: initialData?.title?.en ?? "",
      hi: initialData?.title?.hi ?? "",
    },
    subtitle: {
      en: initialData?.subtitle?.en ?? "",
      hi: initialData?.subtitle?.hi ?? "",
    },
    description: {
      en: (initialData as any)?.description?.en ?? "",
      hi: (initialData as any)?.description?.hi ?? "",
    },
    image: initialData?.image || "",
    existingImage:
      typeof initialData?.image === "string" ? initialData.image : undefined,
    priority: initialData?.priority ?? 0,
    pageName: (initialData as any)?.pageName ?? "",
  };

  // Typed handleSubmit
  const handleSubmit = (
    values: BannerFormValues,
    formikHelpers: FormikHelpers<BannerFormValues>
  ) => {
    const { setSubmitting, resetForm } = formikHelpers;
    submitBannerForm(
      values,
      initialData,
      createMutation,
      updateMutation,
      resetForm,
      setSubmitting,
      onClose
    );
  };

  return (
    <div className="w-full pb-10">
      <LanguageToggle language={language} onChange={toggleLanguage} />

      <Formik<BannerFormValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={bannerSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          setTouched,
          errors,
          touched,
          isSubmitting,
          validateForm,
          submitForm,
        }) => {
          const lang: "en" | "hi" = language;

          //  Safely typed recursive touch function
          const touchAllFields = (obj: any): any => {
            if (typeof obj !== "object" || obj === null) return true;
            const touchedObj: Record<string, any> = {};
            for (const key in obj) {
              if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
              const value = obj[key];
              touchedObj[key] =
                typeof value === "object" && value !== null
                  ? touchAllFields(value)
                  : true;
            }
            return touchedObj;
          };

          const handlePreviewClick = async () => {
            setTouched(touchAllFields(values));
            const formErrors: FormikErrors<BannerFormValues> = await validateForm();

            for (const l of ["en", "hi"] as const) {
              if (hasErrorsForLang(formErrors, l)) {
                toggleLanguage(l);
                return;
              }
            }

            if (formErrors.image) return;
            submitForm();
          };

          return (
            <Form className="flex flex-col gap-3">
              {/* Title */}
              <CustomInput
                label={`${lang === "en" ? "Title" : "शीर्षक"}*`}
                placeholder={
                  lang === "en"
                    ? "Enter banner title"
                    : "बैनर शीर्षक दर्ज करें"
                }
                name={`title.${lang}`}
                value={values.title?.[lang]}
                onChange={handleChange}
                error={
                  (touched.title as any)?.[lang]
                    ? (errors.title as any)?.[lang]
                    : ""
                }
              />

              {/* Subtitle */}
              <CustomInput
                label={`${lang === "en" ? "Subtitle" : "उपशीर्षक"}*`}
                placeholder={
                  lang === "en"
                    ? "Enter banner subtitle"
                    : "बैनर उपशीर्षक दर्ज करें"
                }
                name={`subtitle.${lang}`}
                value={values.subtitle?.[lang]}
                onChange={handleChange}
                error={
                  (touched.subtitle as any)?.[lang]
                    ? (errors.subtitle as any)?.[lang]
                    : ""
                }
              />

              {/* Description (optional) */}
              <CustomInput
                label={`${lang === "en" ? "Description (optional)" : "विवरण (वैकल्पिक)"}`}
                as="textarea"
                placeholder={
                  lang === "en"
                    ? "Enter banner description (max 60 words)"
                    : "बैनर विवरण दर्ज करें (अधिकतम 60 शब्द)"
                }
                name={`description.${lang}`}
                value={(values as any).description?.[lang] || ""}
                onChange={handleChange}
                error={
                  (touched as any)?.description?.[lang]
                    ? (errors as any)?.description?.[lang]
                    : ""
                }
              />

              {/* Page Name */}
              <div className="w-full">
                <label htmlFor="pageName" className="block mb-1 font-medium text-blue-50 text-[14px]">
                  {lang === "en" ? "Page Name" : "पृष्ठ का नाम"}
                </label>
                <select
                  id="pageName"
                  name="pageName"
                  value={values.pageName || ""}
                  onChange={handleChange}
                  className="w-full bg-gray-200/60 px-3 py-2 rounded-md border border-transparent outline-none text-[13px] text-foreground/70"
                >
                  <option value="">{lang === "en" ? "Select Page (Default: General / Home)" : "पृष्ठ चुनें"}</option>
                  <option value="Home">Home</option>
                  <option value="About Us">About Us</option>
                  <option value="Services">Services</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Donate Us">Donate Us</option>
                  <option value="Blog">Blog</option>
                  <option value="Contact Us">Contact Us</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Events">Events</option>
                  <option value="Team">Team</option>
                  <option value="Sponsors">Sponsors</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </div>

              {/* Priority */}
              <CustomInput
                label={`${lang === "en" ? "Priority" : "प्राथमिकता"}*`}
                placeholder={
                  lang === "en"
                    ? "Enter banner priority"
                    : "बैनर प्राथमिकता दर्ज करें"
                }
                name="priority"
                value={values.priority}
                onChange={handleChange}
                error={touched.priority ? errors.priority : ""}
              />

              {/* Image Upload */}
              <CustomFileInput
                label={`${lang === "en" ? "Image" : "छवि"}*`}
                name="image"
                mode={mode}
                standard={IMAGE_STANDARDS.banner}
                initialUrls={
                  initialData?.image
                    ? Array.isArray(initialData.image)
                      ? initialData.image.map((img) =>
                          typeof img === "string"
                            ? img
                            : URL.createObjectURL(img)
                        )
                      : [
                          typeof initialData.image === "string"
                            ? initialData.image
                            : URL.createObjectURL(initialData.image),
                        ]
                    : []
                }
                error={
                  touched.image && typeof errors.image === "string"
                    ? errors.image
                    : ""
                }
                onChange={(files, existingUrls) => {
                  if (files.length > 0) {
                    setFieldValue("image", files[0]);
                  } else if (existingUrls?.length) {
                    setFieldValue("image", existingUrls[0]);
                  } else {
                    setFieldValue("image", "");
                  }
                }}
              />

              {/* Action Buttons */}
              {!isView && (
                <div className="flex gap-2 mt-4 w-fit">
                  <Button
                    type="button"
                    onClick={handlePreviewClick}
                    disabled={
                      isSubmitting ||
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
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

export default BannerForm;

