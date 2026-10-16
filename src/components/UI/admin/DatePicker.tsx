"use client";

import React, { useRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { FaTimes } from "react-icons/fa";

export interface DatePickerProps {
  label?: string;
  required?: boolean;
  value?: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  clearable?: boolean;
  dateFormat?: string;
  error?: string;
  helperText?: string;
  inModal?: boolean;
  popperPlacement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
}

/**
 * Robust timezone-safe parser to prevent off-by-one errors with UTC conversions.
 * Always treats "YYYY-MM-DD" as local date.
 */
const parseDateString = (val?: string | number): Date | null => {
  if (val === undefined || val === null || val === "") return null;
  const str = String(val).trim();
  const parts = str.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Format local Date to "YYYY-MM-DD" string
 */
const formatDateString = (d: Date | null): string => {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ModalPortalContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  if (typeof document === "undefined" || !children) return null;
  return createPortal(children, document.body);
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  required = false,
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  minDate,
  maxDate,
  disabled = false,
  className = "",
  inputClassName = "",
  clearable = true,
  dateFormat = "dd/MM/yyyy",
  error,
  helperText,
  inModal = false,
  popperPlacement = "bottom-start",
}) => {
  const datePickerRef = useRef<any>(null);
  const parsedDate = parseDateString(value);

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (datePickerRef.current?.isCalendarOpen()) {
      datePickerRef.current.setOpen(false);
    } else {
      datePickerRef.current?.setFocus();
      datePickerRef.current?.setOpen(true);
    }
  };

  const handleContainerClick = () => {
    if (disabled) return;
    datePickerRef.current?.setFocus();
    datePickerRef.current?.setOpen(true);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-1 text-xs font-semibold text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={handleContainerClick}
        className={`flex items-center gap-2 bg-white px-3 py-2 rounded-lg border transition-all relative h-[38px] cursor-pointer ${
          error
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-200"
            : "border-gray-300 focus-within:border-primaryColor focus-within:ring-1 focus-within:ring-primaryColor/20"
        } ${disabled ? "opacity-60 cursor-not-allowed !pointer-events-none bg-gray-50" : "hover:border-gray-400"} ${inputClassName}`}
      >
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={handleIconClick}
          className={`text-gray-500 hover:text-gray-700 text-base flex-shrink-0 focus:outline-none transition-colors ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          aria-label="Open calendar"
          title="Open calendar"
        >
          <Icon icon="mdi:calendar-outline" className="pointer-events-none w-4 h-4 text-gray-600" />
        </button>

        <ReactDatePicker
          ref={datePickerRef}
          selected={parsedDate}
          onChange={(date: Date | null) => {
            if (!date) {
              onChange("");
              return;
            }
            onChange(formatDateString(date));
          }}
          onClickOutside={() => {
            datePickerRef.current?.setOpen(false);
          }}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          placeholderText={placeholder}
          dateFormat={dateFormat}
          autoComplete="off"
          className="w-full bg-transparent outline-none text-xs text-gray-900 placeholder:text-gray-400 cursor-pointer font-medium"
          wrapperClassName="w-full flex-1 flex items-center"
          popperClassName={inModal ? "!z-[999999]" : "!z-[9999]"}
          popperPlacement={popperPlacement}
          popperContainer={inModal ? ModalPortalContainer : undefined}
          popperProps={
            {
              strategy: "fixed",
            } as any
          }
        />

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0 cursor-pointer p-1"
            title="Clear date"
            aria-label="Clear date"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-red-600 font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default DatePicker;
