import { useQuery } from "@tanstack/react-query";
import {
  fetchRevenueReport,
  type RevenueReportFilters,
  type RevenueReportResponse,
} from "@/lib/api/report";

export const useRevenueReport = (filters: RevenueReportFilters) => {
  return useQuery<RevenueReportResponse, Error>({
    queryKey: ["revenueReport", filters],
    queryFn: () => fetchRevenueReport(filters),
    staleTime: 5 * 60 * 1000,
  });
};
