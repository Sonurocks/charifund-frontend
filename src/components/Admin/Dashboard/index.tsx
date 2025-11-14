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
import { FaMoneyBillWave, FaUsers, FaClipboardList, FaRegBell } from "react-icons/fa";
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

 

  const cards = [
    { 
      title: "Total Funds", 
      value: dashboardData ? `₹${dashboardData.totalFunds.toLocaleString()}` : "₹0", 
      icon: <FaMoneyBillWave size={24} />, 
      color: "from-yellow-400 to-yellow-600" 
    },
    { 
      title: "Active Campaigns", 
      value: dashboardData ? dashboardData.activeCampaign.toString() : "0", 
      icon: <FaClipboardList size={24} />, 
      color: "from-green-400 to-green-600" 
    },
    { 
      title: "Members", 
      value: dashboardData ? dashboardData.totalMembers.toString() : "0", 
      icon: <FaUsers size={24} />, 
      color: "from-yellow-300 to-yellow-500" 
    },
    { 
      title: "Pending Requests", 
      value: dashboardData ? dashboardData.pendingRequest.toString() : "0", 
      icon: <FaRegBell size={24} />, 
      color: "from-green-300 to-green-500" 
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

  if (error) {
    console.error("Dashboard API Error:", error);
    return (
      <div className="md:p-5 md:pr-0 w-full">
        <Breadcrumb lable="Dashboard" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold mb-2">Failed to load dashboard data</p>
          <p className="text-red-500 text-sm">
            Error: {error?.message || "Unknown error occurred"}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            API URL: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
          </p>
          <p className="text-gray-600 text-sm">
            Please check if your backend server is running and the API endpoint is accessible.
          </p>
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
              <Tooltip cursor={{ fill: "var(--gray-100)" }} formatter={(value: number) => `₹${value.toLocaleString()}`} />
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
      <RecentCampaign />

    </div>
  );
};

export default Dashboard;
