"use client";

import { Formik, Form } from "formik";
import React, { useRef, useState, useEffect, ChangeEvent } from "react";
import { EventFormValues, EventSchema } from "@/src/utils/validations/FormValidation";
import CustomInput from "../../UI/admin/CustomInput";
import CustomFileInput from "../../UI/admin/CustomFileInput";
import LanguageToggle from "../../UI/admin/LanguageToggle";
import MultiInputList from "../../UI/admin/MultiInputList";
import { getInitialEventValues } from "../InitialValues/eventInitialValues";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import CancelButton from "../../UI/web/Buttons/CancelButton";
import { EventFormProps } from "@/src/types/admin/event";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import LocationPicker from "../../UI/admin/LocationPicker";
import FieldBox from "../../UI/admin/FieldBox";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { hasErrorsForLang } from "../../UI/admin/hasErrorsForLang";

const EventForm = ({ initialData, onClose, mode, onPreview }: EventFormProps) => {
  const initialValues = getInitialEventValues(initialData);
  const { language, toggleLanguage } = useLanguageToggle();
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const startDateRef = useRef<any>(null);
  const startTimeRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);
  const endTimeRef = useRef<any>(null);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (d?: Date | null) => {
    if (!d) return "";
    try {
      return d.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d.toDateString();
    }
  };

  const formatTime = (d?: Date | null) => {
    if (!d) return "";
    try {
      return d.toLocaleTimeString(language === "hi" ? "hi-IN" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return d.toTimeString().slice(0, 5);
    }
  };

  return (
    <div className="w-full pb-10">
      <LanguageToggle language={language} onChange={toggleLanguage} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={EventSchema}
        onSubmit={(values: EventFormValues) => onPreview?.({ ...values })}
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
          setFieldError
        }) => {
          const lang = language;

          const validateDateTimes = () => {
            let valid = true;
            if (!values.startDate) { setFieldError("startDate", lang === "hi" ? "प्रारंभ तिथि आवश्यक है।" : "Start date is required."); valid = false; }
            if (!values.startTime) { setFieldError("startTime", lang === "hi" ? "प्रारंभ समय आवश्यक है।" : "Start time is required."); valid = false; }
            if (!values.endDate) { setFieldError("endDate", lang === "hi" ? "समाप्ति तिथि आवश्यक है।" : "End date is required."); valid = false; }
            if (!values.endTime) { setFieldError("endTime", lang === "hi" ? "अंत समय आवश्यक है।" : "End time is required."); valid = false; }

            if (!valid) return false;

            const start = new Date(values.startDate);
            start.setHours(values.startTime.getHours(), values.startTime.getMinutes(), 0, 0);
            const end = new Date(values.endDate);
            end.setHours(values.endTime.getHours(), values.endTime.getMinutes(), 0, 0);

            if (end < start) {
              const msg = lang === "hi" ? "समाप्ति तिथि और समय प्रारंभ तिथि और समय से बाद का होना चाहिए।" : "End date & time must be after start date & time.";
              setFieldError("endDate", msg);
              setFieldError("endTime", msg);
              return false;
            }

            return true;
          };

          const touchAllFields = (vals: any): any => {
            if (typeof vals !== "object" || vals === null || vals instanceof Date) return true;
            const touchedObj: any = {};
            for (const key in vals) {
              if (!vals.hasOwnProperty(key)) continue;
              const value = vals[key];
              touchedObj[key] =
                typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date)
                  ? touchAllFields(value)
                  : true;
            }
            return touchedObj;
          };

          const handlePreviewClick = async () => {
            // 1. Mark all fields as touched for visibility
            const touchedFields = touchAllFields(values);
            // Manually ensure non-object/non-multilingual fields are marked true
            setTouched({
              ...touchedFields,
              startDate: true,
              startTime: true,
              endDate: true,
              endTime: true,
              images: true,
              latitude: true,
              longitude: true,
            });

            // 2. Run Formik's validation
            const formErrors = await validateForm();

            // 3. Run custom date/time validation (which sets errors)
            const dateTimeValid = validateDateTimes(); // Note: This function already exists and handles its own errors

            // 4. Implement BlogForm's multi-step validation and language switching
            if (language === "en") {
              // Check if English or required date/time fields have errors
              if (hasErrorsForLang(formErrors, "en") || !dateTimeValid) {
                // Errors found in English/Date-Time, stop here and show them
                return;
              }

              // If English is clean, switch to Hindi and stop
              toggleLanguage("hi");
              return;
            }

            if (language === "hi") {
              // First, check if English has errors (for a clean review flow)
              if (hasErrorsForLang(formErrors, "en")) {
                toggleLanguage("en");
                return;
              }

              // Then check for Hindi errors or required date/time fields
              if (hasErrorsForLang(formErrors, "hi") || !dateTimeValid) {
                // Errors found in Hindi/Date-Time, stop here and show them
                return;
              }

              // 5. If both languages (and date/time) are clean, proceed to submit/preview
              submitForm();
            }
          };

          const computeEndMinTime = () => {
            if (values.startDate && values.endDate) {
              const s = values.startDate;
              const e = values.endDate;
              if (s.toDateString() === e.toDateString() && values.startTime) {
                const min = new Date(e);
                min.setHours(values.startTime.getHours(), values.startTime.getMinutes(), 0, 0);
                return min;
              }
            }
            const dayStart = new Date(0);
            dayStart.setHours(0, 0, 0, 0);
            return dayStart;
          };

          const startDateMin = new Date();
          startDateMin.setHours(0, 0, 0, 0);
          const endDateMin = values.startDate ? new Date(values.startDate) : new Date();
          endDateMin.setHours(0, 0, 0, 0);

          return (
            <Form className="flex flex-col gap-3">
              {/* Title, Description, Summary */}
              <CustomInput label={`${lang === "en" ? "Title" : "शीर्षक"}*`} placeholder={lang === "en" ? "Title of the campaign" : "अभियान का शीर्षक"} value={values.title[lang]} name={`title.${lang}`} onChange={handleChange} error={touched.title?.[lang] ? errors.title?.[lang] : ""} disabled={isView} />
              <CustomInput label={`${lang === "en" ? "Description" : "विवरण"}*`} as="textarea" placeholder={lang === "en" ? "Campaign description" : "अभियान का विवरण"} value={values.description[lang]} name={`description.${lang}`} onChange={handleChange} error={touched.description?.[lang] ? errors.description?.[lang] : ""} disabled={isView} />
              <CustomInput label={`${lang === "en" ? "Summary" : "सारांश"}*`} as="textarea" placeholder={lang === "en" ? "Short summary" : "संक्षिप्त सारांश"} value={values.summary[lang]} name={`summary.${lang}`} onChange={handleChange} error={touched.summary?.[lang] ? errors.summary?.[lang] : ""} disabled={isView} />

              {/* Start/End Dates & Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-50">
                <div className="relative flex flex-col w-full ">
                  <FieldBox icon={FaCalendarAlt} label={lang === "hi" ? "प्रारंभ तिथि" : "Start Date"} value={formatDate(values.startDate)} onClick={() => !isView && startDateRef.current?.setOpen(true)} error={errors.startDate && errors.startDate ? String(errors.startDate) : undefined} />
                  <DatePicker ref={startDateRef} selected={values.startDate} onChange={(date: Date | null) => { setFieldValue("startDate", date); if (values.endDate && date && values.endDate < date) setFieldValue("endDate", date); }} dateFormat="dd.MM.yyyy" disabled={isView} minDate={startDateMin} className="hidden h-0" popperClassName="custom-timepicker-popper" wrapperClassName="zero-space-wrapper" />
                </div>

                <div className="relative flex flex-col w-full ">
                  <FieldBox icon={IoMdTime} label={lang === "hi" ? "प्रारंभ समय" : "Start Time"} value={formatTime(values.startTime)} onClick={() => !isView && startTimeRef.current?.setOpen(true)} error={touched.startDate && errors.startDate ? String(errors.startDate) : undefined} />
                  <DatePicker ref={startTimeRef} selected={values.startTime} onChange={(date: Date | null) => setFieldValue("startTime", date)} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="hh:mm aa" disabled={isView} className="hidden h-0" minTime={new Date(0, 0, 0, 0, 0)} maxTime={new Date(0, 0, 0, 23, 59)} popperClassName="custom-timepicker-popper" wrapperClassName="zero-space-wrapper" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 z-49">
                <div className="relative flex flex-col w-full">
                  <FieldBox icon={FaCalendarAlt} label={lang === "hi" ? "समाप्ति तिथि" : "End Date"} value={formatDate(values.endDate)} onClick={() => !isView && endDateRef.current?.setOpen(true)} error={errors.endDate && errors.endDate ? String(errors.endDate) : undefined} />
                  <DatePicker ref={endDateRef} selected={values.endDate} onChange={(date: Date | null) => setFieldValue("endDate", date)} dateFormat="dd.MM.yyyy" disabled={isView} minDate={endDateMin} className="hidden absolute border-3 h-0" popperClassName="custom-timepicker-popper" wrapperClassName="zero-space-wrapper" />
                </div>
                <div className="relative flex flex-col w-full">
                  <FieldBox icon={IoMdTime} label={lang === "hi" ? "अंत समय" : "End Time"} value={formatTime(values.endTime)} onClick={() => !isView && endTimeRef.current?.setOpen(true)} error={errors.endTime && errors.endTime ? String(errors.endTime) : undefined} />
                  <DatePicker ref={endTimeRef} selected={values.endTime} onChange={(date: Date | null) => setFieldValue("endTime", date)} showTimeSelect showTimeSelectOnly timeIntervals={30} timeCaption="Time" dateFormat="hh:mm aa" disabled={isView} className="hidden absolute border-3 h-0" minTime={computeEndMinTime()} maxTime={new Date(0, 0, 0, 23, 59)} popperClassName="custom-timepicker-popper" wrapperClassName="zero-space-wrapper" />
                </div>
              </div>

              {/* Single Location Input + Map */}
              <div className="w-full relative z-48">
                <CustomInput
                  label={lang === "en" ? "Location" : "स्थान"}
                  placeholder={lang === "en" ? "Location of the campaign" : "अभियान का स्थान"}
                  value={values.location[lang]}
                  name={`location.${lang}`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const val = e.target.value;
                    setFieldValue(`location.${lang}`, val);

                    if (!val) {
                      setSuggestions([]);
                      setShowDropdown(false);
                      return;
                    }

                    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`)
                      .then(res => res.json())
                      .then(data => {
                        setSuggestions(data);
                        setShowDropdown(true);
                      });
                  }}
                  error={touched.location?.[lang] ? errors.location?.[lang] : ""}
                  disabled={isView}
                  className="w-full "
                  autoComplete="off"
                />

                {showDropdown && suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 z-50 bg-white border w-full mt-1 max-h-52 overflow-y-auto rounded shadow">
                    {suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                        onMouseDown={() => {
                          const lat = parseFloat(item.lat);
                          const lon = parseFloat(item.lon);
                          const selectedLocation = item.display_name;

                          setFieldValue(`location.${lang}`, selectedLocation);

                          const otherLang = lang === "en" ? "hi" : "en";

                          if (!values.location[otherLang] || values.location[otherLang] === selectedLocation) {
                            setFieldValue(`location.${otherLang}`, selectedLocation);
                          }

                          setFieldValue("latitude", lat);
                          setFieldValue("longitude", lon);
                          setShowDropdown(false);
                        }}
                      >
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              {/* Map updates automatically based on the same input box */}
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
                onChange={(newPoints) => setFieldValue(`keyPoints.${lang}`, newPoints)}
                placeholder={lang === "en" ? "Add a key point" : "मुख्य बिंदु जोड़ें"}
                isView={isView}
                error={
                  touched.keyPoints?.[lang] && errors.keyPoints?.[lang]
                    ? Array.isArray(errors.keyPoints[lang])
                      ? errors.keyPoints[lang]
                      : [errors.keyPoints[lang]]
                    : undefined
                }

              />

              {/* Images */}
              <CustomFileInput
                label={lang === "en" ? "Event Images" : "कार्यक्रम चित्र"}
                name="images"
                uploadType="multiple"
                disabled={isView}
                mode={mode}
                initialUrls={
                  Array.isArray(initialData?.existingImages) && initialData.existingImages.length > 0
                    ? initialData.existingImages.filter((img): img is string => typeof img === "string" && !!img)
                    : Array.isArray(initialData?.images)
                      ? initialData.images.map(img => typeof img === "string" ? img : img instanceof File ? URL.createObjectURL(img) : "").filter(Boolean)
                      : []
                }
                error={touched.images && errors.images ? errors.images : ""}
                onChange={(files, existingUrls) => {
                  // Update Formik values
                  setFieldValue("images", files);
                  setFieldValue("existingImages", existingUrls);

                  // Mark the field as touched
                  setTouched(prev => ({ ...prev, images: true }));

                  // Immediately clear the error
                  setFieldError("images", "");
                }}
              />




              {/* Buttons */}
              {!isView && (
                <div className="flex gap-2 mt-4 w-fit">
                  <Button type="button" onClick={handlePreviewClick} disabled={isSubmitting} bgColor="bg-lime-green" paddingx="px-4" paddingy="py-2" rounded="rounded-[5px]">
                    {isSubmitting ? <ButtonLoader /> : (lang === "hi" ? "पूर्वावलोकन" : "Preview")}
                  </Button>
                  <CancelButton text={lang === "hi" ? "रद्द करें" : "Cancel"} onClose={onClose} />
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
