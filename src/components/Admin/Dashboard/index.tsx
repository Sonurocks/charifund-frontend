"use client";
import React, { useState } from "react";
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
import {
  FaMoneyBillWave,
  FaUsers,
  FaClipboardList,
  FaRegBell,
  FaHandHoldingHeart,
  FaDonate,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdCampaign } from "react-icons/md";
import DonationPieChart from "./DonationPieChart";
import RecentCampaign from "./RecentCampaign";
import {
  useFetchDashboardData,
  useFetchCampaignDistribution,
  useFetchMonthlyFunds,
} from "@/src/hooks/admin/useDashboard";
import DateSelect from "@/src/components/UI/admin/DateSelect";
import RollingCounter from "@/src/components/UI/admin/RollingCounter";

export const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  const { data: dashboardData, isLoading, refetch: refetchDashboard } = useFetchDashboardData();

  const {
    data: campaignDistData,
    isLoading: isDistLoading,
    isError: isDistError,
    refetch: refetchDist,
  } = useFetchCampaignDistribution();

  const {
    data: monthlyFundsData,
    isLoading: isMonthlyLoading,
    isError: isMonthlyError,
    refetch: refetchMonthly,
  } = useFetchMonthlyFunds(selectedYear);

  // Local live state for zero-latency optimistic updates and rolling odometer
  const [liveData, setLiveData] = useState<{
    totalFunds: number;
    generalFunds: number;
    campaignFunds: number;
    onlineFunds: number;
    offlineFunds: number;
    totalDonationsCount: number;
    generalDonationsCount: number;
    campaignDonationsCount: number;
    offlineDonationsCount: number;
    activeCampaign: number;
    totalMembers: number;
    liveEvents: number;
  }>(() => ({
    totalFunds: dashboardData?.totalFunds ?? 0,
    generalFunds: dashboardData?.generalFunds ?? 0,
    campaignFunds: dashboardData?.campaignFunds ?? 0,
    onlineFunds: dashboardData?.onlineFunds ?? 0,
    offlineFunds: dashboardData?.offlineFunds ?? 0,
    totalDonationsCount: dashboardData?.totalDonationsCount ?? 0,
    generalDonationsCount: dashboardData?.generalDonationsCount ?? 0,
    campaignDonationsCount: dashboardData?.campaignDonationsCount ?? 0,
    offlineDonationsCount: dashboardData?.offlineDonationsCount ?? 0,
    activeCampaign: dashboardData?.activeCampaign ?? 0,
    totalMembers: dashboardData?.totalMembers ?? 0,
    liveEvents: dashboardData?.liveEvents ?? dashboardData?.activeCampaign ?? 0,
  }));

  // Sync initial query data or refetched query data into live state
  React.useEffect(() => {
    if (dashboardData) {
      setLiveData({
        totalFunds: dashboardData.totalFunds ?? 0,
        generalFunds: dashboardData.generalFunds ?? 0,
        campaignFunds: dashboardData.campaignFunds ?? 0,
        onlineFunds: dashboardData.onlineFunds ?? 0,
        offlineFunds: dashboardData.offlineFunds ?? 0,
        totalDonationsCount: dashboardData.totalDonationsCount ?? 0,
        generalDonationsCount: dashboardData.generalDonationsCount ?? 0,
        campaignDonationsCount: dashboardData.campaignDonationsCount ?? 0,
        offlineDonationsCount: dashboardData.offlineDonationsCount ?? 0,
        activeCampaign: dashboardData.activeCampaign ?? 0,
        totalMembers: dashboardData.totalMembers ?? 0,
        liveEvents: dashboardData.liveEvents ?? dashboardData.activeCampaign ?? 0,
      });
    }
  }, [dashboardData]);

  // Instant live update listener on SSE donation event: 0ms optimistic bump + background reconciliation
  React.useEffect(() => {
    let debounceRefetchTimer: NodeJS.Timeout | null = null;

    const handleLiveDonation = (e: Event) => {
      const customEvent = e as CustomEvent;
      const payload = customEvent.detail;
      const donationAmount = Number(payload?.amount) || 0;

      if (donationAmount > 0) {
        setLiveData((prev) => {
          const isOffline = payload?.type === "offline";
          const isCampaign = Boolean(
            payload?.campaignTitle && payload.campaignTitle !== "General Welfare Fund"
          );
          return {
            ...prev,
            totalFunds: prev.totalFunds + donationAmount,
            onlineFunds: !isOffline ? prev.onlineFunds + donationAmount : prev.onlineFunds,
            offlineFunds: isOffline ? prev.offlineFunds + donationAmount : prev.offlineFunds,
            generalFunds: !isCampaign ? prev.generalFunds + donationAmount : prev.generalFunds,
            campaignFunds: isCampaign ? prev.campaignFunds + donationAmount : prev.campaignFunds,
            totalDonationsCount: prev.totalDonationsCount + 1,
            generalDonationsCount: !isCampaign
              ? prev.generalDonationsCount + 1
              : prev.generalDonationsCount,
            campaignDonationsCount: isCampaign
              ? prev.campaignDonationsCount + 1
              : prev.campaignDonationsCount,
          };
        });
      }

      // Debounce server reconciliation during high-frequency donation bursts
      if (debounceRefetchTimer) clearTimeout(debounceRefetchTimer);
      debounceRefetchTimer = setTimeout(() => {
        refetchDashboard();
        refetchDist();
        refetchMonthly();
      }, 400);
    };

    window.addEventListener("admin-realtime:donation", handleLiveDonation);
    return () => {
      window.removeEventListener("admin-realtime:donation", handleLiveDonation);
      if (debounceRefetchTimer) clearTimeout(debounceRefetchTimer);
    };
  }, [refetchDashboard, refetchDist, refetchMonthly]);

  const cards = [
    {
      title: "Total Funds",
      numericValue: liveData.totalFunds,
      prefix: "₹",
      decimals: 2,
      showTrend: true,
      icon: <FaMoneyBillWave size={24} />,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      title: "Active Campaigns",
      numericValue: liveData.activeCampaign,
      prefix: "",
      decimals: 0,
      showTrend: false,
      icon: <FaClipboardList size={24} />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Members",
      numericValue: liveData.totalMembers,
      prefix: "",
      decimals: 0,
      showTrend: false,
      icon: <FaUsers size={24} />,
      color: "from-yellow-300 to-yellow-500",
    },
    {
      title: "Live Events",
      numericValue: liveData.liveEvents,
      prefix: "",
      decimals: 0,
      showTrend: false,
      icon: <FaCalendarAlt size={24} />,
      color: "from-green-300 to-green-500",
    },
  ];

  const donationCards = [
    {
      title: "General Donations",
      numericValue: liveData.generalFunds,
      numericCount: liveData.generalDonationsCount,
      countLabel: "donations",
      icon: <FaHandHoldingHeart size={20} className="text-purple-600" />,
      bg: "bg-[#faf5ff] border-[#e9d5ff]",
      titleColor: "text-purple-700",
      countColor: "text-purple-600/80",
    },
    {
      title: "Campaign Donations",
      numericValue: liveData.campaignFunds,
      numericCount: liveData.campaignDonationsCount,
      countLabel: "donations",
      icon: <MdCampaign size={22} className="text-blue-600" />,
      bg: "bg-[#f0f7ff] border-[#bfdbfe]",
      titleColor: "text-blue-700",
      countColor: "text-blue-600/80",
    },
    {
      title: "Online Collections",
      numericValue: liveData.onlineFunds,
      numericCount: liveData.totalDonationsCount,
      countLabel: "total donors",
      icon: <FaMoneyBillWave size={20} className="text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-200",
      titleColor: "text-emerald-700",
      countColor: "text-emerald-600/80",
    },
    {
      title: "Offline Collections",
      numericValue: liveData.offlineFunds,
      numericCount: liveData.offlineDonationsCount,
      countLabel:
        liveData.offlineDonationsCount > 0
          ? "verified collections"
          : "Verified collections",
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



  return (
    <div className="w-full min-w-0">
      <Breadcrumb lable="Dashboard" />

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {isLoading
          ? [1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="bg-gray-200/80 animate-pulse rounded-xl p-4 sm:p-5 h-[88px]"
              />
            ))
          : cards.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, y: -4 }}
            className={`bg-gradient-to-r ${card.color} text-white rounded-xl shadow-md p-3 sm:p-4 lg:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer min-w-0`}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white backdrop-blur-xs">
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-xs sm:text-sm font-medium opacity-90 truncate"
                title={card.title}
              >
                {card.title}
              </h3>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold mt-0.5 truncate flex items-center">
                <RollingCounter
                  value={card.numericValue}
                  prefix={card.prefix}
                  decimals={card.decimals}
                  showTrend={card.showTrend}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Unified Donation Metrics Overview */}
      <div className="mt-6 sm:mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {isLoading
            ? [1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="bg-gray-100 animate-pulse rounded-xl p-3 sm:p-3.5 lg:p-4 h-[76px] border border-gray-200/70"
                />
              ))
            : donationCards.map((dCard, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -3 }}
              className={`rounded-xl shadow-xs border p-3 sm:p-3.5 lg:p-4 flex items-center gap-2.5 sm:gap-3 transition-shadow min-w-0 ${dCard.bg}`}
            >
              <div className="p-2 sm:p-2.5 rounded-lg bg-white shadow-xs border border-gray-100 shrink-0">
                {dCard.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-semibold truncate ${dCard.titleColor}`}
                  title={dCard.title}
                >
                  {dCard.title}
                </p>
                <div className="text-sm sm:text-base lg:text-lg font-bold truncate text-gray-900 mt-0.5 flex items-center">
                  <RollingCounter
                    value={dCard.numericValue}
                    prefix="₹"
                    decimals={2}
                    showTrend={false}
                    className="text-gray-900"
                  />
                </div>
                <div
                  className={`text-[10px] sm:text-[11px] font-medium truncate flex items-center gap-1 ${dCard.countColor}`}
                >
                  <RollingCounter
                    value={dCard.numericCount}
                    decimals={0}
                    showTrend={false}
                  />
                  <span>{dCard.countLabel}</span>
                </div>
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
        className="bg-white p-4 sm:p-6 rounded-xl mt-6 sm:mt-8 w-full grid grid-cols-1 xl:grid-cols-2 gap-6 shadow-xs border border-gray-100"
      >
        {/* Campaign Distribution Pie Chart */}
        <div className="w-full min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 font-semibold">
              Campaign Distribution
            </h2>
            {campaignDistData?.total !== undefined &&
              campaignDistData.total > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Total: ₹{campaignDistData.total.toLocaleString("en-IN")}
                </span>
              )}
          </div>
          <DonationPieChart
            data={campaignDistData?.distribution}
            total={campaignDistData?.total}
            isLoading={isDistLoading}
            isError={isDistError}
            onRetry={refetchDist}
          />
        </div>

        {/* Funds Raised Monthly Bar Chart */}
        <div className="w-full min-w-0">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-gray-500 font-semibold text-sm sm:text-base">
                Funds Raised (Monthly)
              </h2>
              {monthlyFundsData?.totalYearFunds !== undefined && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                  Total: ₹
                  {monthlyFundsData.totalYearFunds.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-gray-500 shrink-0">Year:</span>
              <div className="w-28 sm:w-32">
                <DateSelect
                  showYearPicker
                  value={
                    selectedYear
                      ? String(selectedYear)
                      : monthlyFundsData?.year
                      ? String(monthlyFundsData.year)
                      : String(new Date().getFullYear())
                  }
                  onChange={(val) => {
                    const parsed = parseInt(val, 10);
                    setSelectedYear(!isNaN(parsed) && parsed > 0 ? parsed : undefined);
                  }}
                  clearable={false}
                />
              </div>
            </div>
          </div>

          {isMonthlyLoading ? (
            <div className="h-[300px] flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-primaryColor rounded-full animate-spin" />
              <p className="text-xs text-gray-400">
                Loading monthly funds data...
              </p>
            </div>
          ) : isMonthlyError ? (
            <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-center p-4">
              <p className="text-sm text-red-500 font-medium">
                Failed to load monthly funds data.
              </p>
              <button
                onClick={() => refetchMonthly()}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : !monthlyFundsData?.monthly ||
            monthlyFundsData.monthly.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-400">
              No monthly fund records found for{" "}
              {selectedYear ?? monthlyFundsData?.year ?? "selected year"}.
            </div>
          ) : (
            <div className="w-full h-[300px] outline-none select-none [&_.recharts-wrapper]:outline-none [&_.recharts-wrapper:focus]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-surface:focus]:outline-none [&_svg]:outline-none [&_svg:focus]:outline-none [&_*]:outline-none">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyFundsData.monthly}
                  margin={{ top: 15, right: 15, left: 10, bottom: 25 }}
                  barCategoryGap="30%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    width={64}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    tickFormatter={(val: number) => {
                      if (val >= 10000000)
                        return `₹${(val / 10000000).toFixed(val % 10000000 === 0 ? 0 : 1)}Cr`;
                      if (val >= 100000)
                        return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L`;
                      return `₹${Number(val).toLocaleString("en-IN")}`;
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--gray-100)" }}
                    formatter={(value: number) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Funds Raised",
                    ]}
                    labelFormatter={(label: string) => `Month: ${label}`}
                  />
                  <Bar
                    dataKey="funds"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={24}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {monthlyFundsData.monthly.map((entry, index) => (
                      <Cell
                        key={index}
                        fill="var(--primaryColor)"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.fill = "var(--yellow-50)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.fill = "var(--primaryColor)")
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
