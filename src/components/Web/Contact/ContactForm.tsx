
"use client";

import React, { Suspense, lazy } from "react";
// Dynamic imports for Formik components
const Formik = lazy(() => import("formik").then(module => ({ default: module.Formik }))) as typeof import("formik").Formik;
const Form = lazy(() => import("formik").then(module => ({ default: module.Form }))) as typeof import("formik").Form;
import * as Yup from "yup";
import InputField from "../../UI/web/InputField";
import Button from "../../UI/web/Buttons/Button";

import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { ContactUsForm } from "@/src/services/web/client/clientServices";
import { ContactFormValues } from "@/src/types";



const initialValues: ContactFormValues = {
    name: "",
    email: "",
    phone: "",
    message: "",
};

const ContactForm = () => {

    const { t } = useTranslation();
    const ContactFormSchema = Yup.object({
        name: Yup.string().required(t("Name is required")),
        email: Yup.string().email(t("Invalid email")).required(t("Email is required")),
        phone: Yup.string().required(t("Phone number is required")).length(10, t("Phone number must be 10 digits")),
        message: Yup.string().required(t("Message is required")),
    });

    const ContactformMutation = useMutation({
        mutationFn: ContactUsForm,
        onSuccess: () => {
            toast.success("Message sent successfully!");
        },
        onError: (error:any)=>{
            toast.error("Something went wrong. Try again.");
            console.error("Submission error:", error);
        }
    })
    const handleSubmit = (
        values: ContactFormValues,
        { resetForm }: { resetForm: () => void }
    ) => {
        ContactformMutation.mutate(values, {onSuccess:()=>{resetForm();}})
    };

    return (
        <div className="w-full mx-auto bg-white ">
            <Suspense fallback={
                <div className="space-y-9">
                    <div className="flex items-center bg-gray-200 rounded-lg mb-6 p-3 animate-pulse">
                        <div className="w-full h-6 bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-center bg-gray-200 rounded-lg mb-6 p-3 animate-pulse">
                        <div className="w-full h-6 bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-center bg-gray-200 rounded-lg mb-6 p-3 animate-pulse">
                        <div className="w-full h-6 bg-white/20 rounded"></div>
                    </div>
                    <div className="flex items-start bg-gray-200 rounded-lg mb-6 p-3 animate-pulse">
                        <div className="w-full h-16 bg-white/20 rounded"></div>
                    </div>
                    <div className="w-fit">
                        <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            }>
                <Formik
                    initialValues={initialValues}
                    validationSchema={ContactFormSchema}
                    onSubmit={handleSubmit as any}
                >
                {({isSubmitting}) => (
                    <Form className="space-y-9">
                        {/* Name */}
                        <InputField
                            name="name"
                            placeholder={t("Enter Name")}
                            icon="fa6-solid:user"
                            wrapperClass="flex items-center bg-gray-200 rounded-lg mb-6 p-3"
                            inputClass="flex-1 bg-transparent border-none outline-none px-2 text-sm"
                        />

                        {/* Email */}
                        <InputField
                            name="email"
                            placeholder={t("Enter Email")}
                            icon="fa6-solid:envelope"
                            wrapperClass="flex items-center bg-gray-200 rounded-lg mb-6 p-3"
                            inputClass="flex-1 bg-transparent border-none outline-none px-2 text-sm"
                        />

                        {/* Phone */}
                        <InputField
                            name="phone"
                            placeholder={t("Phone Number")}
                            icon="fa6-solid:phone"
                            wrapperClass="flex items-center bg-gray-200 rounded-lg mb-6 p-3"
                            inputClass="flex-1 bg-transparent border-none outline-none px-2 text-sm"
                        />

                        {/* Message */}
                        <InputField
                            name="message"
                            as="textarea"
                            rows={4}
                            placeholder={t("Your Message...")}
                            icon="fa6-solid:comments"
                            wrapperClass="flex items-start bg-gray-200 rounded-lg mb-6 p-3"
                            inputClass="flex-1 bg-transparent border-none outline-none px-2 text-sm resize-none"
                        />

                        {/* Submit Button */}
                        <div className="w-fit">

                            <Button
                                type="submit"
                                text={t("Send Message")}
                                icon="mdi:arrow-right"
                                hoverBg="before:bg-foreground"
                                paddingy="py-5"
                            > 
                            {isSubmitting ? <ButtonLoader /> : t("Send Message")}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
            </Suspense>
        </div>
    );
};

export default ContactForm;
