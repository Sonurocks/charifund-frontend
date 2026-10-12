"use client";

import React, { useState, ChangeEvent, DragEvent, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { AdminCustomFileInputProps, AdminFileItem } from "@/src/types/admin";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  IMAGE_STANDARDS,
  ImageStandard,
  validateImageFile,
  formatBytes,
} from "@/src/utils/imageStandards";
import { ImageGuidelinesModal } from "./ImageGuidelinesModal";

interface ExtendedFileItem extends AdminFileItem {
  width?: number;
  height?: number;
  sizeBytes?: number;
}

const CustomFileInput: React.FC<AdminCustomFileInputProps> = ({
  label,
  name,
  onChange,
  error,
  disabled = false,
  mode = "add",
  initialUrls = [],
  initialFiles = [],
  uploadType = "single",
  standard = IMAGE_STANDARDS.general,
  onClearError,
  onError,
}) => {
  const [files, setFiles] = useState<ExtendedFileItem[]>([
    ...initialUrls.map((url) => ({
      url,
      status: "success" as const,
      progress: 100,
    })),
    ...initialFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      status: "success" as const,
      progress: 100,
      sizeBytes: file.size,
    })),
  ]);

  const [fileError, setFileError] = useState<string | null>(null);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isView = mode === "view";
  const isEditable = mode === "add" || mode === "edit";
  const { t } = useTranslation();

  const activeStandard: ImageStandard = standard || IMAGE_STANDARDS.general;

  // Resolve active error string across field-level error and Formik error
  const displayError =
    fileError ||
    (typeof error === "string"
      ? error
      : Array.isArray(error)
        ? (error as any[]).filter(Boolean).join(", ")
        : error
          ? String(error)
          : "");

  // Simulate upload progress
  const simulateUpload = (index: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                progress,
                status: progress >= 100 ? "success" : "processing",
              }
            : f
        )
      );
      if (progress >= 100) clearInterval(interval);
    }, 150);
  };

  // Process & validate multiple selected or dropped files
  const processFiles = async (selected: File[]) => {
    if (selected.length === 0) return;

    const validatedItems: ExtendedFileItem[] = [];
    let lastValidationError: string | null = null;

    for (const file of selected) {
      const validation = await validateImageFile(file, activeStandard);

      if (!validation.valid) {
        lastValidationError = validation.error || t("Invalid image file.");
        toast.error(lastValidationError);
        continue;
      }

      validatedItems.push({
        file,
        url: URL.createObjectURL(file),
        status: "processing",
        progress: 0,
        width: validation.width,
        height: validation.height,
        sizeBytes: file.size,
      });
    }

    if (validatedItems.length === 0) {
      if (lastValidationError) {
        setFileError(lastValidationError);
        onError?.(lastValidationError);
      }
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Clear file error when valid items are accepted
    setFileError(null);
    onClearError?.();

    const updated =
      uploadType === "single"
        ? [validatedItems[validatedItems.length - 1]]
        : [...files, ...validatedItems];

    setFiles(updated);

    // Notify Formik
    onChange(
      updated.filter((f) => f.file).map((f) => f.file!),
      updated
        .filter((f) => !f.file)
        .map((f) => f.url)
        .filter((u) => typeof u === "string" && !u.startsWith("blob:"))
    );

    // Trigger upload animation
    validatedItems.forEach((_, idx) => {
      const actualIndex = uploadType === "single" ? 0 : files.length + idx;
      simulateUpload(actualIndex);
    });

    if (inputRef.current) inputRef.current.value = "";
  };

  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    await processFiles(selected);
  };

  // Handle drag & drop
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled || !isEditable) return;

    const dropped = Array.from(e.dataTransfer.files || []);
    await processFiles(dropped);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    setFileError(null);

    const keptFiles = updated.filter((f) => f.file).map((f) => f.file!);
    const keptUrls = updated
      .filter((f) => !f.file)
      .map((f) => f.url)
      .filter((u) => typeof u === "string" && !u.startsWith("blob:"));

    onChange(keptFiles, keptUrls);
    onClearError?.();
  };

  return (
    <div className="w-full">
      {/* Label and Guidelines Link */}
      <div className="flex items-center justify-between mb-1">
        {label && (
          <label htmlFor={name} className="block font-medium text-gray-700 text-[14px]">
            {label}
          </label>
        )}
      </div>

      {/* Image Standard Specification Pill Bar */}
      {isEditable && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-3 py-2 bg-emerald-50/60 border border-emerald-200/70 rounded-lg text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-700">
            <span className="flex items-center gap-1 font-semibold text-dark-green">
              <Icon icon="mdi:ruler-square" className="text-sm text-yellow-600" />
              {activeStandard.recommendedWidth} × {activeStandard.recommendedHeight} px ({activeStandard.aspectRatio})
            </span>
            {activeStandard.minWidth && activeStandard.minHeight && (
              <span className="text-gray-500 text-[11px]">
                (Min: {activeStandard.minWidth} × {activeStandard.minHeight} px)
              </span>
            )}
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1 text-gray-600">
              <Icon icon="mdi:weight" className="text-sm text-yellow-600" />
              Max: {activeStandard.maxSizeKB} KB (Rec: {activeStandard.recommendedSizeKB})
            </span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-gray-600 hidden sm:inline-flex">
              <Icon icon="mdi:file-image-outline" className="text-sm text-yellow-600" />
              {activeStandard.formatLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowGuidelinesModal(true)}
            className="text-[11px] text-dark-green hover:text-green underline font-bold flex items-center gap-1 ml-auto cursor-pointer"
          >
            <Icon icon="mdi:information-outline" className="text-sm" />
            Image Standards
          </button>
        </div>
      )}

      {/* Dropzone */}
      {!disabled && isEditable && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors
            ${displayError ? "border-red" : "border-yellow"} bg-gray-100/70 hover:bg-gray-100 relative`}
        >
          <input
            id={name}
            ref={inputRef}
            name={name}
            type="file"
            multiple={uploadType === "multiple"}
            accept={activeStandard.acceptedFormats.join(",")}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
          />
          <Icon icon="mdi:cloud-upload-outline" className="text-3xl text-dark-green mx-auto mb-1" />
          <p className="text-sm font-semibold text-gray-800">
            Drag & drop images here or <span className="text-dark-green underline">browse files</span>
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Compliant with {activeStandard.label} standards ({activeStandard.aspectRatio})
          </p>
        </div>
      )}

      {/* Uploaded File List with Specifications metadata */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, idx) => (
            <div
              key={f.url || `${idx}`}
              className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <Image
                    src={f.url || "/default-image.webp"}
                    alt={f.file?.name || `file-${idx}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>

                <div className="text-xs">
                  <p className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[320px]">
                    {f.file?.name || f?.url?.split("/").pop() || "Image Asset"}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                    {f.sizeBytes && <span>{formatBytes(f.sizeBytes)}</span>}
                    {f.width && f.height && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-dark-green font-medium">
                          {f.width} × {f.height} px
                        </span>
                      </>
                    )}
                    <span>•</span>
                    {f.status === "processing" && (
                      <span className="text-yellow-600 font-medium">Uploading {f.progress}%</span>
                    )}
                    {f.status === "success" && (
                      <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                        <Icon icon="mdi:check-circle" className="text-xs" /> Ready
                      </span>
                    )}
                    {f.status === "error" && (
                      <span className="text-red font-medium">Failed</span>
                    )}
                  </div>
                </div>
              </div>

              {isEditable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="text-gray-400 hover:text-red p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <IoMdClose size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {displayError && (
        <p className="flex items-center gap-1.5 text-xs text-red mt-1.5 font-medium">
          <Icon icon="mdi:alert-circle-outline" className="text-sm shrink-0" />
          <span>{displayError}</span>
        </p>
      )}

      {/* Guidelines Modal */}
      <ImageGuidelinesModal
        isOpen={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
        highlightCategory={activeStandard.id}
      />
    </div>
  );
};

export default CustomFileInput;
