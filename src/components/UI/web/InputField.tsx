"use client";

import { FieldHookConfig, useField } from "formik";
import { Icon } from "@iconify/react";
import {  useState } from "react";
import { useTranslation } from "react-i18next";
import { InputFieldProps } from "@/src/types";


const InputField: React.FC<InputFieldProps & FieldHookConfig<string>> = ({
  label,
  icon,
  type = "text",
  as = "input",
  placeholder,
  className='flex gap-2 bg-gray-200/60 px-3 py-4 rounded-md  relative',
  iconClassName="text-gray-500/60 text-lg font-bold size-5 mt-[2px]",
  placeholderClassName='',
  textSize="text-[14px]",
  errorTextSize="text-[10px]",
  ...props
}) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);
  const{t}=useTranslation();
  const isTextarea = as === "textarea";
  const isPassword = type === "password";

  // 🔍 Check if the icon is a string (Iconify) or JSX (React Icon or custom)
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === "string") {
      return (
        <Icon
          icon={icon}
          className={iconClassName}
        />
      );
    }

    return <span className="text-gray-500/60 text-lg">{icon}</span>;
  };

  return (
    <div className="w-full">
      {label && <label className="block mb-1 font-medium">{label}</label>}

      <div
        className={`
          ${meta.touched && meta.error ? "border-red" : ""}
          ${isTextarea ? "items-start relative" : "items-center relative"} ${className}`}
      >
        {/* Icon for textarea (positioned absolutely) */}
        {isTextarea && icon && (
          <div className="absolute right-3 top-3 z-10">
            {renderIcon()}
          </div>
        )}

        {/* Icon for input (positioned absolutely) */}
        {!isPassword && !isTextarea && icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
            {renderIcon()}
          </div>
        )}

        {/* Input / Textarea */}
        {isTextarea ? (
          <textarea
            {...field}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none resize-none scrollbar-hide ${textSize} ${placeholderClassName} ${icon ? 'pr-10' : ''}`}
            rows={4}
          />
        ) : (
          <input
            {...field}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none ${textSize} ${placeholderClassName} ${icon ? 'pr-10' : ''}`}
          />
        )}

        {/* Password Toggle Icon (right side) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            <Icon
              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
              className="text-lg"
            />
          </button>
        )}
      </div>

      {/* Error message */}
      {meta.touched && meta.error && (
        <p className={`${errorTextSize} text-red mt-1`}>{t(meta.error)}</p>
      )}
    </div>
  );
};

export default InputField;
