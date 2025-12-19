"use client";

import { useState } from "react";
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
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Truck,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
} from "lucide-react";

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
  const [dateRange, setDateRange] = useState("last30days");
  // const [reportType, setReportType] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CREATED":
        return "bg-blue-100 text-blue-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
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

  const handleExport = () => {
    // Mock export functionality
    console.log("Exporting report...");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
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
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last90days">Last 90 Days</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              {mockMetrics.ordersChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={mockMetrics.ordersChange > 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(mockMetrics.ordersChange)}% from last period
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
              {mockMetrics.totalRevenue.toLocaleString()} ETB
            </div>
            <div className="flex items-center text-xs mt-1">
              {mockMetrics.revenueChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={mockMetrics.revenueChange > 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(mockMetrics.revenueChange)}% from last period
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
              {mockMetrics.totalDeliveries.toLocaleString()}
            </div>
            <div className="flex items-center text-xs mt-1">
              {mockMetrics.deliveriesChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={mockMetrics.deliveriesChange > 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(mockMetrics.deliveriesChange)}% from last period
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
            <div className="text-2xl font-bold">{mockMetrics.activeDrivers}</div>
            <div className="flex items-center text-xs mt-1">
              {mockMetrics.driversChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={mockMetrics.driversChange > 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(mockMetrics.driversChange)}% from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Reports */}
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
              {mockOrderStatus.map((item) => (
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
              ))}
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
            <div className="space-y-2">
              {mockRevenueTrend.map((item) => {
                const maxRevenue = Math.max(...mockRevenueTrend.map((r) => r.revenue));
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
          </CardContent>
        </Card>
      </div>

      {/* Service Type Performance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Service Type Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                {mockServiceTypes.map((service) => (
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
        </CardContent>
      </Card>

      {/* Top Branches and Customers */}
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
              {mockTopBranches.map((branch, index) => (
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
              ))}
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
              {mockTopCustomers.map((customer, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                {mockRecentOrders.map((order) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
