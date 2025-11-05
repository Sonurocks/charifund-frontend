


"use client";

import React, { Suspense, lazy } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { volunteerSchema, VolunteerValues } from "@/src/utils/validations/FormValidation";

import InputField from "../../UI/web/InputField";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { VolunteerInformationForm } from "@/src/services/web/client/clientServices";

// Dynamic imports for Formik components
const Formik = lazy(() => import("formik").then(module => ({ default: module.Formik })));
const Form = lazy(() => import("formik").then(module => ({ default: module.Form })));

// ✅ Initial values
const initialValues: VolunteerValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  occupation: "",
  message: "",
};

const VolunteerForm = () => {
  const { t} = useTranslation();
  const mutation = useMutation({
    mutationFn: VolunteerInformationForm,
    onSuccess: () => {
      toast.success(t("formSuccess")); 
    },
    onError: (error: any) => {
      toast.error(t("formError")); 
      console.error("Volunteer form submission error:", error);
    },
  });

  const handleSubmit = (
    values: VolunteerValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  

  return (
    <div className="w-full mx-auto bg-white px-4 xl:px-8 py-10 xl:py-10 rounded-lg border border-gray-200">
      {/* Heading */}
      <h2 className="text-xl xl:text-3xl font-nunito font-bold mb-2 ">
        {t("fillForm")}
      </h2>
      <p className="mt-4 mb-12 text-gray-500 text-[15px] xl:max-w-[70%] leading-8 tracking-wider">
        {t("formNote")}
      </p>

      {/* Form */}
      <Suspense fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-fit">
            <div className="w-24 h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      }>
        <Formik<VolunteerValues>
          initialValues={initialValues}
          validationSchema={volunteerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6 ">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <InputField name="firstName" placeholder={t("firstName")} icon="mdi:account" />
              <InputField name="lastName" placeholder={t("lastName")} icon="mdi:account" />
            </div>

            {/* Email */}
            <InputField name="email" placeholder={t("email")} icon="mdi:email" type="email" />

            {/* Phone + Occupation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField name="phone" placeholder={t("phone")} icon="mdi:phone" />
              <InputField name="occupation" placeholder={t("occupation")} icon="mdi:person-tie" />
            </div>

            {/* Message */}
            <InputField
              name="message"
              placeholder={t("message")}
              icon="mdi:chat"
              as="textarea"
            />

            {/* Submit Button */}
            <div className="w-fit">
              <Button
                type="submit"
                disabled={mutation.isPending}
                hoverBg="before:bg-foreground"
              >
                {isSubmitting || mutation.isPending ? <ButtonLoader /> : t("submit")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      </Suspense>
    </div>
  );
};

export default VolunteerForm;