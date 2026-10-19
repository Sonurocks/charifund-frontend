"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  headerIcon?: React.ReactNode;
  titleClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  zIndex?: number;
  maxWidth?: string;
  className?: string;
  noPadding?: boolean;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-full m-2 sm:m-4",
};

let modalStack = 0;

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  headerIcon,
  titleClassName,
  children,
  footer,
  size = "lg",
  showCloseButton = true,
  closeOnOverlayClick = true,
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

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      modalStack -= 1;
      if (modalStack === 0) {
        document.body.style.overflow = prevOverflow || "unset";
      }
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
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150"
      style={{ zIndex }}
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget && stackIndex === modalStack) {
          onClose();
        }
      }}
    >
      <div
        data-modal-panel
        className={`relative w-full ${widthClass} max-h-[92vh] flex flex-col rounded-2xl border border-gray-200 shadow-2xl overflow-hidden bg-white text-gray-900 animate-in zoom-in-95 duration-150 ${className}`}
      >
        {/* Sticky Header */}
        {(title || showCloseButton) && (
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 px-5 sm:px-6 py-4 bg-white shrink-0">
            <div className="flex items-center gap-3 min-w-0 pr-4">
              {headerIcon && <div className="shrink-0">{headerIcon}</div>}
              <div className="min-w-0">
                {title && (
                  <h3
                    id="modal-title"
                    className={`font-bold text-gray-900 leading-snug truncate ${titleClassName ?? "text-base sm:text-lg"}`}
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-normal">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Body */}
        <div className={`overflow-y-auto flex-1 ${noPadding ? "" : "p-4 sm:p-6"}`}>
          {children}
        </div>

        {/* Sticky Footer Slot (optional) */}
        {footer && (
          <div className="sticky bottom-0 z-20 px-5 sm:px-6 py-3.5 bg-gray-50 border-t border-gray-200 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
