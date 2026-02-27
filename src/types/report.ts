export enum ReportPreset {
  TODAY = "TODAY",
  YESTERDAY = "YESTERDAY",
  THIS_WEEK = "THIS_WEEK",
  LAST_WEEK = "LAST_WEEK",
  THIS_MONTH = "THIS_MONTH",
  LAST_MONTH = "LAST_MONTH",
  CUSTOM = "CUSTOM",
}

export interface ReportFilters {
  preset: ReportPreset;
  startDate?: string;
  endDate?: string;
  branchId?: string;
  serviceType?: "STANDARD" | "EXPRESS" | "SAME_DAY" | "OVERNIGHT";
  shippingScope?: "REGIONAL" | "NATIONAL" | "INTERNATIONAL";
  fulfillmentType?: "PICKUP" | "DELIVERY";
  status?: "CREATED" | "APPROVED" | "DISPATCHED" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED";
  topLimit?: number;
  recentLimit?: number;
  revenueGroupBy?: "day" | "week" | "month";
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
