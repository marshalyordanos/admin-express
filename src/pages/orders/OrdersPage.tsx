"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/common/TablePagination";
import api from "@/lib/api/api";
import toast from "react-hot-toast";
import type { Order, OrderListResponse, Pagination } from "@/types/types";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Skeleton } from "antd";
import { Spinner } from "@/utils/spinner";
import { exportToExcel } from "@/utils/exportToExcel";
import { Label } from "@/components/ui/label";

export interface OrderStats {
  totalOrders: {
    value: number;
    change: number;
  };
  thisWeekOrders: {
    value: number;
    change: number;
  };
  thisMonthOrders: {
    value: number;
    change: number;
  };
  returnOrders: {
    value: number;
    change: number;
  };
  fulfilledOrders: {
    value: number;
    change: number;
  };
  onTimeDeliveryRate: number;
  avgPickupToDeliveryTime: number;
  avgBranchProcessingTime: number;
}

const orders2 = [
  {
    id: "#1002",
    date: "11 Feb, 2024",
    customer: "Wade Warren",
    payment: "Pending",
    total: "$20.00",
    delivery: "N/A",
    items: "2 Items",
    fulfillment: "Unfulfilled",
    destination: "Town",
    status: "Pending Approval",
  },
  {
    id: "#1004",
    date: "13 Feb, 2024",
    customer: "Esther Howard",
    payment: "Success",
    total: "$22.00",
    delivery: "N/A",
    items: "3 Items",
    fulfillment: "Fulfilled",
    destination: "Regional",
    status: "Approved",
  },
  {
    id: "#1007",
    date: "15 Feb, 2024",
    customer: "Jenny Wilson",
    payment: "Pending",
    total: "$25.00",
    delivery: "N/A",
    items: "1 Items",
    fulfillment: "Unfulfilled",
    destination: "International",
    status: "Pending Approval",
  },
  {
    id: "#1009",
    date: "17 Feb, 2024",
    customer: "Guy Hawkins",
    payment: "Success",
    total: "$27.00",
    delivery: "N/A",
    items: "5 Items",
    fulfillment: "Fulfilled",
    destination: "Town",
    status: "Approved",
  },
  {
    id: "#1011",
    date: "19 Feb, 2024",
    customer: "Jacob Jones",
    payment: "Pending",
    total: "$32.00",
    delivery: "N/A",
    items: "4 Items",
    fulfillment: "Unfulfilled",
    destination: "Regional",
    status: "Pending Approval",
  },
  {
    id: "#1013",
    date: "21 Feb, 2024",
    customer: "Kristin Watson",
    payment: "Success",
    total: "$25.00",
    delivery: "N/A",
    items: "3 Items",
    fulfillment: "Fulfilled",
    destination: "International",
    status: "Approved",
  },
  {
    id: "#1015",
    date: "23 Feb, 2024",
    customer: "Albert Flores",
    payment: "Pending",
    total: "$28.00",
    delivery: "N/A",
    items: "2 Items",
    fulfillment: "Unfulfilled",
    destination: "Town",
    status: "Pending Approval",
  },
  {
    id: "#1018",
    date: "25 Feb, 2024",
    customer: "Eleanor Pena",
    payment: "Success",
    total: "$35.00",
    delivery: "N/A",
    items: "1 Items",
    fulfillment: "Fulfilled",
    destination: "Regional",
    status: "Approved",
  },
  {
    id: "#1019",
    date: "27 Feb, 2024",
    customer: "Theresa Webb",
    payment: "Pending",
    total: "$20.00",
    delivery: "N/A",
    items: "2 Items",
    fulfillment: "Unfulfilled",
    destination: "International",
    status: "Pending Approval",
  },
];

const metrics = [
  {
    title: "Total Orders",
    value: "21",
    change: "25.2% last week",
    trend: "up",
    color: "orange",
  },
  {
    title: "Order items over time",
    value: "15",
    change: "18.2% last week",
    trend: "up",
    color: "green",
  },
  {
    title: "Returns Orders",
    value: "0",
    change: "1.2% last week",
    trend: "down",
    color: "red",
  },
  {
    title: "Fulfilled orders over time",
    value: "12",
    change: "12.2% last week",
    trend: "up",
    color: "teal",
  },
];

const MiniChart = ({ color }: { color: string }) => {
  const colors = {
    orange: "stroke-orange-500",
    green: "stroke-green-500",
    red: "stroke-red-500",
    teal: "stroke-teal-500",
  };

  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className="ml-auto">
      <path
        d="M2 18 L8 12 L14 15 L20 8 L26 11 L32 5 L38 9 L44 3 L50 7 L56 2"
        fill="none"
        strokeWidth="1.5"
        className={colors[color as keyof typeof colors]}
      />
      <path
        d="M2 18 L8 12 L14 15 L20 8 L26 11 L32 5 L38 9 L44 3 L50 7 L56 2 L60 20 L2 20 Z"
        fill="currentColor"
        className={`${colors[color as keyof typeof colors]} opacity-10`}
      />
    </svg>
  );
};

