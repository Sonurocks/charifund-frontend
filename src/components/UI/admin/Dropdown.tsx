"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { AdminDropdownProps } from "@/src/types/admin";



const Dropdown = <T extends string | number | Record<string, any>>({
  options,
  value,
  onChange,
  label,
  icon,
  placeholder,
  error,
  className = "",
  disabled = false,
  readOnly = false,
  width = "w-full",
}: AdminDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (disabled) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [disabled]);

  const isObject = (val: any): val is Record<string, any> =>
    val !== null && typeof val === "object";


  // Handle both object and primitive comparison for selected value
  const selectedOption = options.find((opt) => {
    if (isObject(opt.value) && isObject(value)) {
      return opt.value.en === value.en || opt.value.hi === value.hi;
    }
    return opt.value === value;
  });



  return (
    <div className={`min-w-[100px] relative ${width}`} ref={containerRef}>
      {label && (
        <label className="block mb-1 font-medium text-blue-50 text-[14px]">
          {label}
        </label>
      )}

      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer relative
          ${error ? "border-red" : "border-transparent"}
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-gray-200/60"}
          ${className}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        {icon && !readOnly && (
          <Icon
            icon={icon}
            className="text-gray-500/60 text-lg font-bold"
          />
        )}

        <span className="flex-1 whitespace-nowrap text-[13px]">
          {selectedOption ? selectedOption.label : placeholder || "Select"}
        </span>

        {!readOnly && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-gray-400 text-[13px]"
          >
            <IoMdArrowDropdown />
          </motion.span>
        )}
      </div>

      {/* Animated options */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {options.map((opt) => {
              const isSelected =
                (isObject(opt.value) && isObject(value) &&
                  (opt.value.en === value.en || opt.value.hi === value.hi)) ||
                opt.value === value;


              return (
                <li
                   key={isObject(opt.value) ? opt.value.en || opt.label : opt.value || opt.label}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-[14px] cursor-pointer hover:bg-primaryColor/30 ${isSelected ? "bg-primaryColor/60 font-medium" : ""
                    }`}
                >
                  {opt.label}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && <p className="text-[10px] text-red mt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
