import api from "./api";
import type {
  Batch,
  BatchListResponse,
  BatchDetailResponse,
  CreateBatchRequest,
  AddOrdersToBatchRequest,
  AssignOfficerRequest,
  AcceptBatchRequest,
  CategorizedOrdersApiResponse,
  BranchSortOrdersApiResponse,
  ApiResponse,
} from "@/types/types";

export interface ListBatchesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: string | Record<string, any>;
  sort?: string;
}

/**
 * Create a new batch dispatch
 */
export const createBatch = async (
  data: CreateBatchRequest
): Promise<BatchDetailResponse> => {
  const response = await api.post<BatchDetailResponse>("/dispatch/batch", data);
  return response.data;
};

/**
 * Add orders to an existing batch
 */
export const addOrdersToBatch = async (
  batchId: string,
  data: AddOrdersToBatchRequest
): Promise<BatchDetailResponse> => {
  const response = await api.patch<BatchDetailResponse>(
    `/dispatch/add-order/${batchId}`,
    data
  );
  return response.data;
};

/**
 * Get all batches with pagination and filters
 */
export const getBatches = async (
  params?: ListBatchesParams
): Promise<BatchListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.filter) {
    const filterStr =
      typeof params.filter === "string"
        ? params.filter
        : JSON.stringify(params.filter);
    queryParams.append("filter", filterStr);
  }
  if (params?.sort) queryParams.append("sort", params.sort);

  const queryString = queryParams.toString();
  const url = `/dispatch${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<BatchListResponse>(url);
  return response.data;
};

/**
 * Get batches assigned to the logged-in officer
 */
export const getOfficerBatches = async (
  params?: ListBatchesParams
): Promise<BatchListResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.filter) {
    const filterStr =
      typeof params.filter === "string"
        ? params.filter
        : JSON.stringify(params.filter);
    queryParams.append("filter", filterStr);
  }
  if (params?.sort) queryParams.append("sort", params.sort);

  const queryString = queryParams.toString();
  const url = `/dispatch/officer${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<BatchListResponse>(url);
  return response.data;
};

/**
 * Assign officer to batch(es)
 */
export const assignOfficerToBatch = async (
  data: AssignOfficerRequest
): Promise<ApiResponse<{ batches: Batch[] }>> => {
  const response = await api.post<ApiResponse<{ batches: Batch[] }>>(
    "/dispatch/batch/assign-officer",
    data
  );
  return response.data;
};

/**
 * Accept batch(es) by officer
 */
export const acceptBatch = async (
  data: AcceptBatchRequest
): Promise<ApiResponse<Batch>> => {
  const response = await api.post<ApiResponse<Batch>>(
    "/dispatch/accept-batch",
    data
  );
  return response.data;
};

/**
 * Get orders for categorization (grouped by scope and service type)
 */
export const getCategorizedOrders = async (
  params?: ListBatchesParams
): Promise<CategorizedOrdersApiResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.filter) {
    const filterStr =
      typeof params.filter === "string"
        ? params.filter
        : JSON.stringify(params.filter);
    queryParams.append("filter", filterStr);
  }
  if (params?.sort) queryParams.append("sort", params.sort);

  const queryString = queryParams.toString();
  const url = `/order/categorical${queryString ? `?${queryString}` : ""}`;

  const response = await api.get<CategorizedOrdersApiResponse>(url);
  return response.data;
};

/**
 * Get orders for sorting at branch level
 */
export const getBranchSortOrders =
  async (): Promise<BranchSortOrdersApiResponse> => {
    const response = await api.get<BranchSortOrdersApiResponse>(
      "/order/branch/sort-order"
    );
    return response.data;
  };
