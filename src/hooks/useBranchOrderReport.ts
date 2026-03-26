import { useQuery } from "@tanstack/react-query";
import {
  fetchBranchOrderReportDetailed,
  type BranchOrderReportFilters,
  type BranchOrderReportResponse,
} from "@/lib/api/report";

export const useBranchOrderReport = (
  branchId: string | undefined,
  filters: BranchOrderReportFilters,
) => {
  return useQuery<BranchOrderReportResponse, Error>({
    queryKey: ["branchOrderReportDetailed", branchId, filters],
    queryFn: () => fetchBranchOrderReportDetailed(branchId!, filters),
    enabled: Boolean(branchId?.trim()),
    staleTime: 5 * 60 * 1000,
  });
};
