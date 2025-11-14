"use client";

import React from "react";
import { Formik, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import InputField from "../../UI/web/InputField";
import Button from "../../UI/web/Buttons/Button";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { registerSchema, registerValues } from "@/src/utils/validations/FormValidation"; // validation
import Link from "next/link";
import { registerUser } from "@/src/services/web/authApi";

const initialValues: registerValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const RegisterForm = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerSchema}
      onSubmit={(values, { setSubmitting }) => {
        toast.dismiss();
        toast.loading("Registering...");

        mutate(values, {
          onSuccess: (data) => {
            toast.dismiss();
            Cookies.set("token", data.token, { expires: 7, path: "/" });
            toast.success("Registration successful 🎉");
            setSubmitting(false);
            window.location.href = "/dashboard";
          },
          onError: (err: any) => {
            toast.dismiss();
            toast.error(err?.message || "Registration failed ❌");
            setSubmitting(false);
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-5 w-full">
          <InputField name="name" type="text" placeholder="Your Name" />
          <InputField name="email" type="email" placeholder="Email" icon="mdi:email" />
          <InputField name="phone" type="text" placeholder="Phone Number" />
          <InputField name="password" type="password" placeholder="Password" icon="mdi:lock" />

          <Button hoverBg="before:bg-[var(--green)]" disabled={isPending || isSubmitting}>
            {isPending || isSubmitting ? <ButtonLoader /> : "Register"}
          </Button>

          <p className="text-sm text-gray-700 text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primaryColor hover:underline">
              Sign In
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
