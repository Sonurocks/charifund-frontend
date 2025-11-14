"use client";
import { DonationInputProps } from "@/src/types";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";


const DonationInput: React.FC<DonationInputProps> = ({
  presetAmounts = [10, 25, 50, 100],
  value,
  onAmountChange,
}) => {
  const [amount, setAmount] = useState<string>(value || "");

  // Sync internal state if parent controls value
  useEffect(() => {
    if (value !== undefined) setAmount(value);
  }, [value]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    if (value === undefined) setAmount(newValue); // internal mode
    onAmountChange?.(newValue); // notify parent
  };

  const handlePresetClick = (preset: number) => {
    if (value === undefined) setAmount(preset.toString());
    onAmountChange?.(preset.toString());
  };

  const isCustom = !presetAmounts.map(String).includes(amount) && amount !== "";

  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <p className="text-xl font-semibold">{t("Your Donation")}:</p>

      {/* Input */}
      <div className="flex items-center bg-[var(--gray-100)] rounded-full px-4 py-1 space-x-4 max-w-[35rem]">
        <div className="bg-[var(--green)] text-[var(--white)] rounded-full w-12 h-10 flex items-center justify-center text-xl font-bold">
          ₹
        </div>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          inputMode="numeric"
          placeholder={t("Enter amount")}
          className="bg-transparent outline-none w-full text-xl font-medium
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-moz-appearance]:textfield"
        />
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        {presetAmounts.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer border transition
              ${amount === preset.toString()
                ? "bg-[var(--green)] text-[var(--white)]"
                : "bg-[var(--white)] text-[var(--green)] border-[var(--gray-200)]"
              } hover:bg-[var(--green)] hover:text-[var(--white)]`}
          >
            {t(`${preset}`)}
          </button>
        ))}

        <button
          onClick={() => {
            if (value === undefined) setAmount(""); // reset to allow typing
            onAmountChange?.("");
          }}
          className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer border transition
            ${isCustom
              ? "bg-[var(--green)] text-[var(--white)]"
              : "bg-[var(--white)] text-[var(--green)] border-[var(--gray-200)]"
            } hover:bg-[var(--green)] hover:text-[var(--white)]`}
        >
          {t("Custom")}
        </button>
      </div>
    </div>
  );
};

export default DonationInput;
