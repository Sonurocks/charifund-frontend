// components/DonationPieChart.tsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaUser } from "react-icons/fa";
import { DonationPieChartProps } from "@/src/types/admin";



const defaultColors = ["var(--primaryColor)", "var(--blue)", "var(--lime-green)", "var(--purple)", "var(--red)", "var(--brown)"];

const DonationPieChart: React.FC<DonationPieChartProps> = ({ data, colors = defaultColors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-1 w-full gap-4 ">
      {/* Donut Chart */}
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
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  stroke="none"
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>


      <div className="flex flex-wrap gap-1 w-full">
        {data.map((entry, index) => {
          const percentage = total === 0 ? 0 : ((entry.value / total) * 100).toFixed(0);
          return (
            <div
              key={index}
              className="flex items-center gap-2 p-2  rounded-md min-w-[140px] sm:min-w-[160px] flex-grow"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span className="font-semibold text-sm">{entry.name}</span>
              <span className="text-sm text-black font-semibold">{percentage}%</span>
              <FaUser className="text-gray-500" />
              <span className="text-sm text-gray-600">{entry.value}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default DonationPieChart;
