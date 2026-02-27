import api from "./api";
import type {
  ReportFilters,
  DashboardMetrics,
} from "@/types/report";

export { ReportPreset } from "@/types/report";
export type { ReportFilters, DashboardMetrics } from "@/types/report";

export const fetchDashboardMetrics = async (
  filters: ReportFilters
): Promise<DashboardMetrics> => {
  const response = await api.post("/report/dashboard/metrics", filters);
  
  console.log("Dashboard Metrics Full Response:", JSON.stringify(response.data, null, 2));
  console.log("Dashboard Metrics Data:", response.data);
  console.log("Dashboard Metrics Data.data:", response.data.data);
  
  return response.data.data || response.data;
};
