"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { FaMoneyBillWave, FaHandHoldingHeart, FaDonate } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import { DonationSummary } from "@/src/types/admin/donation";
import { useTranslation } from "react-i18next";

interface DonationSummaryCardsProps {
  summary?: DonationSummary;
  totalCount?: number;
  isLoading?: boolean;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, type: "spring", stiffness: 80 },
  }),
};

export const DonationSummaryCards: React.FC<DonationSummaryCardsProps> = ({
  summary,
  totalCount = 0,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-gray-200 animate-pulse rounded-xl p-4 h-24"
          />
        ))}
      </div>
    );
  }

  const safeTotalCollected = Number(
    summary?.totalAmount ?? summary?.totalCollected ?? 0
  );
  const safeGeneralDonations = Number(
    summary?.generalAmount ?? summary?.generalDonations ?? 0
  );
  const safeCampaignDonations = Number(
    summary?.campaignAmount ?? summary?.campaignDonations ?? 0
  );
  const safeOfflineCollections = Number(
    summary?.offlineAmount ?? summary?.offlineCollections ?? 0
  );

  const totalDonationsCount = Number(
    summary?.totalCount ?? summary?.totalDonationsCount ?? totalCount ?? 0
  );
  const generalDonationsCount = Number(
    summary?.generalCount ?? summary?.generalDonationsCount ?? 0
  );
  const campaignDonationsCount = Number(
    summary?.campaignCount ?? summary?.campaignDonationsCount ?? 0
  );
  const offlineCollectionsCount = Number(
    summary?.offlineCount ?? summary?.offlineDonationsCount ?? 0
  );

  const cards = [
    {
      title: t("Total Collected"),
      amount: `₹${safeTotalCollected.toLocaleString("en-IN")}`,
      countText: `${totalDonationsCount.toLocaleString("en-IN")} donations`,
      icon: <FaMoneyBillWave size={20} />,
      color: "from-amber-400 to-amber-600",
    },
    {
      title: t("General Donations"),
      amount: `₹${safeGeneralDonations.toLocaleString("en-IN")}`,
      countText: `${generalDonationsCount.toLocaleString("en-IN")} donations`,
      icon: <FaHandHoldingHeart size={20} />,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: t("Campaign Donations"),
      amount: `₹${safeCampaignDonations.toLocaleString("en-IN")}`,
      countText: `${campaignDonationsCount.toLocaleString("en-IN")} donations`,
      icon: <MdCampaign size={22} />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: t("Offline Collections"),
      amount: `₹${safeOfflineCollections.toLocaleString("en-IN")}`,
      countText: `${offlineCollectionsCount.toLocaleString("en-IN")} collections`,
      icon: <FaDonate size={20} />,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02, y: -2 }}
          className={`bg-gradient-to-r ${card.color} text-white rounded-xl shadow-sm p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0`}
        >
          <div className="p-2 sm:p-2.5 bg-white/20 rounded-full shrink-0 flex items-center justify-center">
            {card.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-white/90 leading-tight truncate">
              {card.title}
            </h3>
            <p className="text-base sm:text-lg lg:text-xl font-bold mt-0.5 text-white truncate">
              {card.amount}
            </p>
            <p className="text-[11px] sm:text-xs text-white/80 mt-0.5 truncate">
              {card.countText}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DonationSummaryCards;
