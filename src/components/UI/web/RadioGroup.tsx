"use client";

import { RadioGroupProps } from "@/src/types";
import React from "react";
import { useTranslation } from "react-i18next";

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  className,
  selectedColor = "var(--green)",
  unselectedColor = "#d1d5db", // tailwind gray-300
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-wrap gap-4 ${className ?? ""}`}
      {...props}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className="flex items-center space-x-2  cursor-pointer select-none"
          >
            {/* hidden native input */}
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="hidden"
            />

            {/* custom radio */}
            <span
              className={` w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors  ${isSelected ? `opacity-100 border-green`: 'opacity-50 border-gray-300'}`}
              
            >
              {!isSelected && (
                 <span
                  className={`w-2.5 h-2.5 rounded-full ${unselectedColor}`}
                  style={{ backgroundColor: selectedColor }}
                />
              )}
              {isSelected && (
                <span
                  className={`w-2.5 h-2.5 rounded-full ${selectedColor} `}
                  // style={{ backgroundColor: selectedColor }}
                />
              )}
            </span>

            {/* label */}
            <span className="text-md font-medium">{t(option.label)}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
