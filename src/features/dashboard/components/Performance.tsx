import { useState, useEffect } from "react";
import { FaChartLine, FaChevronDown } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { BranchData } from "../types";

const Performance = () => {
  const data: BranchData[] = [
    {
      name: "Addis Ababa",
      completed: 1200,
      delayed: 45,
      revenue: 85000,
      efficiency: 96,
      trend: "up",
    },
    {
      name: "Dire Dawa",
      completed: 950,
      delayed: 30,
      revenue: 60000,
      efficiency: 97,
      trend: "up",
    },
    {
      name: "Mekelle",
      completed: 780,
      delayed: 50,
      revenue: 40000,
      efficiency: 94,
      trend: "down",
    },
    {
      name: "Bahir Dar",
      completed: 670,
      delayed: 25,
      revenue: 38000,
      efficiency: 96,
      trend: "up",
    },
    {
      name: "Hawassa",
      completed: 800,
      delayed: 40,
      revenue: 42000,
      efficiency: 95,
      trend: "up",
    },
  ];

  const [branch1, setBranch1] = useState<string>("Addis Ababa");
  const [branch2, setBranch2] = useState<string>("Dire Dawa");
  const [selectedMetric, setSelectedMetric] = useState<string>("completed");
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBars(true);
      console.log(animateBars);
    }, 300);
    return () => clearTimeout(timer);
  }, [branch1, branch2, selectedMetric]);

  const selectedBranches = [
    data.find((b) => b.name === branch1),
    data.find((b) => b.name === branch2),
  ].filter(Boolean) as BranchData[];

  const chartData = selectedBranches.map((branch) => ({
    name: branch.name,
    completed: branch.completed,
    delayed: branch.delayed,
    revenue: branch.revenue / 1000,
    efficiency: branch.efficiency,
  }));

  const formatTooltip = (value: number, name: string) => {
    if (name === "revenue") return [`$${value.toLocaleString()}K`, "Revenue"];
    if (name === "completed") return [value.toLocaleString(), "Completed"];
    if (name === "delayed") return [value.toLocaleString(), "Delayed"];
    if (name === "efficiency") return [`${value}%`, "Efficiency"];
    return [value, name];
  };

  const formatYAxis = (value: number): string => {
    if (selectedMetric === "revenue") return `$${value}K`;
    if (selectedMetric === "efficiency") return `${value}%`;
    return value.toString();
  };

  const getComparison = (metric: keyof BranchData) => {
    if (selectedBranches.length < 2) return null;

    const val1 = selectedBranches[0][metric] as number;
    const val2 = selectedBranches[1][metric] as number;
    const diff = val1 - val2;
    const percentDiff = (diff / val2) * 100;

    return {
      value: Math.abs(diff).toLocaleString(),
      percent: Math.abs(percentDiff).toFixed(1),
      isBetter: diff > 0,
    };
  };

  const comparison = getComparison(selectedMetric as keyof BranchData);

  return (
    <div className="w-full bg-white p-6 font-text">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <p className="text-base font-bold text-gray0 mb-4 md:mb-0">
          Branch Performance Comparison
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="appearance-none bg-white font-text font-medium py-2 pl-4 pr-8 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            >
              <option value="completed">Completed Deliveries</option>
              <option value="delayed">Delayed Deliveries</option>
              <option value="revenue">Revenue</option>
              <option value="efficiency">Efficiency</option>
            </select>
            <FaChevronDown
              className="absolute right-3 top-3 text-blue-500 pointer-events-none"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* Branch selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <select
            value={branch1}
            onChange={(e) => setBranch1(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
          >
            {data.map((branch, index) => (
              <option key={index} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={branch2}
            onChange={(e) => setBranch2(e.target.value)}
            className="w-full border border-gray rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
          >
            {data.map((branch, index) => (
              <option key={index} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Comparison */}
      {selectedBranches.length === 2 && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-gray">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaChartLine className="text-blue-500" />
            <h3 className="font-semibold text-blue-700">Comparison Results</h3>
          </div>
          {comparison && (
            <p className="text-center text-gray-700">
              <span className="font-bold">{branch1}</span> has{" "}
              <span
                className={`font-bold ${
                  comparison.isBetter ? "text-green-600" : "text-red-600"
                }`}
              >
                {comparison.value} {selectedMetric === "revenue" ? "$" : ""}
              </span>{" "}
              {comparison.isBetter ? "more" : "less"} {selectedMetric} than{" "}
              <span className="font-bold">{branch2}</span>{" "}
              <span
                className={`font-semibold ${
                  comparison.isBetter ? "text-green-600" : "text-red-600"
                }`}
              >
                ({comparison.percent}%{" "}
                {comparison.isBetter ? "higher" : "lower"})
              </span>
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="flex gap-4">
        <div className="w-2/4">
          {selectedBranches.length === 2 ? (
            <div className="h-80 grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBranches.map((branch, index) => (
                <div
                  key={index}
                  className="p-5 border rounded-lg shadow border-gray"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-bold text-black">
                      {branch.name}
                    </h3>
                    <div
                      className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        branch.trend === "up"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {branch.trend === "up" ? "↑ Improving" : "↓ Declining"}
                    </div>
                  </div>
                  <div className="space-y-4 text-sm text-black">
                    <div className="flex items-center justify-between p-2">
                      <p>Completed</p>
                      <p>{branch.completed.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <p>Delayed</p>
                      <p>{branch.delayed.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <p>Revenue</p>
                      <p>${branch.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <p>Efficiency</p>
                      <p>{branch.efficiency}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray rounded-lg border border-dashed border-gray-300">
              <FaChartLine className="mx-auto text-gray-400 mb-3" size={24} />
              <p className="text-gray-500">
                Select{" "}
                <span className="font-semibold text-blue-600">
                  two branches
                </span>{" "}
                to compare performance metrics.
              </p>
            </div>
          )}
        </div>
        <div className="w-2/4">
          {selectedBranches.length === 2 && (
            <div className="h-80 bg-white p-4 rounded-lg border border-gray">
              <h3 className="text-base font-bold text-black mb-4 text-center">
                {selectedMetric.charAt(0).toUpperCase() +
                  selectedMetric.slice(1)}{" "}
                Comparison
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatYAxis} />
                  <Tooltip formatter={formatTooltip} />
                  <Legend />
                  <Bar
                    dataKey={selectedMetric}
                    name={
                      selectedMetric.charAt(0).toUpperCase() +
                      selectedMetric.slice(1)
                    }
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#3b82f6" : "#10b981"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
