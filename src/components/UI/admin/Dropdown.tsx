"use client";

import React, { useState, useRef, useEffect, useId, useMemo, useCallback } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdArrowDropdown, IoMdClose, IoMdSearch } from "react-icons/io";
import { AdminDropdownProps } from "@/src/types/admin";

const Dropdown = <T extends string | number | Record<string, any> = string>({
  id,
  name,
  options = [],
  value,
  onChange,
  label,
  required = false,
  icon,
  placeholder,
  error,
  className = "",
  disabled = false,
  readOnly = false,
  width = "w-full",
  searchable = false,
  searchPlaceholder,
  loading = false,
  clearable = false,
  emptyText,
}: AdminDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const autoId = useId();
  const dropdownId = id || name || `dropdown-${autoId}`;
  const listboxId = `${dropdownId}-listbox`;

  const isObject = (val: any): val is Record<string, any> =>
    val !== null && typeof val === "object";

  // Filter options if searchable
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((opt) => {
      const labelMatch = opt.label?.toLowerCase().includes(q);
      const valueMatch =
        typeof opt.value === "string" ? opt.value.toLowerCase().includes(q) : false;
      return Boolean(labelMatch || valueMatch);
    });
  }, [options, searchable, searchQuery]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null) return undefined;
    return options.find((opt) => {
      if (isObject(opt.value) && isObject(value)) {
        return opt.value.en === value.en || opt.value.hi === value.hi;
      }
      return opt.value === value;
    });
  }, [options, value]);

  // Click outside listener
  useEffect(() => {
    if (disabled) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [disabled]);

  // Focus search input and sync highlighted index when opened
  useEffect(() => {
    if (isOpen) {
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      const idx = filteredOptions.findIndex((opt) => {
        if (isObject(opt.value) && isObject(value)) {
          return opt.value.en === value.en || opt.value.hi === value.hi;
        }
        return opt.value === value;
      });
      setHighlightedIndex(idx >= 0 ? idx : 0);
    } else {
      setSearchQuery("");
      setHighlightedIndex(-1);
    }
  }, [isOpen, searchable, filteredOptions, value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const items = listboxRef.current.querySelectorAll("[role='option']");
      if (items[highlightedIndex]) {
        (items[highlightedIndex] as HTMLElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = useCallback(
    (optValue: T) => {
      onChange(optValue);
      setIsOpen(false);
      setSearchQuery("");
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("" as unknown as T);
      setSearchQuery("");
    },
    [onChange]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readOnly) return;

    switch (e.key) {
      case "Enter":
      case " ":
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        } else if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          e.preventDefault();
          const targetOpt = filteredOptions[highlightedIndex];
          if (!targetOpt.disabled) {
            handleSelect(targetOpt.value);
          }
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => {
            let next = prev + 1;
            while (
              next < filteredOptions.length &&
              filteredOptions[next]?.disabled
            ) {
              next++;
            }
            return next < filteredOptions.length ? next : prev;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && filteredOptions[next]?.disabled) {
              next--;
            }
            return next >= 0 ? next : prev;
          });
        }
        break;
      case "Escape":
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
        }
        break;
    }
  };

  return (
    <div className={`min-w-[100px] relative ${width}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={dropdownId}
          className="block mb-1 font-medium text-blue-50 text-[14px]"
        >
          {label}
          {required && !label.includes("*") && (
            <span className="text-red ml-0.5">*</span>
          )}
        </label>
      )}

      {/* Trigger Box */}
      <div
        id={dropdownId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={label || placeholder || "Select option"}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer relative select-none outline-none transition-colors duration-150 focus:border-primaryColor/50
          ${error ? "border-red" : "border-transparent"}
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-gray-200/60 hover:bg-gray-200/80"}
          ${className}`}
        onClick={() => {
          if (!disabled && !readOnly) {
            setIsOpen((prev) => !prev);
          }
        }}
      >
        {/* Leading Icon */}
        {icon && !readOnly && (
          <Icon
            icon={icon}
            className="text-gray-500/60 text-lg font-bold shrink-0"
          />
        )}

        {/* Selected Option / Placeholder */}
        <span
          className={`flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-[13px] ${
            !selectedOption ? "text-foreground/70" : "text-foreground"
          }`}
        >
          {loading
            ? "Loading..."
            : selectedOption
            ? selectedOption.label
            : options.length === 1 && (options[0] as any).disabled
            ? "No category available"
            : placeholder || "Select"}
        </span>

        {/* Clear Button */}
        {clearable && selectedOption && !disabled && !readOnly && (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full shrink-0"
            title="Clear selection"
            aria-label="Clear selection"
          >
            <IoMdClose className="text-[14px]" />
          </button>
        )}

        {/* Dropdown Arrow */}
        {!readOnly && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.15 }}
            className="text-gray-400 text-[13px] shrink-0"
          >
            <IoMdArrowDropdown />
          </motion.span>
        )}
      </div>

      {/* Animated Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Search Input */}
            {searchable && (
              <div
                className="p-2 border-b border-gray-100 flex items-center gap-1.5 bg-gray-50/50"
                onClick={(e) => e.stopPropagation()}
              >
                <IoMdSearch className="text-gray-400 text-[16px] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
                      handleKeyDown(e);
                    } else if (e.key === "Escape") {
                      setIsOpen(false);
                    }
                  }}
                  placeholder={searchPlaceholder || "Search..."}
                  className="w-full bg-transparent outline-none text-[13px] text-foreground placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <IoMdClose className="text-[13px]" />
                  </button>
                )}
              </div>
            )}

            {/* Options List */}
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-label={label || placeholder || "Options"}
              className="max-h-60 overflow-auto py-1"
            >
              {loading ? (
                <li className="px-3 py-3 text-[13px] text-gray-400 text-center select-none">
                  Loading options...
                </li>
              ) : filteredOptions.length === 0 ? (
                <li className="px-3 py-3 text-[13px] text-gray-400 text-center select-none">
                  {emptyText || (searchQuery ? "No matching options found" : "No options available")}
                </li>
              ) : (
                filteredOptions.map((opt, index) => {
                  const isSelected =
                    (isObject(opt.value) &&
                      isObject(value) &&
                      (opt.value.en === value.en || opt.value.hi === value.hi)) ||
                    opt.value === value;

                  const isHighlighted = highlightedIndex === index;

                  return (
                    <li
                      key={
                        isObject(opt.value)
                          ? opt.value.en || opt.label
                          : String(opt.value || opt.label)
                      }
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      onClick={() => {
                        if (opt.disabled) return;
                        handleSelect(opt.value);
                      }}
                      onMouseEnter={() => {
                        if (!opt.disabled) setHighlightedIndex(index);
                      }}
                      className={`px-3 py-2 text-[14px] cursor-pointer select-none transition-colors duration-100 flex items-center justify-between
                        ${opt.disabled ? "text-gray-400 cursor-not-allowed" : "hover:bg-primaryColor/30"}
                        ${isSelected ? "bg-primaryColor/60 font-medium" : ""}
                        ${isHighlighted && !isSelected && !opt.disabled ? "bg-gray-100" : ""}`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <span className="text-[11px] text-primaryColor font-semibold ml-2 shrink-0">
                          ✓
                        </span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && <p className="text-[10px] text-red mt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
