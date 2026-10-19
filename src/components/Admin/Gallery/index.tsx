"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaTrashAlt,
  FaEye,
  FaImages,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Modal from "../../UI/web/Modal";
import ConfirmModal from "../../UI/admin/ConfirmModal";
import AdminCustomPagination from "../../UI/admin/CustomePagination";
import GalleryUploadModal from "./GalleryUploadModal";
import {
  useAdminGallery,
  useDeleteGalleryImage,
} from "@/src/hooks/admin/useGallery";
import { GalleryImage } from "@/src/types/admin/gallery";

const ITEMS_PER_PAGE = 8;

export default function GalleryAdmin() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  const { data, isLoading, isError, error, refetch } = useAdminGallery(
    currentPage,
    ITEMS_PER_PAGE
  );
  const deleteMutation = useDeleteGalleryImage();

  const images = data?.images || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const handleDeleteClick = (img: GalleryImage) => {
    setSelectedImage(img);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    const idToDelete = selectedImage?.id || selectedImage?._id;
    if (!idToDelete) {
      toast.error(t("Unable to identify image record ID for deletion."));
      setIsDeleteOpen(false);
      return;
    }

    try {
      await deleteMutation.mutateAsync(idToDelete);
      toast.success(
        t("Image permanently deleted from gallery and Cloudinary storage.")
      );
      setIsDeleteOpen(false);
      setSelectedImage(null);
      // If we deleted the last item on the current page, step back
      if (images.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err: any) {
      console.error("Delete gallery image error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        t("Failed to delete image. Please try again.");
      toast.error(msg);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full">
      {/* Polished Modern Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight font-nunito">
              {t("Gallery")}
            </h1>
            <span className="inline-flex items-center gap-1.5 bg-lime-green/15 text-green text-xs font-bold px-3 py-1 rounded-full border border-lime-green/30">
              <FaImages className="w-3 h-3" />
              <span>
                {total} {total === 1 ? t("Image") : t("Images")}
              </span>
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-lime-green hover:bg-green text-white text-xs font-semibold rounded-xl shadow-xs transition transform hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>{t("Upload Image")}</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs animate-pulse"
            >
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl mb-3" />
              <div className="h-3.5 bg-gray-200 rounded-full w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center my-6">
          <FaExclamationTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">
            {t("Failed to Load Gallery")}
          </h3>
          <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
            {(error as any)?.response?.data?.message ||
              (error as any)?.message ||
              t(
                "Could not fetch gallery images from the server. Please check your network or login session."
              )}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            {t("Retry")}
          </button>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mx-auto mb-4">
            <FaImages className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-base font-bold text-gray-800 font-nunito">
            {t("No Images in Gallery")}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {t(
              "You haven't uploaded any gallery images yet. Upload images to display them dynamically in the website footer scroller."
            )}
          </p>
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-lime-green hover:bg-green text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>{t("Upload First Image")}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Gallery Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {images.map((img) => (
              <motion.div
                key={img.id || img._id || img.imageUrl}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition duration-300 group overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Fixed Aspect Ratio Image Container */}
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || t("Gallery photo")}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Accessible Action Overlay on Hover & Focus */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(img)}
                        className="p-2.5 bg-white/95 hover:bg-white text-gray-800 rounded-xl shadow-sm transition transform hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                        title={t("View Full Preview")}
                        aria-label={t("Preview image")}
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(img)}
                        className="p-2.5 bg-red-600/95 hover:bg-red-600 text-white rounded-xl shadow-sm transition transform hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
                        title={t("Delete Image")}
                        aria-label={t("Delete image")}
                      >
                        <FaTrashAlt className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Alt Text / Caption */}
                  <div className="p-3.5">
                    <p
                      className="text-xs font-semibold text-gray-800 line-clamp-2 leading-relaxed"
                      title={img.altText || t("No caption")}
                    >
                      {img.altText || (
                        <span className="text-gray-400 italic font-normal">
                          {t("No caption provided")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="px-3.5 pb-3.5 pt-1.5 flex items-center justify-between border-t border-gray-50 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                    <span>{formatDate(img.createdAt)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(img)}
                    className="text-gray-400 hover:text-red-600 transition cursor-pointer p-1"
                    title={t("Delete")}
                    aria-label={t("Delete")}
                  >
                    <FaTrashAlt className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end mt-6">
              <AdminCustomPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}

      {/* Upload Modal (Using Reusable Modal) */}
      <GalleryUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        loading={deleteMutation.isPending}
        title={t("Confirm Delete")}
        message={t("Are you sure you want to delete this record?")}
        buttonText={t("Delete")}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setIsDeleteOpen(false);
            setSelectedImage(null);
          }
        }}
      />

      {/* Full Preview Lightbox (Using Reusable Modal) */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.altText || t("Image Preview")}
        maxWidth="max-w-3xl"
        showCloseButton={true}
        className="rounded-2xl"
      >
        {previewImage && (
          <div className="w-full">
            <div className="relative w-full h-[60vh] rounded-xl overflow-hidden bg-gray-900">
              <Image
                src={previewImage.imageUrl}
                alt={previewImage.altText || t("Gallery full preview")}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            {previewImage.altText && (
              <p className="mt-3 text-xs text-gray-700 font-medium text-center font-nunito">
                {previewImage.altText}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
