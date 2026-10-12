"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Modal from "@/src/components/UI/web/Modal";
import { IMAGE_STANDARDS, ImageStandard } from "@/src/utils/imageStandards";

interface ImageGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightCategory?: string;
}

const CATEGORY_META: Record<
  string,
  { label: string; subtitle: string; icon: string }
> = {
  banner: {
    label: "Banner",
    subtitle: "Page & hero banners",
    icon: "mdi:image-outline",
  },
  campaign: {
    label: "Campaign",
    subtitle: "Campaign feature & gallery",
    icon: "mdi:bullhorn-outline",
  },
  blog: {
    label: "Blog",
    subtitle: "Blog cover & content",
    icon: "mdi:file-document-outline",
  },
  event: {
    label: "Event",
    subtitle: "Event cover & gallery",
    icon: "mdi:calendar-check-outline",
  },
  member: {
    label: "Team member",
    subtitle: "Team member photos",
    icon: "mdi:account-group-outline",
  },
  sponsor: {
    label: "Sponsor logo",
    subtitle: "Sponsor logos",
    icon: "mdi:shield-check-outline",
  },
  feedback: {
    label: "Testimonial",
    subtitle: "Testimonial avatars",
    icon: "mdi:account-heart-outline",
  },
  general: {
    label: "General asset",
    subtitle: "Standard graphics & icons",
    icon: "mdi:image-multiple-outline",
  },
};

export const ImageGuidelinesModal: React.FC<ImageGuidelinesModalProps> = ({
  isOpen,
  onClose,
  highlightCategory,
}) => {
  const standardsList: ImageStandard[] = Object.values(IMAGE_STANDARDS);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      showCloseButton={false}
      noPadding={true}
      className="rounded-2xl border border-gray-100 shadow-2xl bg-white"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <Icon icon="mdi:image-outline" className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Image Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Follow these image specifications for the best quality and performance.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          aria-label="Close"
        >
          <Icon icon="mdi:close" className="text-xl" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6 space-y-4 text-gray-800">
        {/* Standards Table */}
        <div className="border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[540px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-semibold">
                <th className="py-3 px-4">Image Type</th>
                <th className="py-3 px-4">Recommended Dimensions</th>
                <th className="py-3 px-4">Maximum File Size</th>
                <th className="py-3 px-4">Supported Formats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {standardsList.map((item) => {
                const meta = CATEGORY_META[item.id] || {
                  label: item.label,
                  subtitle: item.description,
                  icon: "mdi:image-outline",
                };
                const isHighlighted = highlightCategory === item.id;
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isHighlighted
                        ? "bg-teal-50/50 font-medium"
                        : "hover:bg-gray-50/60"
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Icon icon={meta.icon} className="text-xl" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            {meta.label}
                            {isHighlighted && (
                              <span className="text-[10px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-semibold">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {meta.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      <div>
                        {item.recommendedWidth} × {item.recommendedHeight} px
                      </div>
                      {item.minWidth && item.minHeight && (
                        <div className="text-[11px] text-gray-500 font-normal">
                          Min: {item.minWidth} × {item.minHeight} px
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-normal">
                      Max {item.maxSizeKB} KB
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-normal">
                      {item.formatLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Note */}
        <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-teal-900">
          <Icon
            icon="mdi:information-outline"
            className="text-teal-600 text-lg shrink-0"
          />
          <span>
            Use optimized images for faster loading and consistent display.
          </span>
        </div>
      </div>
    </Modal>
  );
};
export default ImageGuidelinesModal;
