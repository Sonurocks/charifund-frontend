"use client";
import React, { Suspense, lazy } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";





import { DetailsformSchema, DetailsFormValues } from "@/src/utils/validations/FormValidation";
import { DetailsInformationForm } from "@/src/services/web/client/clientServices";
// Lazy-load Formik to defer form code until needed
const Formik = lazy(() => import("formik").then((m) => ({ default: m.Formik })));
const Form = lazy(() => import("formik").then((m) => ({ default: m.Form })));
import InputField from "../../UI/web/InputField";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
const initialValues: DetailsFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
};
const DetailsForm = () => {
    const { t } = useTranslation();
    const mutation = useMutation({
        mutationFn: DetailsInformationForm,
        onSuccess: async () => {
            const toastModule = await import("react-hot-toast");
            toastModule.default.success(t("Form submitted successfully!"));
        },
        onError: async (error: any) => {
            const toastModule = await import("react-hot-toast");
            toastModule.default.error(t("Something went wrong. Try again."));
            console.error("Submission error:", error);
        },
    });
    const handleSubmit = (
        values: any,
        { resetForm }: { resetForm: () => void }
    ) => {
        mutation.mutate(values, {
            onSuccess: () => {
                resetForm();
            },
        });
    };
    return (
        <div className="w-full mx-auto bg-white">
            <h2 className="text-2xl font-bold mb-6">{t("Details Information")}</h2>
                <Suspense fallback={<div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                    <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                  </div>
                  <div className="w-full rounded-md border-2 border-gray-200/40 h-[50px] animate-pulse"/>
                  <div className="w-full rounded-md border-2 border-gray-200/40 h-[150px] animate-pulse"/>
                  <div className="w-28 h-10 bg-gray-200 rounded animate-pulse"/>
                </div>}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={DetailsformSchema}
                    onSubmit={handleSubmit as any}
                >
                {({ isSubmitting }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField name="firstName" placeholder={t("First Name")} icon="mdi:account" />
                            <InputField name="lastName" placeholder={t("Last Name")} icon="mdi:account" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField name="email" placeholder={t("Your Email")} icon="mdi:email" />
                            <InputField name="phone" placeholder={t("Your Number")} icon="mdi:phone" />
                        </div>
                        <InputField name="address" placeholder={t("Your Address")} icon="mdi:map-marker" />
                        <InputField
                            name="message"
                            placeholder={t("Your message...")}
                            icon="mdi:email-outline"
                            as="textarea"
                        />
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            hoverBg="before:bg-foreground"
                        >
                            {isSubmitting || mutation.isPending ? <ButtonLoader /> : t("Save Information")}
                        </Button>
                    </Form>
                )}
            </Formik>
            </Suspense>
        </div>
    );
};
export default DetailsForm; 