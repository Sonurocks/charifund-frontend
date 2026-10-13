"use client";
import React from "react";
import Breadcrumb from "../Breadcrumb";
import { motion, Variants } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Link from "next/link";
import { FaMoneyBillWave, FaUsers, FaClipboardList, FaRegBell, FaHandHoldingHeart, FaDonate } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import DonationPieChart from "./DonationPieChart";
import RecentCampaign from "./RecentCampaign";
import { useFetchDashboardData } from "@/src/hooks/admin/useDashboard";

const barData = [
  { name: "Jan", funds: 4000 },
  { name: "Feb", funds: 3000 },
  { name: "Mar", funds: 5000 },
  { name: "Apr", funds: 4000 },
  { name: "May", funds: 6000 },
  { name: "Jun", funds: 7000 },
];

export const pieData = [
  { name: "Charity A", value: 12000 },
  { name: "Charity B", value: 8000 },
  { name: "Charity C", value: 15000 },
  { name: "Charity D", value: 5000 },
  { name: "Charity E", value: 10000 },
  { name: "Charity F", value: 7000 },
];

export const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useFetchDashboardData();

  const safeDashboardData = {
    totalFunds: dashboardData?.totalFunds ?? 0,
    activeCampaign: dashboardData?.activeCampaign ?? 0,
    totalMembers: dashboardData?.totalMembers ?? 0,
    pendingRequest: dashboardData?.pendingRequest ?? 0,
    generalFunds: dashboardData?.generalFunds ?? 0,
    campaignFunds: dashboardData?.campaignFunds ?? 0,
    onlineFunds: dashboardData?.onlineFunds ?? 0,
    offlineFunds: dashboardData?.offlineFunds ?? 0,
    totalDonationsCount: dashboardData?.totalDonationsCount ?? 0,
    generalDonationsCount: dashboardData?.generalDonationsCount ?? 0,
    campaignDonationsCount: dashboardData?.campaignDonationsCount ?? 0,
  };

  const cards = [
    { title: "Total Funds", value: `₹${safeDashboardData.totalFunds.toLocaleString('en-IN')}`, icon: <FaMoneyBillWave size={24} />, color: "from-yellow-400 to-yellow-600" },
    { title: "Active Campaigns", value: safeDashboardData.activeCampaign.toString(), icon: <FaClipboardList size={24} />, color: "from-green-400 to-green-600" },
    { title: "Members", value: safeDashboardData.totalMembers.toString(), icon: <FaUsers size={24} />, color: "from-yellow-300 to-yellow-500" },
    { title: "Pending Requests", value: safeDashboardData.pendingRequest.toString(), icon: <FaRegBell size={24} />, color: "from-green-300 to-green-500" },
  ];

  const donationCards = [
    {
      title: "General Donations",
      value: `₹${safeDashboardData.generalFunds.toLocaleString('en-IN')}`,
      count: `${safeDashboardData.generalDonationsCount} donations`,
      icon: <FaHandHoldingHeart size={20} className="text-purple-600" />,
      bg: "bg-[#faf5ff] border-[#e9d5ff]",
      titleColor: "text-purple-700",
      countColor: "text-purple-600/80",
    },
    {
      title: "Campaign Donations",
      value: `₹${safeDashboardData.campaignFunds.toLocaleString('en-IN')}`,
      count: `${safeDashboardData.campaignDonationsCount} donations`,
      icon: <MdCampaign size={22} className="text-blue-600" />,
      bg: "bg-[#f0f7ff] border-[#bfdbfe]",
      titleColor: "text-blue-700",
      countColor: "text-blue-600/80",
    },
    {
      title: "Online Collections",
      value: `₹${safeDashboardData.onlineFunds.toLocaleString('en-IN')}`,
      count: `${safeDashboardData.totalDonationsCount} total donors`,
      icon: <FaMoneyBillWave size={20} className="text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-200",
      titleColor: "text-emerald-700",
      countColor: "text-emerald-600/80",
    },
    {
      title: "Offline Collections",
      value: `₹${safeDashboardData.offlineFunds.toLocaleString('en-IN')}`,
      count: "Manual entries",
      icon: <FaDonate size={20} className="text-amber-600" />,
      bg: "bg-amber-50 border-amber-200",
      titleColor: "text-amber-700",
      countColor: "text-amber-600/80",
    },
  ];


  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 80 },
    }),
  };

  const chartVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  if (isLoading) {
    return (
      <div className="md:p-5 md:pr-0 w-full">
        <Breadcrumb lable="Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="bg-gray-200 animate-pulse rounded-xl p-6 h-24"></div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="md:p-5 md:pr-0 w-full">
      <Breadcrumb lable="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-gradient-to-r ${card.color} text-white rounded-xl shadow-lg p-6 flex items-center gap-4 cursor-pointer`}
          >
            <div className="p-3 bg-white bg-opacity-20 rounded-full">{card.icon}</div>
            <div>
              <h3 className="text-sm">{card.title}</h3>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Unified Donation Metrics Overview */}
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {donationCards.map((dCard, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -3 }}
              className={`rounded-xl shadow-xs border p-4 flex items-center gap-3 transition-shadow ${dCard.bg}`}
            >
              <div className="p-2.5 rounded-lg bg-white shadow-xs border border-gray-100 flex-shrink-0">
                {dCard.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-semibold truncate ${dCard.titleColor}`}>{dCard.title}</p>
                <p className="text-lg font-bold truncate text-gray-900 mt-0.5">{dCard.value}</p>
                <p className={`text-[11px] font-medium truncate ${dCard.countColor}`}>{dCard.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <RecentCampaign />

      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="bg-white lg:p-6  rounded-xl mt-8 w-full grid grid-cols-1 lg:grid-cols-5 gap-y-6 lg:gap-6"
      >
        <div className=" col-span-2 ">
          <h2 className="text-gray-500 font-semibold mb-4 ">Campaign Distribution</h2>
          <DonationPieChart data={pieData} />
        </div>

        <div className="col-span-3 ">
          <h2 className="text-gray-500 font-semibold mb-4">Funds Raised (Monthly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barCategoryGap="50%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis tickLine={false} />
              <Tooltip cursor={{ fill: "var(--gray-100)" }} formatter={(value: number) => `₹${value.toLocaleString() ?? "-"}`} />
              <Bar dataKey="funds" radius={[8, 8, 0, 0]} barSize={20}>
                {barData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill="var(--primaryColor)"
                    onMouseEnter={(e) => (e.currentTarget.style.fill = "var(--yellow-50)")}
                    onMouseLeave={(e) => (e.currentTarget.style.fill = "var(--primaryColor)")}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
