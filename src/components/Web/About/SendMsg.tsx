"use client";
import dynamic from "next/dynamic";

import Image from "next/image";
import React, { Suspense, lazy, useMemo } from "react";
import Button from "../../UI/web/Buttons/Button";
import { useInView } from "react-intersection-observer";
import FadeInUp from "@/src/animations/FadeInUp";
import { sendmessagefordonation, shapeleft } from "@/public/assets";
import { Trans, useTranslation } from "react-i18next";
import { SendMsgformSchema, SendMsgFormValues } from "@/src/utils/validations/FormValidation";
import InputField from "../../UI/web/InputField";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import { useMutation } from "@tanstack/react-query";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { SendMsgInformationForm } from "@/src/services/web";

// Dynamic imports for Formik components
const Formik = lazy(() => import("formik").then(module => ({ default: module.Formik })));
const Form = lazy(() => import("formik").then(module => ({ default: module.Form })));

// Defer Icon and framer-motion to reduce initial JS
const Icon = dynamic(() => import("@iconify/react").then(m => m.Icon), { ssr: false });
const MotionDiv = lazy(() => import("framer-motion").then(m => ({ default: m.motion.div })));

const initialValues: SendMsgFormValues = {
  email: "",
  phone: "",
  address: "",
  message: "",
};

