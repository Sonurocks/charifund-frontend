"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import { FaTimes } from "react-icons/fa";

export interface DateSelectProps {
  label?: string;
  value?: string; // Expects "YYYY-MM-DD"
  onChange: (val: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

const parseDateString = (str?: string): Date | null => {
  if (!str) return null;
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
  placeholder = "dd/mm/yyyy",
  minDate,
  maxDate,
  disabled = false,
  className = "",
  clearable = true,
}) => {
  const parsedDate = parseDateString(value);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-1 text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 bg-gray-100/70 px-3 py-2 rounded-md border border-gray-200 focus-within:border-primaryColor transition-colors relative h-[35px] ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <Icon
          icon="mdi:calendar-outline"
          className="text-gray-400 text-base flex-shrink-0 pointer-events-none"
        />
        <DatePicker
          selected={parsedDate}
          onChange={(date: Date | null) => onChange(formatDateString(date))}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          placeholderText={placeholder}
          dateFormat="dd/MM/yyyy"
          className="w-full bg-transparent outline-none text-xs text-gray-800 placeholder:text-gray-400 cursor-pointer"
          wrapperClassName="w-full flex items-center"
          popperClassName="z-50"
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
