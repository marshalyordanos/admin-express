import { useQuery } from "@tanstack/react-query";
import { fetchDashboardMetrics, type ReportFilters, type DashboardMetrics } from "@/lib/api/report";

export const useReportMetrics = (filters: ReportFilters) => {
  return useQuery<DashboardMetrics, Error>({
    queryKey: ["reportMetrics", filters],
    queryFn: () => fetchDashboardMetrics(filters),
    staleTime: 5 * 60 * 1000,
  });
};