const SendMsg: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: SendMsgInformationForm,
    onSuccess: async () => {
      const toastModule = await import("react-hot-toast");
      toastModule.default.success("Message sent successfully!");
    },
    onError: async (error: any) => {
      const toastModule = await import("react-hot-toast");
      toastModule.default.error("Something went wrong. Try again.");
      console.error("Submission error:", error);
    },
  });

  const handleSubmit = (
    values: SendMsgFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  return (
    <section className="relative flex items-center justify-center  w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${sendmessagefordonation.src})` }}
      ></div>
      <div className="absolute inset-0  bg-gradient-to-r from-dark-green via-foreground/2 to-foreground/5"></div>

      <FadeInUp
        initialYExis={-60}
        delay={0.2}
        className="absolute top-[-40] md:top-[-90] left-0 w-1/4 md:w-2/5 lg:w-2/7 h-1/2 md:h-2/3 overflow-hidden z-20"
      >
        <Suspense fallback={<div className="h-full w-full" />}> 
        <MotionDiv
          className="h-full w-full relative"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={shapeleft}
            alt="Decorative shape"
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 40vw, 50vw"
            className="object-cover"
          />
        </MotionDiv>
        </Suspense>
      </FadeInUp>

      <div className="relative ml-[0%] md:ml-[25%] xl:ml-[35%] md:mr-[10%] xl:mr-[0%] z-10 w-[50%] min-w-[400px] xs:w-[450px] md:w-[550px] lg:w-[650%] xl:w-[50%] font-nunito bg-green p-8 xs:p-4 sm:p-8 md:p-8 xl:p-15 shadow-lg  overflow-y-auto py-8 ">
        <Suspense fallback={<div className="mb-6 sm:mt-6 md:mt-0 lg:md-8 xl:md-10 text-start px-6" />}> 
        <MotionDiv
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 sm:mt-6 md:mt-0 lg:md-8 xl:md-10 text-start px-6"
        >
          <FadeUpCard delay={0.3}>
            <div className="flex gap-2 mt-10 xs:mt-15 p-1 xl:mt-20 ">
              <Icon
                icon={"mdi:hand-heart"}
                className="text-[20px]  md:text-[24px] text-yellow"
              />
              <span className=" text-yellow font-caveat font-extrabold block text-[18px]  md:text-[22px] ">
                {t("Start Donating Poor People")}
              </span>
            </div>

            <h2 className="mt-5 text-[30px] md:text-[40px] lg:text-[45px] xl:text-[55px] font-extrabold text-white leading-[1.1] tracking-[1px]">
              <Trans
                i18nKey="sendMessageForDonation_title"
                components={{
                  1: <span className="text-yellow ml-1 inline" />,

                  2: <span className="block mt-[-6px]" />,
                }}
              />
            </h2>
          </FadeUpCard>
        </MotionDiv>
        </Suspense>

        <FadeUpCard>
          <Suspense fallback={
            <div className="space-y-10 px-6 xs:px-0 xs:py-2 xl:px-6 xl:py-2 xl:mt-13">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-8 lg:gap-4">
                <div className="w-full rounded-md flex border-2 border-white/20 text-lg bg-foreground/18 xs:h-[50px] xl:h-[60px] px-4 py-4 text-white animate-pulse">
                  <div className="w-full bg-white/20 rounded h-6"></div>
                </div>
                <div className="w-full rounded-md flex border-2 border-white/20 text-lg bg-foreground/18 xs:h-[50px] xl:h-[60px] px-4 py-4 text-white animate-pulse">
                  <div className="w-full bg-white/20 rounded h-6"></div>
                </div>
              </div>
              <div className="w-full rounded-md border-2 border-white/20 flex xs:h-[50px] xl:h-[60px] bg-foreground/18 px-4 py-4 text-white animate-pulse">
                <div className="w-full bg-white/20 rounded h-6"></div>
              </div>
              <div className="w-full rounded-md border-2 border-white/20 flex xs:h-[150px] xl:h-[160px] bg-foreground/18 px-4 py-4 animate-pulse">
                <div className="w-full bg-white/20 rounded h-6"></div>
              </div>
              <div className="w-fit">
                <div className="bg-yellow px-10 xl:px-12 py-4 xl:py-5 rounded animate-pulse">
                  <div className="w-24 h-6 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          }>
            <Formik
              initialValues={initialValues}
              validationSchema={SendMsgformSchema}
              onSubmit={handleSubmit as any}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-10 px-6 xs:px-0 xs:py-2 xl:px-6 xl:py-2 xl:mt-13">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-8 lg:gap-4">
                    <InputField
                      name="email"
                      placeholder={t("your email...")}
                      icon={"mdi:send"}
                      placeholderClassName="xl:placeholder:text-lg"
                      textSize="text-lg"
                      errorTextSize="text-lg"
                      iconClassName="text-yellow text-lg font-bold size-5 xl:size-7 mt-[2px]"
                      className="w-full  rounded-md flex border-2 border-white/20 text-lg  bg-foreground/18 xs:h-[50px] xl:h-[60px] px-4 py-4 text-white "
                    />
                    <InputField
                      name="phone"
                      textSize="text-lg"
                      errorTextSize="text-lg"
                      placeholder={t("your phone...")}
                      icon="mdi:phone"
                      placeholderClassName="xl:placeholder:text-lg"
                      iconClassName="text-yellow text-lg font-bold size-5 xl:size-7 mt-[2px]"
                      className="w-full rounded-md  flex border-2 border-white/20 xs:h-[50px] xl:h-[60px] bg-foreground/18 px-4 py-4 text-white  focus:outline-none"
                    />
                  </div>

                  <InputField
                    name="address"
                    textSize="text-lg"
                    errorTextSize="text-lg"
                    placeholder={t("your address...")}
                    icon={"mdi:location"}
                    placeholderClassName="xl:placeholder:text-lg"
                    iconClassName="text-yellow text-lg font-bold size-5 xl:size-7 mt-[2px]"
                    className="w-full rounded-md border-2 border-white/20 flex xs:h-[50px] xl:h-[60px] bg-foreground/18 px-4 py-4 text-white  focus:outline-none"
                  />

                  <InputField
                    as="textarea"
                    name="message"
                    textSize="text-lg"
                    errorTextSize="text-lg"
                    placeholderClassName="xl:placeholder:text-lg"
                    placeholder={t("your message...")}
                    icon={"mdi:envelope"}
                    iconClassName="text-yellow text-lg font-bold size-5 xl:size-7 mt-[2px]"
                    className="w-full rounded-md border-2 border-white/20 flex xs:h-[150px] xl:h-[160px] bg-foreground/18 px-4 py-4  focus:outline-none resize-none text-white"
                  />

                  <div className="w-fit">
                    <Button
                      type="submit"
                      bgColor="bg-yellow"
                      textColor="text-black"
                      hoverTextColor="group-hover:text-white"
                      hoverBg="before:bg-foreground"
                      paddingx="px-10 xl:px-12"
                      paddingy="py-4 xl:py-5"
                    >
                      {isSubmitting || mutation.isPending ? (
                        <ButtonLoader />
                      ) : (
                        t("Get A Quote")
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Suspense>
        </FadeUpCard>
      </div>
    </section>
  );
};

export default SendMsg;
