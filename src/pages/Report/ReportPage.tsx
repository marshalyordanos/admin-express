"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Truck,
  Users,
  MapPin,
  BarChart3,
  PieChart,
  FileText,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import { useReportMetrics } from "@/hooks/useReportMetrics";
import { useBranches } from "@/hooks/useBranch";
import { ReportPreset, type ReportFilters } from "@/lib/api/report";
import { format } from "date-fns";

// Mock data
const mockMetrics = {
  totalOrders: 1247,
  totalRevenue: 245680,
  totalDeliveries: 1189,
  activeDrivers: 45,
  pendingOrders: 58,
  completedOrders: 1131,
  revenueChange: 12.5,
  ordersChange: 8.3,
  deliveriesChange: 15.2,
  driversChange: -2.1,
};

const mockOrderStatus = [
  { status: "CREATED", count: 45, percentage: 3.6, color: "bg-blue-500" },
  { status: "APPROVED", count: 123, percentage: 9.9, color: "bg-green-500" },
  { status: "DISPATCHED", count: 234, percentage: 18.8, color: "bg-purple-500" },
  { status: "IN_TRANSIT", count: 189, percentage: 15.2, color: "bg-indigo-500" },
  { status: "DELIVERED", count: 598, percentage: 47.9, color: "bg-teal-500" },
  { status: "COMPLETED", count: 58, percentage: 4.6, color: "bg-emerald-500" },
];

const mockTopBranches = [
  { name: "Addis Ababa Main", orders: 456, revenue: 89234, growth: 15.2 },
  { name: "Dire Dawa Branch", orders: 234, revenue: 45678, growth: 8.5 },
  { name: "Hawassa Branch", orders: 189, revenue: 34567, growth: 12.3 },
  { name: "Mekelle Branch", orders: 156, revenue: 28901, growth: -2.1 },
  { name: "Bahir Dar Branch", orders: 134, revenue: 23456, growth: 5.7 },
  { name: "Gondar Branch", orders: 78, revenue: 12345, growth: 3.4 },
];

const mockTopCustomers = [
  { name: "Ethio Telecom", orders: 234, revenue: 67890, status: "Active" },
  { name: "Commercial Bank", orders: 189, revenue: 56789, status: "Active" },
  { name: "Ethiopian Airlines", orders: 156, revenue: 45678, status: "Active" },
  { name: "DHL Ethiopia", orders: 123, revenue: 34567, status: "Active" },
  { name: "FedEx Express", orders: 98, revenue: 23456, status: "Active" },
];

const mockServiceTypes = [
  { type: "STANDARD", count: 567, revenue: 123456, percentage: 45.5 },
  { type: "EXPRESS", count: 456, revenue: 89234, percentage: 36.3 },
  { type: "SAME_DAY", count: 156, revenue: 23456, percentage: 12.5 },
  { type: "OVERNIGHT", count: 68, revenue: 9534, percentage: 5.7 },
];

const mockRecentOrders = [
  {
    id: "ORD-2024-001",
    customer: "Ethio Telecom",
    status: "DELIVERED",
    amount: 2340,
    date: "2024-12-18",
    serviceType: "EXPRESS",
  },
  {
    id: "ORD-2024-002",
    customer: "Commercial Bank",
    status: "IN_TRANSIT",
    amount: 1890,
    date: "2024-12-18",
    serviceType: "STANDARD",
  },
  {
    id: "ORD-2024-003",
    customer: "Ethiopian Airlines",
    status: "DISPATCHED",
    amount: 3456,
    date: "2024-12-17",
    serviceType: "SAME_DAY",
  },
  {
    id: "ORD-2024-004",
    customer: "DHL Ethiopia",
    status: "APPROVED",
    amount: 1234,
    date: "2024-12-17",
    serviceType: "STANDARD",
  },
  {
    id: "ORD-2024-005",
    customer: "FedEx Express",
    status: "CREATED",
    amount: 890,
    date: "2024-12-16",
    serviceType: "EXPRESS",
  },
];

const mockRevenueTrend = [
  { month: "Jan", revenue: 18900 },
  { month: "Feb", revenue: 21200 },
  { month: "Mar", revenue: 19800 },
  { month: "Apr", revenue: 23400 },
  { month: "May", revenue: 25600 },
  { month: "Jun", revenue: 28900 },
  { month: "Jul", revenue: 31200 },
  { month: "Aug", revenue: 29800 },
  { month: "Sep", revenue: 32400 },
  { month: "Oct", revenue: 35600 },
  { month: "Nov", revenue: 38900 },
  { month: "Dec", revenue: 24568 },
];

