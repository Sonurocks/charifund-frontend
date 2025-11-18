


"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Formik, Form } from "formik";
import { useFetchCategory } from "@/src/hooks/admin/useCategory";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { blogSchema } from "@/src/utils/validations/FormValidation";
import { BlogFormProps } from "@/src/types/admin/blog";
import { Category } from "@/src/types/admin/category";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";
import { getInitialBlogValues } from "../InitialValues/blogInitialValues";

const CustomInput = dynamic(() => import("../../UI/admin/CustomInput"), {
  loading: () => <p>Loading input...</p>,
});
const CustomFileInput = dynamic(() => import("../../UI/admin/CustomFileInput"), {
  loading: () => <p>Loading file input...</p>,
});
const Dropdown = dynamic(() => import("../../UI/admin/Dropdown"), {
  loading: () => <p>Loading dropdown...</p>,
});
const MultiInputList = dynamic(() => import("../../UI/admin/MultiInputList"), {
  loading: () => <p>Loading list...</p>,
});
const LanguageToggle = dynamic(() => import("../../UI/admin/LanguageToggle"), {
  loading: () => <p>Loading language toggle...</p>,
});
const CancelButton = dynamic(() => import("../../UI/web/Buttons/CancelButton"), {
  loading: () => <p>Loading cancel button...</p>,
});
const Button = dynamic(() => import("../../UI/web/Buttons/Button"), {
  loading: () => <p>Loading button...</p>,
});
const ButtonLoader = dynamic(() => import("../../UI/web/Loader/ButtonLoader"), {
  loading: () => <p>Loading loader...</p>,
});

