import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import type { CustomTooltipProps, SalesData } from "../types";

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900/90 border border-slate-700 flex flex-col gap-2 rounded-lg shadow-xl">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-sm text-blue-400">
          Revenue: <span className="ml-2">${payload[0].value}</span>
        </p>
        <p className="text-sm text-indigo-400">
          Profit: <span className="ml-2">${payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const dailyData: SalesData[] = Array.from({ length: 7 }, (_, i) => ({
  name: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * 120 + 50),
  profit: Math.floor(Math.random() * 80 + 20),
}));

const weeklyData: SalesData[] = [
  { name: "Week 1", revenue: 400, profit: 200 },
  { name: "Week 2", revenue: 600, profit: 300 },
  { name: "Week 3", revenue: 550, profit: 280 },
  { name: "Week 4", revenue: 700, profit: 350 },
];

const monthlyData: SalesData[] = [
  { name: "Jan", revenue: 110, profit: 90 },
  { name: "Feb", revenue: 70, profit: 60 },
  { name: "Mar", revenue: 150, profit: 105 },
  { name: "Apr", revenue: 95, profit: 35 },
  { name: "May", revenue: 105, profit: 60 },
  { name: "Jun", revenue: 95, profit: 40 },
  { name: "Jul", revenue: 100, profit: 25 },
  { name: "Aug", revenue: 115, profit: 50 },
  { name: "Sep", revenue: 100, profit: 65 },
  { name: "Oct", revenue: 90, profit: 55 },
  { name: "Nov", revenue: 115, profit: 55 },
  { name: "Dec", revenue: 60, profit: 40 },
];

const Revenue = () => {
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("monthly");

  // Choose dataset based on selected view
  const data =
    view === "daily" ? dailyData : view === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="w-full h-96 pt-6 font-text">
      <div className="flex items-center justify-between pb-6">
        <p className="font-semibold text-base">Revenue Trends</p>
        {/* Switcher */}
        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((option) => (
            <button
              key={option}
              onClick={() => setView(option as typeof view)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                view === option
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ right: 20, left: 0, bottom: 0 }}>
          {/* Gradient fills */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            axisLine={false}
            tickLine={false}
          />
          <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Revenue Area */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />

          {/* Profit Area */}
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorProfit)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Revenue;
