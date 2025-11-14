"use client";
import { Formik, Form } from "formik";
import { useMutation } from "@tanstack/react-query";
import InputField from "../../UI/web/InputField";
import Button from "../../UI/web/Buttons/Button";
import { loginUser } from "@/src/services/web/authApi";
import { loginSchema, loginValues } from "@/src/utils/validations/FormValidation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";

const initialValues: loginValues = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={(values, { setSubmitting }) => {
        toast.dismiss();
        toast.loading("Signing in...");

        mutate(values, {
          onSuccess: (data) => {
            toast.dismiss();
            Cookies.set("token", data.token, { expires: 7, path: "/" });
            toast.success("Login successful 🎉");
            setSubmitting(false); 
            window.location.href = "/dashboard";
          },
          onError: (err: any) => {
            toast.dismiss();
            console.log(err)
            toast.error(err?.response?.data?.message || "Login failed ");
            setSubmitting(false); 
          },
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Email */}
          <InputField
            name="email"
            type="email"
            placeholder="Your Email"
            icon="mdi:email"
          />

          {/* Password */}
          <InputField
            name="password"
            type="password"
            placeholder="Password"
            icon="mdi:lock"
          />

          {/* Submit button */}
          <Button
          type="submit"
            hoverBg="before:bg-green"
            disabled={isPending || isSubmitting}
          >
            {isPending || isSubmitting ? <ButtonLoader /> : "Submit"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