export default function ReportPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    preset: ReportPreset.TODAY,
    serviceType: undefined,
    shippingScope: undefined,
    fulfillmentType: undefined,
    status: undefined,
    topLimit: 5,
    recentLimit: 5,
    revenueGroupBy: "day",
  });

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isLoading, error, refetch } = useReportMetrics(filters);
  const { data: branchesData, isLoading: isBranchesLoading } = useBranches({
    pageSize: 100,
  });

  useEffect(() => {
    if (filters.preset === ReportPreset.CUSTOM) {
      setFilters((prev) => ({
        ...prev,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }
  }, [filters.preset, startDate, endDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CREATED":
        return "bg-blue-100 text-blue-700";
      case "PENDING_APPROVAL":
        return "bg-yellow-100 text-yellow-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "VALIDATED":
        return "bg-lime-100 text-lime-700";
      case "ASSIGNED":
        return "bg-cyan-100 text-cyan-700";
      case "DISPATCHED":
        return "bg-purple-100 text-purple-700";
      case "IN_TRANSIT":
        return "bg-indigo-100 text-indigo-700";
      case "DELIVERED":
        return "bg-teal-100 text-teal-700";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "CREATED":
        return "bg-blue-500";
      case "PENDING_APPROVAL":
        return "bg-yellow-500";
      case "APPROVED":
        return "bg-green-500";
      case "VALIDATED":
        return "bg-lime-500";
      case "ASSIGNED":
        return "bg-cyan-500";
      case "DISPATCHED":
        return "bg-purple-500";
      case "IN_TRANSIT":
        return "bg-indigo-500";
      case "DELIVERED":
        return "bg-teal-500";
      case "COMPLETED":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleExport = () => {
    console.log("Exporting report...");
  };

  const handleApplyFilters = () => {
    refetch();
  };

  const hasApiData = !isLoading && !error && data;

  const hasActiveFilters =
    filters.preset !== ReportPreset.TODAY ||
    !!filters.serviceType ||
    !!filters.status ||
    !!filters.branchId ||
    (filters.topLimit && filters.topLimit !== 5) ||
    (filters.recentLimit && filters.recentLimit !== 5);

  const getPresetLabel = (preset: ReportPreset) => {
    switch (preset) {
      case ReportPreset.TODAY:
        return "Today";
      case ReportPreset.YESTERDAY:
        return "Yesterday";
      case ReportPreset.THIS_WEEK:
        return "This Week";
      case ReportPreset.LAST_WEEK:
        return "Last Week";
      case ReportPreset.THIS_MONTH:
        return "This Month";
      case ReportPreset.LAST_MONTH:
        return "Last Month";
      case ReportPreset.CUSTOM:
        return "Custom Range";
      default:
        return preset;
    }
  };

  const metrics = data?.summary
    ? {
        totalOrders: data.summary.totalOrders,
        totalRevenue: data.summary.totalRevenue,
        totalDeliveries: data.summary.totalDelivered,
        activeDrivers: data.summary.activeDrivers,
        pendingOrders: 0,
        completedOrders: 0,
        revenueChange: 0,
        ordersChange: 0,
        deliveriesChange: 0,
        driversChange: 0,
      }
    : mockMetrics;

  const orderStatus = hasApiData
    ? data.orderStatusDistribution.length > 0
      ? (() => {
          const total = data.orderStatusDistribution.reduce((sum, item) => sum + item.count, 0);
          return data.orderStatusDistribution.map((item) => ({
            status: item.status,
            count: item.count,
            percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
            color: getStatusColorClass(item.status),
          }));
        })()
      : []
    : mockOrderStatus;

  const topBranches = hasApiData
    ? data.topBranches.map((branch) => ({
        name: branch.name || "Unknown",
        orders: branch.orderCount || 0,
        revenue: branch.revenue || 0,
        growth: 0,
      }))
    : mockTopBranches;

  const topCustomers = hasApiData
    ? data.topCustomers.map((customer) => ({
        name: customer.name || "Unknown",
        orders: customer.orderCount || 0,
        revenue: customer.revenue || 0,
        status: "Active",
      }))
    : mockTopCustomers;

  const recentOrders = hasApiData
    ? data.recentOrders.map((order) => ({
        id: order.trackingCode || order.id,
        customer: order.customer?.name || "Unknown",
        status: order.status,
        amount: order.finalPrice || order.cost || 0,
        date: order.createdAt ? format(new Date(order.createdAt), "PPp") : "N/A",
        serviceType: order.serviceType || "N/A",
      }))
    : mockRecentOrders;

  const revenueTrend = hasApiData
    ? data.revenueTrend.map((item) => ({
        month: item.period ? format(new Date(item.period), "MMM dd") : "Unknown",
        revenue: item.revenue,
      }))
    : mockRevenueTrend;

  const serviceTypes = hasApiData ? [] : mockServiceTypes;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              System Reports
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive analytics and insights for your delivery operations
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Filter</h3>
                  </div>

                  {/* Date Preset */}
                  <div className="space-y-2">
                    <Label htmlFor="preset" className="text-xs font-medium">Date Preset</Label>
                    <Select
                      value={filters.preset}
                      onValueChange={(value) =>
                        setFilters({ ...filters, preset: value as ReportPreset })
                      }
                    >
                      <SelectTrigger id="preset" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ReportPreset.TODAY}>Today</SelectItem>
                        <SelectItem value={ReportPreset.YESTERDAY}>Yesterday</SelectItem>
                        <SelectItem value={ReportPreset.THIS_WEEK}>This Week</SelectItem>
                        <SelectItem value={ReportPreset.LAST_WEEK}>Last Week</SelectItem>
                        <SelectItem value={ReportPreset.THIS_MONTH}>This Month</SelectItem>
                        <SelectItem value={ReportPreset.LAST_MONTH}>Last Month</SelectItem>
                        <SelectItem value={ReportPreset.CUSTOM}>Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Date Range */}
                  {filters.preset === ReportPreset.CUSTOM && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-xs font-medium">From:</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-xs font-medium">To:</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}

                  {/* Service Type */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="serviceType" className="text-xs font-medium">Service Type</Label>
                      {filters.serviceType && (
                        <button
                          onClick={() => setFilters({ ...filters, serviceType: undefined })}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <Select
                      value={filters.serviceType || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          serviceType: value === "all" ? undefined : (value as "STANDARD" | "EXPRESS" | "SAME_DAY" | "OVERNIGHT"),
                        })
                      }
                    >
                      <SelectTrigger id="serviceType" className="h-9">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="EXPRESS">Express</SelectItem>
                        <SelectItem value="SAME_DAY">Same Day</SelectItem>
                        <SelectItem value="OVERNIGHT">Overnight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="status" className="text-xs font-medium">Status</Label>
                      {filters.status && (
                        <button
                          onClick={() => setFilters({ ...filters, status: undefined })}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          status: value === "all" ? undefined : (value as "CREATED" | "APPROVED" | "DISPATCHED" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED"),
                        })
                      }
                    >
                      <SelectTrigger id="status" className="h-9">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="CREATED">Created</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="DISPATCHED">Dispatched</SelectItem>
                        <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Branch */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="branchId" className="text-xs font-medium">Branch</Label>
                      {filters.branchId && (
                        <button
                          onClick={() => setFilters({ ...filters, branchId: undefined })}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <Select
                      value={filters.branchId || "all"}
                      onValueChange={(value) =>
                        setFilters({
                          ...filters,
                          branchId: value === "all" ? undefined : value,
                        })
                      }
                      disabled={isBranchesLoading}
                    >
                      <SelectTrigger id="branchId" className="h-9">
                        <SelectValue placeholder={isBranchesLoading ? "Loading..." : "All Branches"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branchesData?.data?.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Top Limit */}
                  <div className="space-y-2">
                    <Label htmlFor="topLimit" className="text-xs font-medium">Top Results Limit</Label>
                    <Input
                      id="topLimit"
                      type="number"
                      min="1"
                      max="50"
                      value={filters.topLimit || 5}
                      onChange={(e) =>
                        setFilters({ ...filters, topLimit: parseInt(e.target.value) || 5 })
                      }
                      className="h-9"
                    />
                  </div>

                  {/* Recent Limit */}
                  <div className="space-y-2">
                    <Label htmlFor="recentLimit" className="text-xs font-medium">Recent Orders Limit</Label>
                    <Input
                      id="recentLimit"
                      type="number"
                      min="1"
                      max="50"
                      value={filters.recentLimit || 5}
                      onChange={(e) =>
                        setFilters({ ...filters, recentLimit: parseInt(e.target.value) || 5 })
                      }
                      className="h-9"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({
                          preset: ReportPreset.TODAY,
                          serviceType: undefined,
                          shippingScope: undefined,
                          fulfillmentType: undefined,
                          status: undefined,
                          topLimit: 5,
                          recentLimit: 5,
                          revenueGroupBy: "day",
                        });
                        setStartDate("");
                        setEndDate("");
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      Reset all
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleApplyFilters();
                        setIsFilterOpen(false);
                      }}
                      disabled={isLoading || (filters.preset === ReportPreset.CUSTOM && (!startDate || !endDate))}
                      className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                    >
                      Apply now
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Applied Filters */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Applied filters:</span>

          {filters.preset !== ReportPreset.TODAY && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  preset: ReportPreset.TODAY,
                  startDate: undefined,
                  endDate: undefined,
                }))
              }
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
            >
              <span>Preset: {getPresetLabel(filters.preset)}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.preset === ReportPreset.CUSTOM && startDate && endDate && (
            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setFilters((prev) => ({
                  ...prev,
                  startDate: undefined,
                  endDate: undefined,
                }));
              }}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
            >
              <span>
                Date: {startDate} → {endDate}
              </span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.serviceType && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, serviceType: undefined }))}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-100"
            >
              <span>Service: {filters.serviceType}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.status && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, status: undefined }))}
              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-100"
            >
              <span>Status: {filters.status}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.branchId && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, branchId: undefined }))}
              className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700 hover:bg-orange-100"
            >
              <span>Branch: {filters.branchId}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.topLimit && filters.topLimit !== 5 && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, topLimit: 5 }))}
              className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-700 hover:bg-teal-100"
            >
              <span>Top: {filters.topLimit}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.recentLimit && filters.recentLimit !== 5 && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, recentLimit: 5 }))}
              className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-700 hover:bg-teal-100"
            >
              <span>Recent: {filters.recentLimit}</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}


      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading report data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600">
              Error loading report data: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalOrders.toLocaleString()}</div>
              <div className="flex items-center text-xs mt-1">
                {metrics.ordersChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metrics.ordersChange > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(metrics.ordersChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalRevenue.toLocaleString()} ETB
              </div>
              <div className="flex items-center text-xs mt-1">
                {metrics.revenueChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metrics.revenueChange > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(metrics.revenueChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalDeliveries.toLocaleString()}
              </div>
              <div className="flex items-center text-xs mt-1">
                {metrics.deliveriesChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metrics.deliveriesChange > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(metrics.deliveriesChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeDrivers}</div>
              <div className="flex items-center text-xs mt-1">
                {metrics.driversChange > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metrics.driversChange > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(metrics.driversChange)}% from last period
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts and Detailed Reports */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Order Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Order Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderStatus.length > 0 ? (
                  orderStatus.map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.status}</span>
                        <span className="text-sm text-gray-600">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <PieChart className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-500">No order status data</p>
                    <p className="text-xs text-gray-400 mt-1">No orders found for selected filters</p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Trend (ETB)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueTrend.length > 0 ? (
                <div className="space-y-2">
                  {revenueTrend.map((item) => {
                    const maxRevenue = Math.max(...revenueTrend.map((r) => r.revenue));
                  const height = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={item.month} className="flex items-end gap-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">{item.month}</span>
                          <span className="text-xs font-medium">{item.revenue.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8">
                          <div
                            className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${height}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {item.revenue > maxRevenue * 0.3 ? item.revenue.toLocaleString() : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-500">No revenue data available</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your date range</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Type Performance */}
      {!isLoading && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Service Type Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {serviceTypes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Order Count</TableHead>
                      <TableHead>Revenue (ETB)</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceTypes.map((service) => (
                    <TableRow key={service.type}>
                      <TableCell className="font-medium">{service.type}</TableCell>
                      <TableCell>{service.count.toLocaleString()}</TableCell>
                      <TableCell>{service.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${service.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{service.percentage}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">No service type data available</p>
                <p className="text-xs text-gray-400 mt-1">No orders found for selected filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Branches and Customers */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Branches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Performing Branches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBranches.length > 0 ? (
                  topBranches.map((branch, index) => (
                    <div
                      key={branch.name}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{branch.name}</p>
                          <p className="text-sm text-gray-500">
                            {branch.orders} orders • {branch.revenue.toLocaleString()} ETB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {branch.growth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            branch.growth > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {branch.growth > 0 ? "+" : ""}
                          {branch.growth}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MapPin className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-500">No branch data available</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.length > 0 ? (
                  topCustomers.map((customer, index) => (
                    <div
                      key={customer.name}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">
                            {customer.orders} orders • {customer.revenue.toLocaleString()} ETB
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">{customer.status}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-500">No customer data available</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Orders */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount (ETB)</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.serviceType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.amount.toLocaleString()}</TableCell>
                      <TableCell>{order.date}</TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-500">No recent orders</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or date range</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
