"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  IoCloudUploadOutline,
  IoTrashOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import Image from "next/image";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Modal from "@/src/components/UI/web/Modal";
import { useUploadGalleryImage } from "@/src/hooks/admin/useGallery";

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE_KB = 500;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export default function GalleryUploadModal({
  isOpen,
  onClose,
}: GalleryUploadModalProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadGalleryImage();

  const validateAndSetFile = useCallback((file: File) => {
    setFileError(null);

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setFileError(
        t("Invalid file format. Only JPG, PNG, and WebP images are supported.")
      );
      return false;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeKb = (file.size / 1024).toFixed(1);
      setFileError(
        t(
          `File size (${fileSizeKb} KB) exceeds the maximum allowed limit of ${MAX_FILE_SIZE_KB} KB. Please compress your image.`
        )
      );
      return false;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return true;
  }, [t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (uploadMutation.isPending) return;
    handleClearFile();
    setAltText("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError(t("Please choose an image to upload."));
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        t(`File exceeds the ${MAX_FILE_SIZE_KB} KB limit. Please choose a smaller image.`)
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    if (altText.trim()) {
      formData.append("altText", altText.trim());
    }

    try {
      await uploadMutation.mutateAsync(formData);
      toast.success(t("Gallery image uploaded successfully!"));
      handleClose();
    } catch (error: any) {
      console.error("Gallery upload error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message ||
        t("Failed to upload image. Please verify your connection and try again.");
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("Upload Gallery Image")}
      maxWidth="max-w-lg"
      showCloseButton={!uploadMutation.isPending}
      className="rounded-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone & Preview */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-nunito">
            {t("Select Image")} <span className="text-red-500">*</span>
          </label>

          {previewUrl ? (
            <div className="relative w-full h-56 rounded-xl overflow-hidden border border-gray-200 bg-gray-900 group">
              <Image
                src={previewUrl}
                alt="Upload preview"
                fill
                className="object-contain"
                unoptimized
              />

              {/* Image Action Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs bg-white text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
                >
                  {t("Change")}
                </button>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition cursor-pointer"
                  title="Remove image"
                >
                  <IoTrashOutline className="w-4 h-4" />
                </button>
              </div>

              {/* File Details Tag */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/70 text-white text-[10.5px] px-2.5 py-1 rounded-md backdrop-blur-xs font-mono">
                <span className="truncate max-w-[240px]">
                  {selectedFile?.name}
                </span>
                <span className="shrink-0 font-semibold text-green-300">
                  {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-7 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                isDragging
                  ? "border-green bg-green/10 scale-[1.01]"
                  : "border-gray-300 hover:border-green bg-gray-50/50 hover:bg-green/5"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-lime-green/15 text-green flex items-center justify-center mb-2.5">
                <IoCloudUploadOutline className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-800 font-nunito">
                {isDragging
                  ? t("Drop your image here")
                  : t("Click or drag image here to upload")}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                JPG, PNG, or WebP (strictly up to {MAX_FILE_SIZE_KB} KB)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />

          {fileError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
              <span>•</span>
              <span>{fileError}</span>
            </div>
          )}
        </div>

        {/* Alt Text Input */}
        <div>
          <label
            htmlFor="gallery-alt-text"
            className="block text-xs font-semibold text-gray-700 mb-1 font-nunito"
          >
            {t("Alt Text / Caption")}{" "}
            <span className="text-gray-400 font-normal">
              ({t("Optional, helps accessibility & SEO")})
            </span>
          </label>
          <input
            id="gallery-alt-text"
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder={t("e.g. Skill training session by YUWA India")}
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-green focus:ring-1 focus:ring-green focus:outline-none transition bg-white text-gray-800"
            maxLength={150}
          />
          <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
            <span>{t("Descriptive captions improve discoverability")}</span>
            <span>{altText.length} / 150</span>
          </div>
        </div>

        {/* Progress Indicator */}
        {uploadMutation.isPending && (
          <div className="bg-lime-green/10 border border-lime-green/30 rounded-xl p-3 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-green border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-green">
                {t("Uploading to Cloudinary & saving...")}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5 overflow-hidden">
                <div className="bg-green h-1 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={uploadMutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={uploadMutation.isPending || !selectedFile}
            className="px-5 py-2 text-xs font-semibold text-white bg-lime-green hover:bg-green disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            {uploadMutation.isPending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t("Uploading...")}</span>
              </>
            ) : (
              <>
                <IoCheckmarkCircle className="w-4 h-4" />
                <span>{t("Upload Image")}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
