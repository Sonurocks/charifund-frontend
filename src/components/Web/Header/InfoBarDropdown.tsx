"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { DropdownOption, DropdownProps } from "@/src/types/header";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const InfoBarDropdown = ({ options, label }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<DropdownOption | string>(
    options[0] || label
  );

  // Convert string option to DropdownOption
  const getOptionObj = (opt: DropdownOption | string): DropdownOption => {
    return typeof opt === "string" ? { label: opt } : opt;
  };

   // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    // use click instead of mousedown
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const handleSelect = (opt: DropdownOption | string) => {
    setSelected(opt);
    setOpen(false);
  };

  const selectedOption = getOptionObj(selected);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer  text-white"
      >
        {selectedOption.icon && (
          <span className="bg-gray-600 rounded-full p-1">
            <Icon icon={selectedOption.icon} className="size-4 rounded-full text-foreground" />
          </span>
        )}
        <span>{selectedOption.label || label}</span>
        <Icon icon={open ? "mdi:chevron-up" : "mdi:chevron-down"} />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="absolute left-0 mt-2 w-fit bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden z-50"
          >
            {options.map((opt, idx) => {
              const option = getOptionObj(opt);
              return (
                <li key={idx}>
                  <button
                    onClick={() => handleSelect(opt)}
                    className=" text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {option.icon && (
                        <Icon icon={option.icon} className="w-5 h-5" />
                    )}
                    <span>{option.label}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
