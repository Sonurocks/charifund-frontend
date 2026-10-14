"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleClassName?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  zIndex?: number;
  maxWidth?: string;
  className?: string;
  noPadding?: boolean;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-full m-4",
};

let modalStack = 0;

export default function Modal({
  isOpen,
  onClose,
  title,
  titleClassName,
  children,
  size = "lg",
  showCloseButton = true,
  zIndex = 9000,
  maxWidth,
  className = "",
  noPadding = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [stackIndex, setStackIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    modalStack += 1;
    setStackIndex(modalStack);

    document.body.style.overflow = "hidden";

    return () => {
      modalStack -= 1;
      if (modalStack === 0) document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ESC close only top modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stackIndex === modalStack) {
        onClose();
      }
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, stackIndex]);

  if (!mounted || !isOpen) return null;

  const widthClass = maxWidth ?? sizeClasses[size];

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 p-4"
      style={{ zIndex }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && stackIndex === modalStack) {
          onClose();
        }
      }}
    >
      <div
        data-modal-panel
        className={`relative w-full ${widthClass} max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 shadow-xl ${className}`}
        style={{ background: "var(--modal-panel-bg, #ffffff)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div
            className={`sticky top-0 z-10 flex items-center ${title ? "justify-between" : "justify-end"} border-b border-gray-200 px-6 py-4 text-gray-800 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]`}
            style={{ background: "var(--modal-header-bg, #ffffff)" }}
          >
            {title && (
              <h3
                className={`font-semibold text-gray-900 ${titleClassName ?? "text-xl"}`}
              >
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 cursor-pointer text-gray-500 hover:text-gray-900"
              >
                <X size={22} />
              </button>
            )}
          </div>
        )}

        <div className={noPadding ? "" : "p-4 sm:p-6"}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
