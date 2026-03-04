export const ReportPreset = {
  TODAY: "TODAY",
  YESTERDAY: "YESTERDAY",
  THIS_WEEK: "THIS_WEEK",
  LAST_WEEK: "LAST_WEEK",
  THIS_MONTH: "THIS_MONTH",
  LAST_MONTH: "LAST_MONTH",
  CUSTOM: "CUSTOM",
} as const;

export type ReportPreset = (typeof ReportPreset)[keyof typeof ReportPreset];

export interface ReportFilters {
  preset: ReportPreset;
  startDate?: string;
  endDate?: string;
  branchId?: string;
  serviceType?: "STANDARD" | "EXPRESS" | "SAME_DAY" | "OVERNIGHT";
  shippingScope?: "REGIONAL" | "TOWN" | "INTERNATIONAL";
  fulfillmentType?: "PICKUP" | "DROPOFF";
  status?: "CREATED" | "APPROVED" | "DISPATCHED" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED";
  topLimit?: number;
  recentLimit?: number;
  revenueGroupBy?: "day" | "week" | "month";
}

export interface OrderReportFilters {
  startDate?: string;
  endDate?: string;
  dateField?: "createdAt" | "pickupDate" | "deliveryDate";
  page?: number;
  limit?: number;
  search?: string;
  groupBy?: "day" | "week" | "month";
  status?: string;
  statuses?: string[];
  serviceType?: "STANDARD" | "EXPRESS" | "SAME_DAY" | "OVERNIGHT";
  shippingScope?: "REGIONAL" | "TOWN" | "INTERNATIONAL";
  fulfillmentType?: "PICKUP" | "DROPOFF";
  shipmentType?: "PARCEL" | "CARRIER";
  branchId?: string;
  customerId?: string;
  receiverId?: string;
  pickupDriverId?: string;
  deliveryDriverId?: string;
  tariffId?: string;
  batchId?: string;
  export?: boolean;
  paymentStatus?: string;
  paymentMethod?: string;
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
  isFragile?: boolean;
  isUnusual?: boolean;
  pickupConfirmed?: boolean;
  dropoffConfirmed?: boolean;
  originCityId?: string;
  destinationCityId?: string;
  lateDeliveryOnly?: boolean;
}

export interface OrderReportItem {
  id: string;
  trackingCode: string;
  status: string;
  serviceType: string;
  fulfillmentType: string;
  shippingScope: string;
  shipmentType: string;
  weight: number;
  finalPrice: number;
  currency: string;
  originCityRaw: string;
  destinationCityRaw: string;
  pickupDate: string;
  deliveryDate: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  receiver?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface OrderReportPagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderReportSummary {
  data: OrderReportItem[];
  totalRevenue: number;
  totalOrders?: number;
}

export interface OrderReportResponse {
  summary: OrderReportSummary;
  pagination: OrderReportPagination;
}

export interface DashboardSummary {
  totalOrders: number;
  totalRevenue: number;
  totalDelivered: number;
  activeDrivers: number;
}

export interface TopBranch {
  id: string;
  name: string;
  orderCount: number;
  revenue: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  orderCount: number;
  revenue: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
}

export interface RevenueTrend {
  period: string;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  trackingCode: string;
  customerId: string;
  receiverId: string;
  branchId: string | null;
  pickupDriverId: string | null;
  deliveryDriverId: string | null;
  status: string;
  serviceType: string;
  fulfillmentType: string;
  weight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  category: string[];
  isFragile: boolean;
  shipmentType: string;
  shippingScope: string;
  isUnusual: boolean;
  unusualReason: string | null;
  pickupAddressId: string | null;
  pickupDate: string;
  deliveryAddressId: string;
  deliveryDate: string;
  pickupConfirmed: boolean;
  dropoffConfirmed: boolean;
  actualPickupDate: string | null;
  actualDropoffDate: string | null;
  notes: string | null;
  cost: number;
  distance: number;
  validatedBy: string | null;
  validatedAt: string | null;
  validatedNotes: string | null;
  quantity: number;
  originCityId: string | null;
  destinationCityId: string | null;
  originCityRaw: string;
  destinationCityRaw: string;
  pickupAssignedBy: string | null;
  pickupAssignedAt: string | null;
  deliveryAssignedBy: string | null;
  deliveryAssignedAt: string | null;
  estimatedDeliveryAt: string | null;
  actualDeliveryAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  batchId: string | null;
  tariffId: string;
  finalPrice: number;
  currency: string;
  optimizationJobId: string | null;
  customer: {
    name: string;
  };
}

export interface DashboardMetrics {
  summary: DashboardSummary;
  topBranches: TopBranch[];
  topCustomers: TopCustomer[];
  orderStatusDistribution: OrderStatusDistribution[];
  revenueTrend: RevenueTrend[];
  recentOrders: RecentOrder[];
}

export interface RevenueReportFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string;
  groupBy?: "day" | "week" | "month";
  export?: boolean;
  revenueType?: "gross" | "net";
  currency?: string;
  branchId?: string;
  serviceType?: "STANDARD" | "EXPRESS" | "SAME_DAY" | "OVERNIGHT";
  fulfillmentType?: "PICKUP" | "DROPOFF";
  shippingScope?: "REGIONAL" | "TOWN" | "INTERNATIONAL";
  driverId?: string;
  customerId?: string;
  tariffId?: string;
  deliveredOnly?: boolean;
  lateOnly?: boolean;
  onTimeOnly?: boolean;
}

export interface RevenueReportOrderItem {
  orderId: string;
  trackingCode: string;
  customer: string | null;
  receiver: string | null;
  gross: number | null;
  net: number | null;
  revenue: number | null;
  group_key: string;
  driverEarnings: number | null;
}

export interface RevenueReportGroup {
  group_key: string;
  total_revenue: number;
  total_orders: number;
  total_driver_earnings: number;
  orders: RevenueReportOrderItem[];
}

export type RevenueReportResponse = RevenueReportGroup[];
