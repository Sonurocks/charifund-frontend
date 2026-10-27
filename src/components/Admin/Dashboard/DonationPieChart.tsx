// components/DonationPieChart.tsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FaUser } from "react-icons/fa";
import { DonationPieChartProps } from "@/src/types/admin";

const defaultColors = [
  "var(--primaryColor)",
  "var(--blue)",
  "var(--lime-green)",
  "var(--purple)",
  "var(--red)",
  "var(--brown)",
  "#0d9488", // teal-600
  "#ea580c", // orange-600
  "#db2777", // pink-600
  "#4f46e5", // indigo-600
];

const DonationPieChart: React.FC<DonationPieChartProps> = ({
  data = [],
  total,
  isLoading = false,
  isError = false,
  onRetry,
  colors = defaultColors,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[260px] gap-4">
        <div className="w-40 h-40 rounded-full border-4 border-gray-100 border-t-primaryColor animate-spin" />
        <div className="flex gap-2">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[260px] p-4 text-center">
        <p className="text-sm text-red-500 font-medium">Failed to load campaign distribution.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full min-h-[260px] text-sm text-gray-400">
        No campaign distribution data recorded.
      </div>
    );
  }

  const totalAmount = total ?? data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Donut / Pie Chart */}
      <div className="w-full h-[200px] [&_.recharts-sector:focus]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={75}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.campaignId ?? index}
                  stroke="none"
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              allowEscapeViewBox={{ x: false, y: false }}
              wrapperStyle={{ zIndex: 40, pointerEvents: "none" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  return (
                    <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-lg shadow-lg border border-gray-200 text-xs max-w-[170px] sm:max-w-[220px] break-words pointer-events-none">
                      <p className="font-semibold text-gray-800 leading-snug">
                        {item.name}
                      </p>
                      <p className="text-gray-900 font-bold mt-1">
                        ₹{Number(item.value).toLocaleString("en-IN")}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-1 w-full">
        {data.map((entry, index) => {
          const percentage =
            totalAmount > 0
              ? ((entry.value / totalAmount) * 100).toFixed(0)
              : "0";

          return (
            <div
              key={entry.campaignId ?? index}
              className="flex items-center gap-2 p-2 rounded-md min-w-[140px] sm:min-w-[160px] flex-grow"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span
                className="font-semibold text-sm truncate max-w-[130px]"
                title={entry.name}
              >
                {entry.name}
              </span>
              <span className="text-sm text-black font-semibold">
                {percentage}%
              </span>
              <FaUser className="text-gray-500 flex-shrink-0 text-xs" />
              <span className="text-sm text-gray-600">
                {entry.donorCount ?? entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonationPieChart;

