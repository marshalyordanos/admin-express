import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardCustomers,
  type DashboardCustomersReportFilters,
  type DashboardCustomersReportResponse,
} from "@/lib/api/report";

export const useDashboardCustomers = (filters: DashboardCustomersReportFilters) => {
  return useQuery<DashboardCustomersReportResponse, Error>({
    queryKey: ["dashboardCustomersReport", filters],
    queryFn: () => fetchDashboardCustomers(filters),
    staleTime: 5 * 60 * 1000,
  });
};
