import type { AgentPerformance } from "../types";

const agents: AgentPerformance[] = [
  {
    id: "AGT-1001",
    region: "Addis Ababa",
    avgTime: "32 min",
    status: "Completed",
    onTimePercent: 95,
  },
  {
    id: "AGT-1002",
    region: "Addis Ababa",
    avgTime: "45 min",
    status: "Failed",
    onTimePercent: 60,
  },
  {
    id: "AGT-1003",
    region: "Addis Ababa",
    avgTime: "28 min",
    status: "Completed",
    onTimePercent: 98,
  },
  {
    id: "AGT-1004",
    region: "Addis Ababa",
    avgTime: "50 min",
    status: "Failed",
    onTimePercent: 55,
  },
  {
    id: "AGT-1005",
    region: "Addis Ababa",
    avgTime: "35 min",
    status: "Completed",
    onTimePercent: 92,
  },
];
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

const Agent = () => {
  return (
    <div className="w-full bg-white p-6 font-text">
      <p className="text-base font-semibold text-black mb-4">
        Driver / Agent Performance
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse rounded-lg">
          <thead>
            <tr className="bg-gray text-black text-sm">
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
    </div>
  );
};

export default Agent;