const tabs = [
  "All",
  "CREATED",
  "ASSIGNED",
  "PENDING",
  // "paid",
  "APPROVED",
  "DISPATCHED",
  // "rejected",
];

interface Metric {
  title: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down";
  color: "orange" | "green" | "red" | "teal";
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  // Calculate pagination
  const totalItems = 10;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders2.slice(startIndex, endIndex);
  const [orderSummary, setOrderSummary] = useState<OrderStats | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [searchText, setSearchText] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");

  const [reason, setReason] = useState("");


  const [driverSearch, setDriverSearch] = useState("");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [paginationDriver, setPaginationDriver] = useState<Pagination | null>(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [driver, setDriver] = useState<any[]>([]);
  const [selectedDriver,setSelectedDriver] = useState<any>(null)



  const featchOrders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const staffs = await api.get<OrderListResponse>(
        `/order?search=all:${searchText}&page=${page}&pageSize=${limit}&filter=${activeTab!=="All"?`status:${activeTab}`:""}`
      );
      setOrders(staffs.data.data);
      setPagination(staffs.data.pagination);
      // toast.success(staffs.data.message);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error); // optional: log the full error
    }
  };

  useEffect(() => {
    featchOrders(currentPage, pageSize);
  }, [searchText, currentPage, pageSize, activeTab]);

  const fetchOrderSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await api.get<OrderStats>("/report/dashboard/order-summary");
      setOrderSummary(res.data.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoadingSummary(false);
    }
  };
  useEffect(() => {
    if (orderSummary) {
      const newMetrics: Metric[] = [
        {
          title: "Total Orders",
          value: orderSummary.totalOrders?.value,
          change: `${orderSummary.totalOrders?.change}% last week`,
          trend: orderSummary.totalOrders?.change >= 0 ? "up" : "down",
          color: "orange",
        },
        {
          title: "Orders This Week",
          value: orderSummary.thisWeekOrders?.value,
          change: `${orderSummary.thisWeekOrders?.change}% last week`,
          trend: orderSummary.thisWeekOrders?.change >= 0 ? "up" : "down",
          color: "green",
        },
        {
          title: "Return Orders",
          value: orderSummary.returnOrders?.value,
          change: `${orderSummary.returnOrders?.change}% last week`,
          trend: orderSummary.returnOrders?.change >= 0 ? "up" : "down",
          color: "red",
        },
        {
          title: "Fulfilled Orders",
          value: orderSummary.fulfilledOrders?.value,
          change: `${orderSummary.fulfilledOrders?.change}% last week`,
          trend: orderSummary.fulfilledOrders?.change >= 0 ? "up" : "down",
          color: "teal",
        },
      ];

      setMetrics(newMetrics);
    }
  }, [orderSummary]);
  useEffect(() => {
    fetchOrderSummary();
  }, []);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleApprove = async () => {
    try {
      setIsApproveLoading(true);
      const res = await api.post("/order/approve", {
        orderId: selectedOrder?.id,
        reason: reason,
      });
      toast.success(res.data.message);
      featchOrders(currentPage, pageSize);
      setIsDialogOpen(false);
      setIsApproveLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.message || "Something went wrong!");
      setIsApproveLoading(false);
    }
  };

  const handleAssignDriver = async () => {
    try {
      setIsApproveLoading(true);
      const res = await api.post("/dispatch/assign-pickup", {
        orderId: selectedOrder?.id,
        driverId: selectedDriver?.id,
      });
      toast.success(res.data.message);
      featchOrders(currentPage, pageSize);
      setIsAssignDriverDialogOpen(false);
      setIsApproveLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.message || "Something went wrong!");
      setIsApproveLoading(false);
    }
  };
 
  const handleExport = () => {
    exportToExcel("orders", orders, (order) => ({
      "Tracking Code": order.trackingCode ?? "",
      Customer: order.customer.name ?? "",
      Payment: order?.payment ?? "N/A",
      Total: order?.finalPrice,
      "Pickup address": Number(order?.pickupAddress?.city),
      "Delivery Address": Number(order?.deliveryAddress?.city),
      "Fulfillment Type": order?.fulfillmentType,
      Status: order?.status,
    }));
  };

  
  const featchDriver= async (page = 1, limit = 10) => {
    try {
      setLoadingDriver(true);

      const staffs = await api.get<any>(
        `/users/driver?search=all:${driverSearch}&page=${1}&pageSize=${20}`
      );
      setDriver(staffs.data.data?.drivers);
      setPaginationDriver(staffs.data.pagination);
      // toast.success(staffs.data.message);
      setLoadingDriver(false);
    } catch (error: any) {
      setLoadingDriver(false);

      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error); // optional: log the full error
    }
  };

  useEffect(() => {
    featchDriver();
  }, [driverSearch]);
 
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="text-gray-600 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white !cursor-pointer"
              onClick={() => navigate("/order/new")}
            >
              Create order
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loadingSummary
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white p-4">
                  <Skeleton
                    active
                    title={{ width: "60%" }}
                    paragraph={{ rows: 2, width: ["100%", "80%"] }}
                  />
                </Card>
              ))
            : metrics.map((metric, index) => (
                <Card key={index} className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {metric.value}
                          <span className="text-lg font-normal text-gray-400 ml-1">
                            -
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                          )}
                          <span
                            className={
                              metric.trend === "up"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <MiniChart color={metric.color} />
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-10 mb-6">
          <div className="flex items-center space-x-1 bg-[#edeaea24] rounded-md p-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`hover:bg-white cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-gray-900 "
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-4 text-gray-400 h-4 w-4" />
            <Input
              onChange={(val) => setSearchText(val.target.value)}
              value={searchText}
              placeholder="Search..."
              className="pl-10 pr-3 w-full py-6"
            />
          </div>
        </div>

        {/* Orders Table */}
        <Card className="bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Order
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Customer
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Payment
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Total
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Pickup address
                </TableHead>
                {/* <TableHead className="text-gray-600 font-medium">
                  Items
                </TableHead> */}
                <TableHead className="text-gray-600 font-medium">
                  Destination
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                Shipping Scope
                </TableHead>
                
                <TableHead className="text-gray-600 font-medium">
                  Fulfillment
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {loading && (
                  <TableCell colSpan={11}>
                    <div className="flex justify-center items-center py-8">
                      <Spinner className="h-6 w-6 text-blue-600 mr-2" />
                      <span className="text-gray-600 font-medium">
                        Loading Order data...
                      </span>
                    </div>
                  </TableCell>
                )}
              </TableRow>
              {orders.map((order, index) => (
                <TableRow
                  key={index}
                  className="border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/order/details/${order.id.replace(
                        "#",
                        ""
                      )}?order=${encodeURIComponent(JSON.stringify(order))}`
                    )
                  }
                >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    <Button
                      variant="ghost"
                      className="p-0 text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {order?.trackingCode}
                    </Button>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order.pickupDate}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {order.customer.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.payment === "Success" ? "default" : "secondary"
                      }
                      className={
                        order.payment === "Success"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                      }
                    >
                      ● {order?.payment?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {order.finalPrice} ETB
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order?.pickupAddress?.city}
                  </TableCell>
                  {/* <TableCell className="text-gray-600">
                  2 Items

                  </TableCell> */}
                  <TableCell className="text-gray-600">
                    {order?.deliveryAddress?.city}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order?.shippingScope}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.fulfillmentType === "Fulfilled"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        order.fulfillmentType === "Fulfilled"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      ● {order.fulfillmentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        order.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.fulfillmentType == "PICKUP" &&
                    order.status == "CREATED" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          // navigate(`/staff/edit/${member.id}`);
                          setIsAssignDriverDialogOpen(true); //
                          setSelectedOrder(order);
                        }}
                      >
                        Assign Driver
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          // navigate(`/staff/edit/${member.id}`);
                          setIsDialogOpen(true); //
                          setSelectedOrder(order);
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            currentPage={currentPage}
            totalPages={pagination?.totalPages || 1}
            pageSize={pagination?.pageSize || 10}
            totalItems={pagination?.total || 0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </Card>
      </main>

      <ConfirmationModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Approve Staff Member"
        description="Are you sure you want to delete this staff member? This action cannot be undone."
        onConfirm={handleApprove}
        variant="info"
        confirmText="Approve"
        // loading={deleteLaoding}
      >
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="reason "
          className=" placeholder-gray-500 py-4 h-32 resize-none border rounded-md px-4 w-full"
        />
      </ConfirmationModal>


      <ConfirmationModal
        isOpen={isAssignDriverDialogOpen}
        onClose={() => setIsAssignDriverDialogOpen(false)}
        title="Assign Driver"
        description=""
        onConfirm={handleAssignDriver}
        variant="info"
        confirmText="Assign"
        isLoading={isApproveLoading}
      >
        <div className="relative">
                    <Label className="mb-2">Driver *</Label>
                    <div className="relative">
                      <Input
                        // type="text"
                        placeholder="Search driver "
                        value={driverSearch}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setDriverSearch(e.target.value);
                          setShowDriverDropdown(true);
                          if (!e.target.value) {
                            // clearManager(setFieldValue);
                            setSelectedDriver(null)
                          }
                        }}
                        onFocus={() => setShowDriverDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowDriverDropdown(false), 200)
                        }
                        className="py-7"
                      />
                      {selectedDriver && (
                        <button
                          type="button"
                          onClick={() =>{
                            setSelectedDriver(null)
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {showDriverDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {loadingDriver && (
                          <div className="flex justify-center items-center py-8">
                            <Spinner className="h-6 w-6 text-blue-600 mr-2" />
                          </div>
                        )}
                        {driver.length > 0 ? (
                          driver.map((manager) => (
                            <div
                              key={manager.id}
                              onClick={() =>
                               {setSelectedDriver(manager)
                               setDriverSearch(manager.name)}
                              }
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {manager.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                ID: {manager.id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {manager.email}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No managers found
                          </div>
                        )}
                      </div>
                    )}
                   
                  </div>
      </ConfirmationModal>
    </div>
  );
}
