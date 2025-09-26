import type { StatCardProps } from "../types/ComponentTypes";
const StatCard = ({ icon, label, value, bg }: StatCardProps) => {
  return (
    <div
      className={`border border-gray rounded-lg shadow p-5 flex items-center`}
    >
      <div className={`${bg} p-3 rounded-lg mr-4`}>{icon}</div>
      <div>
        <h3 className="text-sm text-gray-500">{label}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
