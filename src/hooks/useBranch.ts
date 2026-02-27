import { useQuery } from "@tanstack/react-query";
import { fetchBranches, type ListBranchesParams } from "@/lib/api/branch";
import type { BranchListResponse } from "@/types/types";

export const useBranches = (params: ListBranchesParams = {}) => {
  return useQuery<BranchListResponse, Error>({
    queryKey: ["branches", params],
    queryFn: () => fetchBranches(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
