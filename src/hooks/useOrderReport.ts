import { useQuery } from "@tanstack/react-query";
import {
  fetchOrderReportDetailed,
  type OrderReportFilters,
  type OrderReportResponse,
} from "@/lib/api/report";

export const useOrderReport = (filters: OrderReportFilters) => {
  return useQuery<OrderReportResponse, Error>({
    queryKey: ["orderReportDetailed", filters],
    queryFn: () => fetchOrderReportDetailed(filters),
    staleTime: 5 * 60 * 1000,
  });
};

