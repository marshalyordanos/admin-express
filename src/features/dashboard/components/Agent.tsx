import { useState, useEffect } from "react";
import { Skeleton, Pagination } from "antd";
import api from "@/lib/api/api";

// TYPES
interface AgentPerformance {
  id: string;
  agentId: string;
  driverName: string;
  region: string;
  handledOrders: number;
  completedOrders: number;
  failedOrders: number;
  avgTime: string;
  status: "Completed" | "Failed";
  onTimePercent: number;
}

interface DriverApi {
  driverId: string;
  driverCustomId: string;
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // FETCH DATA
  const fetchAgents = async (page = 1, pageSizeValue = 10) => {
    try {
      setLoading(true);
      const res = await api.get("/report/dashboard/driver-performance", {
        params: { page, pageSize: pageSizeValue },
      });

      const apiData: DriverApi[] = res.data.data;
      const pagination = res.data.pagination;

      // Map API → UI format
      const mapped: AgentPerformance[] = apiData.map((driver) => ({
        id: driver.driverCustomId,
        agentId: driver.driverCustomId,
        driverName: driver.driverName,
        region: driver.branch,
        handledOrders: driver.handledOrders,
        completedOrders: driver.completedOrders,
        failedOrders: driver.failedOrders,
        avgTime: driver.avgTimePerKm
          ? `${driver.avgTimePerKm} min/km`
          : "N/A",
        status: driver.performanceStatus === "Good" ? "Completed" : "Failed",
        onTimePercent: driver.onTimePercent,
      }));

      setAgents(mapped);
      setTotal(pagination?.total ?? 0);
    } catch (error) {
      console.error("Error fetching driver performance", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  return (
    <div className="w-full bg-white p-6 font-text">
      <p className="text-base font-semibold text-black mb-4">
        Driver / Agent Performance
      </p>

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-black text-sm">
                  <th className="py-3 px-4">Agent ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Handled Orders</th>
                  <th className="py-3 px-4">Completed</th>
                  <th className="py-3 px-4">Failed</th>
                  <th className="py-3 px-4">Avg. Delivery Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">On-Time Delivery %</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id} className="border-b border-gray transition">
                    <td className="py-3 px-4 font-medium text-sm">{agent.agentId}</td>
                    <td className="py-3 px-4 text-sm">{agent.driverName}</td>
                    <td className="py-3 px-4 text-sm">{agent.region}</td>
                    <td className="py-3 px-4 text-sm">{agent.handledOrders}</td>
                    <td className="py-3 px-4 text-sm">{agent.completedOrders}</td>
                    <td className="py-3 px-4 text-sm">{agent.failedOrders}</td>
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
          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['10', '20', '50', '100']}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Agent;