const BlogForm = ({
  initialData,
  onClose,
  mode,
  onPreview,
  createMutation,
  updateMutation,
}: BlogFormProps) => {
  const initialValues = getInitialBlogValues(initialData);
  const { language, toggleLanguage } = useLanguageToggle();
  const { data: categoryData } = useFetchCategory();

  const categoryOptions =
    categoryData?.category && categoryData.category.length > 0
      ? categoryData.category.map((category: Category) => ({
        label: category.name?.[language] || category.name.en,
        value: category.name?.[language] || category.name.en,
        names: category.name,
      }))
      : [
        {
          label: "No category available, add category first",
          value: "",
          disabled: true,
        },
      ];


  const isView = mode === "view";
  const isEdit = mode === "edit";

  return (
    <div className="w-full pb-10">
      <LanguageToggle language={language} onChange={toggleLanguage} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={blogSchema}
        onSubmit={(values) => {
          const payload = {
            creator: values.creator,
            title: values.title,
            description: values.description,
            summary: values.summary,
            quote: values.quote,
            quoteAuthor: values.quoteAuthor,
            tags: values.tags,
            keyPoints: values.keyPoints,
            location: values.location,
            category: values.category,
            images: values.images,
            existingImages: values.existingImages,
          };
          onPreview?.(payload);
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
        }) => {
          const lang = language;

          const handlePreviewClick = async () => {
            const touchAllFields = (obj: any): any => {
              if (typeof obj !== "object" || obj === null) return true;
              const touchedObj: any = {};
              for (const key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                const value = obj[key];
                touchedObj[key] =
                  typeof value === "object" && value !== null
                    ? touchAllFields(value)
                    : true;
              }
              return touchedObj;
            };

            const touchedFields = touchAllFields(values);
            touchedFields._combinedImagesGuard = true;
            setTouched(touchedFields);

            const formErrors = await validateForm();

            if (language === "en") {
              if (hasErrorsForLang(formErrors, "en")) {
                return;
              }

              if (formErrors._combinedImagesGuard) {
                return;
              }

              toggleLanguage("hi");
              return;
            }

            if (language === "hi") {
              for (const l of ["en", "hi"] as const) {
                if (hasErrorsForLang(formErrors, l)) {
                  toggleLanguage(l);
                  return;
                }
              }

              if (formErrors._combinedImagesGuard) {
                return;
              }
              submitForm();
            }
          };

          return (
            <Form className="flex flex-col gap-3">
              {/* Creator */}
              <CustomInput
                label={`${lang === "en" ? "Creator" : "रचयिता"}*`}
                placeholder={lang === "en" ? "Creator name" : "रचयिता का नाम"}
                value={values.creator[lang]}
                name={`creator.${lang}`}
                onChange={handleChange}
                error={touched.creator?.[lang] ? errors.creator?.[lang] : ""}
                disabled={isView}
              />

              {/* Title */}
              <CustomInput
                label={`${lang === "en" ? "Title" : "शीर्षक"}*`}
                placeholder={lang === "en" ? "Blog title" : "ब्लॉग शीर्षक"}
                value={values.title[lang]}
                name={`title.${lang}`}
                onChange={handleChange}
                error={touched.title?.[lang] ? errors.title?.[lang] : ""}
                disabled={isView}
              />

              {/* Description */}
              <CustomInput
                label={`${lang === "en" ? "Description" : "विवरण"}*`}
                as="textarea"
                placeholder={lang === "en" ? "Detailed description" : "ब्लॉग का विवरण"}
                value={values.description[lang]}
                name={`description.${lang}`}
                onChange={handleChange}
                error={touched.description?.[lang] ? errors.description?.[lang] : ""}
                disabled={isView}
              />

              {/* Summary */}
              <CustomInput
                label={`${lang === "en" ? "Summary" : "सारांश"}*`}
                as="textarea"
                placeholder={lang === "en" ? "Short summary" : "सारांश"}
                value={values.summary[lang]}
                name={`summary.${lang}`}
                onChange={handleChange}
                error={touched.summary?.[lang] ? errors.summary?.[lang] : ""}
                disabled={isView}
              />

              {/* Quote */}
              <CustomInput
                label={`${lang === "en" ? "Quote" : "उद्धरण"}*`}
                placeholder={lang === "en" ? "Inspiring quote" : "प्रेरणादायक उद्धरण"}
                value={values.quote[lang]}
                name={`quote.${lang}`}
                onChange={handleChange}
                error={touched.quote?.[lang] ? errors.quote?.[lang] : ""}
                disabled={isView}
              />

              {/* Quote Author */}
              <CustomInput
                label={`${lang === "en" ? "Quote Author" : "उद्धरण के लेखक"}*`}
                placeholder={lang === "en" ? "Author of the quote" : "उद्धरण के लेखक"}
                value={values.quoteAuthor[lang]}
                name={`quoteAuthor.${lang}`}
                onChange={handleChange}
                error={touched.quoteAuthor?.[lang] ? errors.quoteAuthor?.[lang] : ""}
                disabled={isView}
              />

              {/* Category */}
              <Dropdown
                label={`${lang === "en" ? "Category" : "श्रेणी"}*`}
                options={categoryOptions}
                value={values.category?.[lang] || ""}
                onChange={(val) => {
                  const selected = categoryOptions.find((opt: any) => opt.value === val);
                  if (selected) {
                    setFieldValue("category", {
                      en: selected.names.en,
                      hi: selected.names.hi,
                    });
                  }
                }}
                placeholder={lang === "en" ? "Select category" : "श्रेणी चुनें"}
                width="w-full"
                error={
                  touched.category?.[lang] && errors.category?.[lang]
                    ? errors.category[lang]
                    : ""
                }
              />

              {/* Tags */}
              <MultiInputList
                label={`${lang === "en" ? "Tags" : "टैग"}`}
                values={values.tags[lang]}
                onChange={(newTags: string) =>
                  setFieldValue(`tags.${lang}`, newTags)
                }
                placeholder={lang === "en" ? "Add a tag" : "टैग जोड़ें"}
                isView={isView}
                error={
                  touched.tags?.[lang] && errors.tags?.[lang]
                    ? typeof errors.tags[lang] === "string"
                      ? errors.tags[lang]
                      : Array.isArray(errors.tags[lang])
                        ? errors.tags[lang].filter(Boolean).join(", ")
                        : ""
                    : undefined
                }
              />

              {/* Key Points */}
              <MultiInputList
                label={`${lang === "en" ? "Key Points" : "मुख्य बिंदु"}`}
                values={values.keyPoints[lang]}
                onChange={(newKeyPoints: string) =>
                  setFieldValue(`keyPoints.${lang}`, newKeyPoints)
                }
                placeholder={lang === "en" ? "Add a key point" : "मुख्य बिंदु जोड़ें"}
                isView={isView}
                error={
                  touched.keyPoints?.[lang] && errors.keyPoints?.[lang]
                    ? typeof errors.keyPoints[lang] === "string"
                      ? errors.keyPoints[lang]
                      : Array.isArray(errors.keyPoints[lang])
                        ? errors.keyPoints[lang].filter(Boolean).join(", ")
                        : ""
                    : undefined
                }
              />

              {/* Location */}
              <CustomInput
                label={`${lang === "en" ? "Location" : "स्थान"}*`}
                placeholder={
                  lang === "en" ? "Location of the blog" : "ब्लॉग का स्थान"
                }
                value={values.location[lang]}
                name={`location.${lang}`}
                onChange={handleChange}
                error={touched.location?.[lang] ? errors.location?.[lang] : ""}
              />

              {/* Images */}
              <CustomFileInput
                label="Blog Images*"
                name="images"
                onChange={(files, existingUrls) => {
                  setFieldValue("images", files);
                  setFieldValue("existingImages", existingUrls);
                }}
                uploadType="multiple"
                disabled={isView}
                mode={mode}
                error={
                  touched._combinedImagesGuard && errors._combinedImagesGuard
                    ? String(errors._combinedImagesGuard)
                    : ""
                }
              />

              {/* Buttons */}
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
                    paddingx={lang === "en" ? "px-4" : "px-6"}
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

export default BlogForm;
