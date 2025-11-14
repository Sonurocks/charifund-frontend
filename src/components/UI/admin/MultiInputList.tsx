"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CustomInput from "./CustomInput";
import { AdminMultiInputListProps } from "@/src/types/adminCommon";

const MultiInputList: React.FC<AdminMultiInputListProps & { error?: string[] }> = ({
  label,
  values,
  onChange,
  placeholder,
  isView = false,
  colorClass = {
    normal: "bg-yellow/30 text-gray-500",
    view: "bg-gray-100 text-gray-600",
  },
  error,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputValue("");
  };

  const removeItem = (item: string) => {
    onChange(values.filter((v) => v !== item));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="flex flex-col ">
      <label className="font-medium text-[13px]">{label}</label>

      {!isView && (
        <div className="flex gap-2 items-center">
          <CustomInput
            placeholder={placeholder || `Add ${label.toLowerCase()}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <button
            type="button"
            onClick={addItem}
            className="bg-primaryColor cursor-pointer text-white px-3 py-2 rounded-md"
          >
            Add
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2 ">
        {values.map((item) => (
          <span
            key={item}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm ${isView ? colorClass.view : colorClass.normal
              }`}
          >
            {item}
            {!isView && (
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="text-red font-bold ml-1"
              >
                <IoMdClose />
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Validation Error */}
      {error && (
        <span className="text-[10px] text-red mt-1">{error}</span>
      )}
    </div>
  );
};

export default MultiInputList;
