import api from "./api";
import type {
  ReportFilters,
  DashboardMetrics,
  OrderReportFilters,
  OrderReportResponse,
  RevenueReportFilters,
  RevenueReportResponse,
} from "@/types/report";

export { ReportPreset } from "@/types/report";
export type {
  ReportFilters,
  DashboardMetrics,
  OrderReportFilters,
  OrderReportResponse,
  RevenueReportFilters,
  RevenueReportResponse,
} from "@/types/report";

export const fetchDashboardMetrics = async (
  filters: ReportFilters,
): Promise<DashboardMetrics> => {
  try {
    const response = await api.post("/report/dashboard/metrics", filters);

    console.log(
      "Dashboard Metrics Full Response:",
      JSON.stringify(response.data, null, 2),
    );
    console.log("Dashboard Metrics Data:", response.data);
    console.log("Dashboard Metrics Data.data:", response.data.data);

    return response.data.data || response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export const fetchOrderReportDetailed = async (
  filters: OrderReportFilters,
): Promise<OrderReportResponse> => {
  try {
    const payload: OrderReportFilters = {
      ...filters,
      startDate: filters.startDate
        ? new Date(filters.startDate).toISOString()
        : undefined,
      endDate: filters.endDate
        ? new Date(filters.endDate).toISOString()
        : undefined,
    };

    const response = await api.post("/report/orders/detailed", payload);

    console.log(
      "Order Detailed Report Full Response:",
      JSON.stringify(response.data, null, 2),
    );

    return response.data.data || response.data;
  } catch (error: unknown) {
    console.error("Order Detailed Report Error:", error);
    if (error && typeof error === "object" && "response" in error) {
      const ax = error as { response?: { data?: { message?: string } } };
      throw new Error(ax.response?.data?.message ?? "Failed to fetch order report");
    }
    throw error;
  }
};

export const fetchRevenueReport = async (
  filters: RevenueReportFilters,
): Promise<RevenueReportResponse> => {
  try {
    const payload: RevenueReportFilters = {
      ...filters,
      startDate: filters.startDate
        ? new Date(filters.startDate).toISOString()
        : undefined,
      endDate: filters.endDate
        ? new Date(filters.endDate).toISOString()
        : undefined,
    };

    const response = await api.post("/report/revenue/detailed", payload);

    console.log(
      "Revenue Report Full Response:",
      JSON.stringify(response.data, null, 2),
    );

    return response.data.data ?? response.data;
  } catch (error: unknown) {
    console.error("Revenue Report Error:", error);
    if (error && typeof error === "object" && "response" in error) {
      const ax = error as { response?: { data?: { message?: string } } };
      throw new Error(ax.response?.data?.message ?? "Failed to fetch revenue report");
    }
    throw error;
  }
};
