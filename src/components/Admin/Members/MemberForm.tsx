"use client";

import { Formik, Form } from "formik";
import React, { useState } from "react";
import { MemberFormProps } from "@/src/types/web/members";
import { memberSchema } from "@/src/utils/validations/FormValidation";
import CustomInput from "../../UI/admin/CustomInput";
import CustomFileInput from "../../UI/admin/CustomFileInput";
import MultiInputList from "../../UI/admin/MultiInputList";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";
import { getInitialMemberValues } from "../utils/memberInitialValues";
import Button from "../../UI/web/Buttons/Button";
import CancelButton from "../../UI/web/Buttons/CancelButton";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";

const MemberForm = ({
    initialData,
    onClose,
    mode,
    onPreview,
    createMutation,
    updateMutation,
}: MemberFormProps) => {
    console.log("initial value", initialData)

    // Prepare initial values for the form - use useMemo to recalculate when initialData changes
    const initialValues = React.useMemo(() => {
        const values = getInitialMemberValues(initialData);
        return values;
    }, [initialData]);

    const [keyPointsList, setKeyPointsList] = useState<{ en: string[], hi: string[] }>({
        en: initialData?.keyPoints?.en ?? [],
        hi: initialData?.keyPoints?.hi ?? [],
    });

    // Update keyPointsList when initialData changes
    React.useEffect(() => {
        if (initialData?.keyPoints) {
            setKeyPointsList({
                en: initialData.keyPoints.en ?? [],
                hi: initialData.keyPoints.hi ?? [],
            });
        } else {
            // Reset to empty arrays if no data
            setKeyPointsList({
                en: [],
                hi: [],
            });
        }
    }, [initialData]);

    const isEdit = mode === "edit";
    const { language, toggleLanguage } = useLanguageToggle();

    return (
        <div className="w-full pb-10">
            {/* Language Toggle */}
            <LanguageToggle language={language} onChange={toggleLanguage} />

            <Formik
                key={initialData?.id || 'new'} // Force re-render when data changes
                enableReinitialize
                initialValues={initialValues}
                validationSchema={memberSchema}
                onSubmit={(values) => {
                    onPreview &&
                        onPreview({
                            ...values,
                            keyPoints: keyPointsList,
                        });
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
                    setTouched
                }) => {
                    const lang = language;

                    React.useEffect(() => {
                        setFieldValue("keyPoints", keyPointsList, true);
                    }, [keyPointsList, setFieldValue]);

                    const handlePreviewClick = async () => {
                        const touchAllFields = (obj: any): any => {
                            if (typeof obj !== 'object' || obj === null) return true;

                            const touchedObj: any = {};
                            for (const key in obj) {
                                if (!obj.hasOwnProperty(key)) continue;

                                const value = obj[key];
                                if (typeof value === 'object' && value !== null) {
                                    touchedObj[key] = touchAllFields(value);
                                } else {
                                    touchedObj[key] = true;
                                }
                            }
                            return touchedObj;
                        };

                        setTouched(touchAllFields(values));

                        const formErrors = await validateForm();
                        console.log("Form Errors:", formErrors);

                        for (const l of ["en", "hi"] as const) {
                            if (hasErrorsForLang(formErrors, l)) {
                                toggleLanguage(l);
                                return;
                            }
                        }

                        if (formErrors.image) {
                            return;
                        }

                        submitForm();
                    };

                    return (
                        <Form className="flex flex-col gap-3">
                            {/* Name */}
                            <CustomInput
                                label={`${lang === "en" ? "Name" : "नाम"}*`}
                                name={`name.${lang}`}
                                value={values.name[lang]}
                                onChange={handleChange}
                                placeholder={lang === "en" ? "Full name" : "पूरा नाम"}
                                error={touched.name?.[lang] ? errors.name?.[lang] : ""}
                            />

                            {/* Position */}
                            <CustomInput
                                label={`${lang === "en" ? "Position" : "पद"}*`}
                                name={`position.${lang}`}
                                value={values.position[lang]}
                                onChange={handleChange}
                                placeholder={lang === "en" ? "Member position" : "सदस्य का पद"}
                                error={touched.position?.[lang] ? errors.position?.[lang] : ""}
                            />

                            {/* Title */}
                            <CustomInput
                                label={`${lang === "en" ? "Title" : "शीर्षक"}`}
                                name={`title.${lang}`}
                                value={values.title[lang]}
                                onChange={handleChange}
                                placeholder={lang === "en" ? "title" : "शीर्षक"}
                                error={touched.title?.[lang] ? errors.title?.[lang] : ""}
                            />

                            {/* Description */}
                            <CustomInput
                                label={`${lang === "en" ? "Description" : "विवरण"}*`}
                                name={`description.${lang}`}
                                as="textarea"
                                value={values.description[lang]}
                                onChange={handleChange}
                                placeholder={lang === "en" ? "Short description" : "संक्षिप्त विवरण"}
                                error={touched.description?.[lang] ? errors.description?.[lang] : ""}
                            />

                            {/* About */}
                            <CustomInput
                                label={`${lang === "en" ? "About" : "के बारे में"}`}
                                name={`about.${lang}`}
                                as="textarea"
                                value={values.about[lang]}
                                onChange={handleChange}
                                placeholder={lang === "en" ? "Optional about section" : "वैकल्पिक जानकारी"}
                                error={touched.about?.[lang] ? errors.about?.[lang] : ""}
                            />

                            {/* Key Points */}
                            <MultiInputList
                                label={`${lang === "en" ? "Key Points" : "मुख्य बिंदु"}`}
                                values={keyPointsList[lang]}
                                onChange={(newValues) => setKeyPointsList(prev => ({ ...prev, [lang]: newValues }))}
                                placeholder={lang === "en" ? "Add a key point" : "मुख्य बिंदु जोड़ें"}
                                error={touched.keyPoints?.[lang] && errors.keyPoints?.[lang] ? "At least one key point is required" : ""}
                            />

                            {/* Image Upload */}
                            <CustomFileInput
                                label={`${lang === "en" ? "Profile Image" : "प्रोफ़ाइल छवि"}*`}
                                name="image"
                                error={touched.image && !values.image && typeof errors.image === "string" ? errors.image : ""}
                                // onChange={(files, existingUrl) => {
                                //     setFieldValue("image", files[0], true);
                                //     setFieldValue("existingImage", existingUrl);
                                // }}
                                mode={mode}
                                initialUrls={
                                    initialData?.image
                                        ? Array.isArray(initialData.image)
                                            ? initialData.image.map(img =>
                                                typeof img === "string" ? img : URL.createObjectURL(img)
                                            )
                                            : [
                                                typeof initialData.image === "string"
                                                    ? initialData.image
                                                    : URL.createObjectURL(initialData.image)
                                            ]
                                        : []
                                }
                                //   error={touched.image && typeof errors.image === "string" ? errors.image : ""}
                                onChange={(files, existingUrls) => {
                                    if (files.length > 0) {
                                        setFieldValue("image", files[0]);
                                    } else if (existingUrls && existingUrls.length > 0) {
                                        setFieldValue("image", existingUrls[0]);
                                    } else {
                                        setFieldValue("image", "");
                                    }
                                }}
                            />

                            {/* Social Links */}
                            <CustomInput
                                label={`${lang === "en" ? "Facebook URL" : "फेसबुक यूआरएल"}`}
                                name="facebookUrl"
                                value={values.facebookUrl ?? ""}
                                onChange={handleChange}
                                placeholder="url"
                                error={touched.facebookUrl ? errors.facebookUrl : ""}
                            />

                            <CustomInput
                                label={`${lang === "en" ? "Twitter URL" : "ट्विटर यूआरएल"}`}
                                name="twitterUrl"
                                value={values.twitterUrl ?? ""}
                                onChange={handleChange}
                                placeholder="url"
                                error={touched.twitterUrl ? errors.twitterUrl : ""}
                            />

                            <CustomInput
                                label={`${lang === "en" ? "Instagram URL" : "इंस्टाग्राम यूआरएल"}`}
                                name="instagramUrl"
                                value={values.instagramUrl ?? ""}
                                onChange={handleChange}
                                placeholder="url"
                                error={touched.instagramUrl ? errors.instagramUrl : ""}
                            />

                            <CustomInput
                                label={`${lang === "en" ? "LinkedIn URL" : "लिंक्डइन यूआरएल"}`}
                                name="linkedInUrl"
                                value={values.linkedInUrl ?? ""}
                                onChange={handleChange}
                                placeholder="url"
                                error={touched.linkedInUrl ? errors.linkedInUrl : ""}
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4 w-fit">
                                <Button
                                    type="button"
                                    onClick={handlePreviewClick}
                                    bgColor="bg-lime-green"
                                    paddingx="px-4"
                                    paddingy="py-2"
                                    rounded="rounded-[5px]"
                                    text={lang === "en" ? "Preview" : "पूर्वावलोकन"}
                                    icon=""
                                >
                                </Button>
                                <CancelButton text={lang === "en" ? "Cancel" : "रद्द करें"} onClose={onClose} icon="" />
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default MemberForm;
