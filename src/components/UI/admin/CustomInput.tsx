"use client";
import React, { useState} from "react";
import { Icon } from "@iconify/react";
import { AdminCustomInputProps } from "@/src/types/adminCommon";



const CustomInput: React.FC<AdminCustomInputProps> = ({
  label,
  icon,
  type = "text",
  as = "input",
  placeholder,
  value,
  onChange,
  error,
  name,
  onKeyDown,
  className,
  disabled,
  readOnly,
  ref
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = as === "textarea";
  const isPassword = type === "password";

  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={name} className="block mb-1 font-medium text-blue-50 text-[14px]">{label}</label>}

      <div
        className={`flex gap-2 bg-gray-200/60 px-3 py-2 rounded-md border relative
        ${error ? "border-red" : "border-transparent"}
        ${isTextarea ? "items-start" : "items-center"}
        ${readOnly ? "bg-gray-50": "bg-gray-200/60"}
        `}
      >
        {/* Input / Textarea */}
        {isTextarea ? (
          <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
               className={`w-full bg-transparent outline-none text-[13px] placeholder:text-gray-500  ${readOnly ? "cursor-not-allowed text-blue-50/80": "text-foreground/70"}`}
            rows={4}
            onKeyDown={onKeyDown}
            disabled={disabled}
          />
        ) : (
          <input
          ref={ref as React.Ref<HTMLInputElement>}
            id={name}
            name={name}
            type={isPassword && showPassword ? "text" : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            disabled={disabled}
            className={`w-full bg-transparent outline-none text-[13px] placeholder:text-gray-500  ${readOnly ? "cursor-not-allowed text-blue-50": "text-foreground/70"}`}
          />
        )}

        {/* Left Icon */}
        {icon && !isPassword && (
          <Icon
            icon={icon}
            className="text-[var(--gray-500)]/60 text-lg font-bold size-5 mt-[2px]"
          />
        )}

        {/* Password Toggle */}
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

      {/* Error */}
      {error && <p className="text-[10px] text-red mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
