


"use client";
import { Icon } from "@iconify/react";
import Button from "../../UI/web/Buttons/Button";
import SlideinFromLeft from "@/src/animations/SlideInFromLeft";
import { useTranslation } from "react-i18next";
import React, { Suspense, lazy } from "react";
// Dynamic imports for Formik components
const Formik = lazy(() => import("formik").then(module => ({ default: module.Formik })));
const Form = lazy(() => import("formik").then(module => ({ default: module.Form })));
import InputField from "../../UI/web/InputField";
import { useMutation } from "@tanstack/react-query";
import {
  NewsletterEmailSchema,
  NewsletterEmailValues,
} from "@/src/utils/validations/FormValidation";
import toast from "react-hot-toast";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { NewsletterEmailForm } from "@/src/services/web/client/clientServices";
import { getApiErrorMessage, getApiSuccessMessage } from "@/src/utils/apiHelpers";

const Newsletter = () => {
  const { t} = useTranslation();

  const mutation = useMutation({
    mutationFn: (email: string) => NewsletterEmailForm(email),
    onSuccess: (data: any) => {
      const message = getApiSuccessMessage(data, t("Email subscribed successfully!"));
      toast.success(message);
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, t("Something went wrong. Try again."));
      toast.error(message);
      console.error("Newsletter subscription error:", error);
    },
  });

  const handleSubmit = (
    values: NewsletterEmailValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    mutation.mutate(values.email, {
      onSuccess: () => resetForm(),
      onError: () => resetForm(),
    });
  };

  return (
    <section className="text-white font-nunito py-0 xl:py-20">
      <div className="container w-full max-w-screen-2xl mx-auto pb-10 lg:pb-20 flex flex-col lg:flex-row lg:items-center justify-start gap-8 px-0 sm:px-3 md:px-0 border-b-[1px] border-white/10 ">
        {/* Text Section */}
        <SlideinFromLeft>
          <div>
            <h2 className="text-2xl sm:text-2xl md:text-3xl xl:text-4xl flex font-nunito font-extrabold sm:-my-1">
              {t("Subscribe To Our Newsletter")}
            </h2>
            <p className="text-base sm:text-base md:text-lg opacity-70 mt-2 xl:leading-8 lg:pr-10 xl:pr-24">
              {t("Regular Inspections And Feedback Mechanisms")}
            </p>
          </div>
        </SlideinFromLeft>

        {/* Newsletter Form */}
        <Suspense fallback={
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5 w-fit lg:w-2/5 lg:ml-auto">
            <div className="flex-1 px-5 py-3 xl:px-6 xl:py-5 rounded md:rounded-full bg-white animate-pulse">
              <div className="w-full h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="w-fit">
              <div className="w-12 h-12 bg-gray-200 rounded-[10px] md:rounded-full animate-pulse"></div>
            </div>
          </div>
        }>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={NewsletterEmailSchema}
            onSubmit={handleSubmit as any}
          >
          {({ isSubmitting }) => (
            <Form className="flex items-center gap-3 md:gap-4 lg:gap-5 w-full min-w-0 md:w-3/4 lg:w-2/5 lg:ml-auto">
              <InputField
                name="email"
                placeholder={t("Enter Email")}
                placeholderClassName="xl:placeholder:text-lg placeholder:text-sm placeholder:text-gray-green"
                textSize="text-lg"
                errorTextSize="text-lg"
                className="flex-1 px-5 py-3 xl:px-6 xl:py-5 rounded md:rounded-full bg-white focus:outline-none text-gray-700"
              />
              <div className="w-fit">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  rounded="rounded-[10px] md:rounded-full"
                  paddingx="px-5 md:px-6 xl:px-8"
                  paddingy="py-3 md:py-3 xl:py-4"
                  icon=""
                >
                  {isSubmitting || mutation.isPending ? (
                    <ButtonLoader />
                  ) : (
                    <span className="font-bold md:text-[16px]">{t("Subscribe")}</span>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        </Suspense>
      </div>
    </section>
  );
};

export default Newsletter;


