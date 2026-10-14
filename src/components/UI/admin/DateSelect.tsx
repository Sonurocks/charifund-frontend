"use client";

import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import { FaTimes } from "react-icons/fa";

export interface DateSelectProps {
  label?: string;
  value?: string | number; // Expects "YYYY-MM-DD" or "YYYY" or numeric year
  onChange: (val: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
  dateFormat?: string;
  showYearPicker?: boolean;
  popperPlacement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
}

const parseDateString = (val?: string | number): Date | null => {
  if (val === undefined || val === null || val === "") return null;
  const str = String(val).trim();
  if (/^\d{4}$/.test(str)) {
    const year = parseInt(str, 10);
    return isNaN(year) ? null : new Date(year, 0, 1);
  }
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

const formatDateString = (d: Date | null): string => {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const DateSelect: React.FC<DateSelectProps> = ({
  label,
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
  disabled = false,
  className = "",
  clearable = true,
  dateFormat,
  showYearPicker = false,
  popperPlacement,
}) => {
  const datePickerRef = useRef<DatePicker>(null);
  const parsedDate = parseDateString(value);

  const defaultPlaceholder = showYearPicker ? "yyyy" : "dd/mm/yyyy";
  const defaultDateFormat = showYearPicker ? "yyyy" : "dd/MM/yyyy";

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
        <label className="block mb-1 text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <div
        onClick={handleContainerClick}
        className={`flex items-center gap-2 bg-gray-100/70 px-3 py-2 rounded-md border border-gray-200 focus-within:border-primaryColor transition-colors relative h-[35px] cursor-pointer ${
          disabled ? "opacity-60 cursor-not-allowed !pointer-events-none" : ""
        }`}
      >
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={handleIconClick}
          className={`text-gray-400 hover:text-gray-600 text-base flex-shrink-0 focus:outline-none transition-colors ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          aria-label="Open calendar"
          title="Open calendar"
        >
          <Icon
            icon="mdi:calendar-outline"
            className="pointer-events-none"
          />
        </button>
        <DatePicker
          ref={datePickerRef}
          selected={parsedDate}
          onChange={(date: Date | null) => {
            if (!date) {
              onChange("");
              return;
            }
            if (showYearPicker) {
              onChange(String(date.getFullYear()));
            } else {
              onChange(formatDateString(date));
            }
          }}
          showYearPicker={showYearPicker}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          placeholderText={placeholder || defaultPlaceholder}
          dateFormat={dateFormat || defaultDateFormat}
          autoComplete="off"
          className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder:text-gray-400 cursor-pointer"
          wrapperClassName="w-full flex-1 flex items-center"
          popperClassName={`z-50 ${showYearPicker ? "year-picker-popper" : ""}`}
          popperPlacement={
            popperPlacement || (showYearPicker ? "bottom-end" : "bottom-start")
          }
          renderCustomHeader={
            showYearPicker
              ? ({
                  date,
                  decreaseYear,
                  increaseYear,
                  prevYearButtonDisabled,
                  nextYearButtonDisabled,
                }) => {
                  const currentYear = date.getFullYear();
                  const startYear = currentYear - (currentYear % 12);
                  const endYear = startYear + 11;

                  return (
                    <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
                      <button
                        type="button"
                        onClick={decreaseYear}
                        disabled={prevYearButtonDisabled}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
                        aria-label="Previous Decade"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-xs font-bold text-gray-800">
                        {startYear} - {endYear}
                      </span>
                      <button
                        type="button"
                        onClick={increaseYear}
                        disabled={nextYearButtonDisabled}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
                        aria-label="Next Decade"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  );
                }
              : undefined
          }
        />
        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0 cursor-pointer"
            title="Clear date"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
};

export default DateSelect;
