"use client";

import { Formik, Form } from "formik";
import React, { useState} from "react";
import { EventFormValues, EventSchema } from "@/src/utils/validations/FormValidation";
import CustomInput from "../../UI/admin/CustomInput";
import CustomFileInput from "../../UI/admin/CustomFileInput";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import MultiInputList from "../../UI/admin/MultiInputList";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";
import { getInitialEventValues } from "../utils/eventInitialValues";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LocationPicker from "../../UI/admin/LocationPicker";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import CancelButton from "../../UI/web/Buttons/CancelButton";
import { EventFormProps } from "@/src/types/admin/event";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";


const EventForm = ({ initialData, onClose, mode, onPreview }: EventFormProps) => {

  const initialValues= getInitialEventValues(initialData)

  const { language, toggleLanguage } = useLanguageToggle();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  console.log(initialData)
  return (
    <div className="w-full pb-10">
      <LanguageToggle language={language} onChange={toggleLanguage} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={EventSchema}
       onSubmit={(values: EventFormValues) => {
        console.log("reached")
          const payload = { ...values };
          onPreview?.(payload);
        }}
      >
        {({values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          isSubmitting,
          validateForm,
          submitForm,
          setTouched }) => {
          const lang = language;
          // useEffect(() => {
          //   setFieldValue("keyPoints", keyPointsList, true);
          // }, [keyPointsList, setFieldValue]);
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
          
                      if (formErrors.images) {
                        return;
                      }
          
                      submitForm();
                    };

          return (
            <Form className="flex flex-col gap-3">
              <CustomInput
                label={`${lang === "en" ? "Title" : "शीर्षक"}*`}
                placeholder={lang === "en" ? "Title of the campaign" : "अभियान का शीर्षक"}
                value={values.title[lang]}
                name={`title.${lang}`}
                onChange={handleChange}
                error={touched.title?.[lang] ? errors.title?.[lang] : ""}
                disabled={isView}
              />
              <div className="flex flex-wrap gap-4">
  {/* Start */}
  <div className="flex flex-col w-full">
    <label className="font-medium text-sm">{`${lang === "en" ? "Start Date" : "प्रारंभ तिथि"}*`}</label>
    <DatePicker
      selected={values.startDate}
      className="placeholder:text-xs focus:outline-none border  text-sm border-gray-200 rounded-lg w-full py-1 px-2 bg-gray-light"
      onChange={(date) => setFieldValue("startDate", date)}
      dateFormat="dd.MM.yyyy"
      disabled={isView}
      placeholderText={lang==='en'?"Select start date":"प्रारंभ तिथि का चयन करें"}
    />
    {touched.startDate && typeof errors.startDate==='string' && (
      <div className="text-red-500 text-sm">{errors?.startDate}</div>
    )}
  </div>

  <div className="flex flex-col w-full">
    <label className="font-medium text-sm">{`${lang === "en" ? "Start Time" : "प्रारंभ समय"}*`}</label>
    <DatePicker
    className="placeholder:text-xs focus:outline-none text-sm border-gray-200 rounded-lg w-full py-1 px-2 bg-gray-light "
      selected={values.startTime}
      onChange={(date) => setFieldValue("startTime", date)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption="Time"
      dateFormat="hh:mm aa"
      disabled={isView}
      placeholderText={lang==='en'?"Select start time":"प्रारंभ समय ..."}
    />
    {touched.startTime && typeof errors.startTime==='string' && (
      <div className="text-red-500 text-sm">{errors.startTime}</div>
    )}
  </div>
</div>

<div className="flex flex-wrap gap-4 mt-2">
  {/* End */}
  <div className="flex flex-col w-full">
    <label className="font-medium text-sm">{`${lang==='en'?'End Date':'समाप्ति तिथि'}*`}</label>
    <DatePicker
      selected={values.endDate}
      className="placeholder:text-xs focus:outline-none text-sm border-gray-200 rounded-lg w-full py-1 px-2 bg-gray-light "
      onChange={(date) => setFieldValue("endDate", date)}
      dateFormat="dd.MM.yyyy"
      disabled={isView}
      placeholderText={lang==='en'?'Select end date':'अंतिम तिथि का चयन करें'}
    />
    {touched.endDate && typeof errors.endDate==='string' && (
      <div className="text-red-500 text-sm">{errors.endDate}</div>
    )}
  </div>

  <div className="flex flex-col w-full">
    <label className="font-medium text-sm">{`${lang==='en'?'End Time':'अंत समय'}*`}</label>
    <DatePicker
      selected={values.endTime}
      className="placeholder:text-xs focus:outline-none text-sm border-gray-200 rounded-lg w-full py-1 px-2 bg-gray-light"
      onChange={(date) => setFieldValue("endTime", date)}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption="Time"
      dateFormat="hh:mm aa"
      disabled={isView}
      placeholderText={lang==='en'?'Select end time':'समाप्ति समय चुनें'}
    />
    {touched.endTime && typeof errors.endTime==='string' && (
      <div className="text-red-500 text-sm">{errors.endTime}</div>
    )}
  </div>
</div>


              <CustomInput
                label={`${lang === "en" ? "Location" : "स्थान"}*`}
                placeholder={lang === "en" ? "Location of the campaign" : "अभियान का स्थान"}
                value={values.location[lang]}
                name={`location.${lang}`}
                onChange={handleChange}
                error={touched.location?.[lang] ? errors.location?.[lang] : ""}
                disabled={isView}
              />

              {/* <CustomInput
                label={`${lang === "en" ? "Goal Amount" : "लक्ष्य राशि"}*`}
                type="number"
                placeholder={lang === "en" ? "Enter goal amount" : "लक्ष्य राशि दर्ज करें"}
                value={values.goalAmount}
                name="goalAmount"
                onChange={handleChange}
                error={ touched.goalAmount ? errors.goalAmount : ""}
                disabled={isView}
              /> */}

              <CustomInput
                label={`${lang === "en" ? "Description" : "विवरण"}*`}
                as="textarea"
                placeholder={lang === "en" ? "Campaign description" : "अभियान का विवरण"}
                value={values.description[lang]}
                name={`description.${lang}`}
                onChange={handleChange}
                error={touched.description?.[lang] ? errors.description?.[lang] : ""}
                disabled={isView}
              />

              <CustomInput
                label={`${lang === "en" ? "Summary" : "सारांश"}*`}
                as="textarea"
                placeholder={lang === "en" ? "Short summary" : "संक्षिप्त सारांश"}
                value={values.summary[lang]}
                name={`summary.${lang}`}
                onChange={handleChange}
                error={touched.summary?.[lang] ? errors.summary?.[lang] : ""}
                disabled={isView}
              />
              <LocationPicker
  value={{
    location: values.location,
    latitude: values.latitude || null,
    longitude: values.longitude || null,
  }}
  onChange={(val) => {
    setFieldValue("location", val.location);
    setFieldValue("latitude", val.latitude);
    setFieldValue("longitude", val.longitude);
  }}
  disabled={isView}
/>


              {/* Key Points */}
              <MultiInputList
                label={`${lang === "en" ? "Key Points" : "मुख्य बिंदु"}`}
                values={values.keyPoints[lang]}
                onChange={newPoints => setFieldValue(`keyPoints.${lang}`, newPoints)}
                placeholder={lang === "en" ? "Add a key point" : "मुख्य बिंदु जोड़ें"}
                isView={isView}
                // error={touched.keyPoints?.[lang] && errors.keyPoints?.[lang] ? errors.keyPoints?.[lang] : ""}
              />

              {/* Images */}
              <CustomFileInput
                label={lang === "en" ? "Event Images" : "कार्यक्रम चित्र"}
                name="images"
                error={touched.images&& errors.images ? errors.images : ""}
                onChange={(files, existingUrls) => {
                  setFieldValue("images", files);
                  setFieldValue("existingImages", existingUrls);
                }}
                uploadType="multiple"
                disabled={isView}
                mode={mode}
                initialUrls={
  Array.isArray(initialData?.existingImages) && initialData.existingImages.length > 0
    ? initialData.existingImages.filter(
        (img): img is string => typeof img === "string" && !!img
      )
    : Array.isArray(initialData?.images)
    ? initialData.images.map((img) => {
        if (typeof img === "string") return img;
        if (img instanceof File) return URL.createObjectURL(img);
        return "";
      }).filter(Boolean)
    : []
}
              />

              {/* Buttons */}
              {!isView && (
                              <div className="flex gap-2 mt-4 w-fit">
                                <Button
                                  type="button"
                                  onClick={handlePreviewClick}
                                  disabled={
                                    isSubmitting
                                    // isSubmitting || createMutation.isPending || updateMutation.isPending
                                  }
                                  bgColor="bg-lime-green"
                                  paddingx="px-4"
                                  paddingy="py-2"
                                  rounded="rounded-[5px]"
                                >
                                  {isSubmitting ? (
                                    <ButtonLoader />
                                  ) : isEdit ? (<>{lang==='hi'?"अद्यतन":"Update"}</>
                    ) : (
                      <>{lang==='hi'?"बनाएं":"Create"}</>
                    )}
                                </Button>
              
                                <CancelButton text={lang==='hi'?'रद्द करें':"Cancel"} onClose={onClose} />
                              </div>
                            )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EventForm;
