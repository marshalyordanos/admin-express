import { useState, useEffect } from "react";
import { Skeleton } from "antd";
import api from "@/lib/api/api";

// TYPES
interface AgentPerformance {
  id: string;
  region: string;
  avgTime: string;
  status: "Completed" | "Failed";
  onTimePercent: number;
}

interface DriverApi {
  driverId: string;
  driverName: string;
  branch: string;
  handledOrders: number;
  pickupHandled: number;
  deliveryHandled: number;
  completedOrders: number;
  failedOrders: number;
  avgTimePerKm: number;
  onTimePercent: number;
  performanceStatus: "Good" | "Underperforming";
}

// STATUS BADGE
type StatusBadgeProps = {
  status: "Completed" | "Failed";
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const color =
    status === "Completed"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

// MAIN COMPONENT
const Agent = () => {
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // FETCH DATA
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/report/dashboard/driver-performance");

      const apiData: DriverApi[] = res.data.data;

      // Map API → UI format
      const mapped: AgentPerformance[] = apiData.map((driver) => ({
        id: driver.driverId,
        region: driver.branch,
        avgTime: driver.avgTimePerKm
          ? `${driver.avgTimePerKm} min/km`
          : "N/A",
        status: driver.performanceStatus === "Good" ? "Completed" : "Failed",
        onTimePercent: driver.onTimePercent,
      }));

      setAgents(mapped);
    } catch (error) {
      console.error("Error fetching driver performance", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="w-full bg-white p-6 font-text">
      <p className="text-base font-semibold text-black mb-4">
        Driver / Agent Performance
      </p>

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-black text-sm">
                <th className="py-3 px-4">Agent ID</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Avg. Delivery Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">On-Time Delivery %</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-gray transition">
                  <td className="py-3 px-4 font-medium text-sm">{agent.id}</td>
                  <td className="py-3 px-4 text-sm">{agent.region}</td>
                  <td className="py-3 px-4 text-sm">{agent.avgTime}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={agent.status} />
                  </td>
                  <td className="py-3 px-4 text-sm">{agent.onTimePercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Agent;
