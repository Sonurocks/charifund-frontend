

"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Button from "../../UI/web/Buttons/Button";
import { useCreateComment } from "@/src/hooks/web/useComments";
import React, { Suspense, lazy } from "react";
// Dynamic imports for Formik components
const Formik = lazy(() => import("formik").then(module => ({ default: module.Formik })));
const Form = lazy(() => import("formik").then(module => ({ default: module.Form })));
import { FormikHelpers } from "formik";
import { LeaveCommentFormValues, LeaveCommentSchema } from "@/src/utils/validations/FormValidation";
import InputField from "../../UI/web/InputField";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";

const initialValues: LeaveCommentFormValues = {
  name: "",
  email: "",
  comment: "",
};
export default function LeaveComment({ blogId }: { blogId: string }) {
  if (!blogId) return null;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useCreateComment();

  const handleSubmit = (values: LeaveCommentFormValues,
    { resetForm }: FormikHelpers<LeaveCommentFormValues>) => {
    toast.dismiss()
    toast.loading("Adding Comment...")

    mutation.mutate(
      { id: blogId, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
          toast.dismiss()
          toast.success(t("Comment submitted successfully"));
          resetForm()
        },
      }
    );
  };

  return (
    <div className="w-full mt-10 p-4 sm:p-6 bg-white rounded-lg md:shadow-lg border border-gray-100 max-w-4xl mx-auto lg:w-[896px] lg:h-[595px] lg:mt-20 lg:px-5 lg:py-15">
      <h2 className="text-xl sm:text-2xl font-nunito font-extrabold text-black mb-6">
        {t("Leave A Comment")}
      </h2>
      <Suspense fallback={
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:flex gap-4 lg:flex lg:gap-5">
            <div className="flex items-center bg-gray-light rounded-md w-full animate-pulse">
              <div className="w-full h-6 bg-white/20 rounded"></div>
            </div>
            <div className="flex items-center bg-gray-light rounded-md w-full animate-pulse">
              <div className="w-full h-6 bg-white/20 rounded"></div>
            </div>
          </div>
          <div className="w-full items-start flex bg-gray-light rounded-md px-4 py-2 animate-pulse">
            <div className="w-full h-16 bg-white/20 rounded"></div>
          </div>
          <div className="flex justify-start mt-8">
            <div className="w-fit">
              <div className="w-32 h-12 bg-dark-green rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      }>
        <Formik
          initialValues={initialValues}
          validationSchema={LeaveCommentSchema}
          onSubmit={handleSubmit as any}
        >
        {() => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:flex gap-4 lg:flex lg:gap-5">
              <InputField
                type="text"
                name='name'
                icon={"mdi:user"}
                placeholder={t("Your Name")}
                className="flex items-center bg-gray-light rounded-md  w-full"
                textSize="py-10 px-4"
              />

              <InputField
                type="email"
                icon={'mdi:envelope'}
                name="email"
                placeholder="Enter Email"
                className="flex items-center bg-gray-light rounded-md  w-full"
                textSize="py-10 px-4"
              />
            </div>

            <InputField
              as='textarea'
              icon={'fa7-regular:comments'}
              name="comment"
              placeholder="Type Your Reply..."
              className="w-full items-start flex bg-gray-light rounded-md px-4 py-2 focus:outline-none resize-none "
              textSize="py-10 px-4"

            />

            <div className="flex justify-start mt-8">
              <div className="w-fit">
                <Button
                  bgColor="bg-dark-green"
                  type="submit"
                  textColor="text-white"
                  rounded="rounded-full"
                  hoverTextColor="group-hover:text-black"
                  hoverBg="before:bg-yellow"
                  paddingx="px-6"
                  paddingy="py-5"
                  icon=""
                >
                  {mutation.isPending ? <ButtonLoader /> : t("Submit Comment")}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      </Suspense>
    </div>
  );
}
