"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Download,
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
  const [orderSummary, setOrderSummary] = useState<any | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [searchText, setSearchText] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [acceptDropoffModal, setIsAcceptDropoffModal] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
// ........................ request states 

const [weight, setWeight] = useState(0);
const [isFragile, setIsFragile] = useState(true);
const [isUnusual, setIsUnusual] = useState(true);
const [unusualReason, setUnusualReason] = useState("i did not understand the object");

// /................................................
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isActionLoading, setIsActionLoading] = useState(false);
  // const [selectedTab, setSelectedTab] = useState("All");

  // const [reason, setReason] = useState("");


  const [driverSearch, setDriverSearch] = useState("");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [_, setPaginationDriver] = useState<Pagination | null>(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [driver, setDriver] = useState<any[]>([]);
  const [selectedDriver,setSelectedDriver] = useState<any>(null)



  const fetchOrders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const response = await api.get<OrderListResponse>(
        `/order?search=all:${searchText}&page=${page}&pageSize=${limit}&filter=${activeTab!=="All"?`status:${activeTab}`:""}`
      );
      setOrders(response.data.data);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, pageSize);
  }, [searchText, currentPage, pageSize, activeTab]);

  const fetchOrderSummary = async () => {
    try {
      setLoadingSummary(true);
      const res = await api.get<any>("/report/dashboard/order-summary");
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

  // const handleApprove = async () => {
  //   try {
  //     setIsApproveLoading(true);
  //     const res = await api.post("/order/approve", {
  //       orderId: selectedOrder?.id,
  //       reason: reason,
  //     });
  //     toast.success(res.data.message);
  //     featchOrders(currentPage, pageSize);
  //     setIsDialogOpen(false);
  //     setIsApproveLoading(false);
  //   } catch (error: any) {
  //     toast.error(error?.response.data.message || "Something went wrong!");
  //     setIsApproveLoading(false);
  //   }
  // };

  const handleRequest = async () => {
    try {
      setIsActionLoading(true);
      const payload = {
        weight,
        isFragile,
        isUnusual,
        unusualReason,
      };
      const res = await api.patch("/order/validate/"+selectedOrder?.id, payload);
      toast.success(res.data.message);
      fetchOrders(currentPage, pageSize);
      setIsDialogOpen(false);
      setIsActionLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.message || "Something went wrong!");
      setIsActionLoading(false);
    }
  };
  const handleRequestTwo = async () => {
    try {
      setIsActionLoading(true);
      const payload = {
        orderIds:[selectedOrder?.id]
      };
      const res = await api.post("/order/request/approval", payload);
      toast.success(res.data.message);
      fetchOrders(currentPage, pageSize);
      setIsDialogOpen(false);
      setIsActionLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.message || "Something went wrong!");
      setIsActionLoading(false);
    }
  };
  const handleAcceptDropoff = async () => {
    try {
      setIsActionLoading(true);
      const payload = {
        trackingCode:selectedOrder?.trackingCode,
  
      };
      const res = await api.post("/order/accept", payload);
      toast.success(res.data.message);
      fetchOrders(currentPage, pageSize);
      setIsAcceptDropoffModal(false);
      setIsActionLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.message || "Something went wrong!");
      setIsActionLoading(false);
    }
  };
  const handleAssignDriver = async () => {
    try {
      setIsActionLoading(true);
      const res = await api.post("/dispatch/assign-pickup", {
        orderId: selectedOrder?.id,
        driverId: selectedDriver?.id,
      });
      toast.success(res.data.message);
      fetchOrders(currentPage, pageSize);
      setIsAssignDriverDialogOpen(false);
      setIsActionLoading(false);
    } catch (error: any) {
      toast.error(error?.response.data.message || "Something went wrong!");
      setIsActionLoading(false);
    }
  };
 
  const handleExport = async () => {
    try {
      setIsExportLoading(true);
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
      // Small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      toast.error("Failed to export orders");
      console.error(error);
    } finally {
      setIsExportLoading(false);
    }
  };

  
  const fetchDriver = async (page = 1, limit = 10) => {
    try {
      setLoadingDriver(true);

      const response = await api.get<any>(
        `/users/driver?search=all:${driverSearch}&page=${page}&pageSize=${limit}`
      );
      setDriver(response.data.data?.drivers);
      setPaginationDriver(response.data.pagination);
      setLoadingDriver(false);
    } catch (error: any) {
      setLoadingDriver(false);

      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDriver();
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
              disabled={isExportLoading || orders.length === 0}
              className="text-gray-600 bg-transparent"
            >
              {isExportLoading ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
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
          <div className="overflow-x-auto">
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
                    {/* <ArrowUpDown className="h-3 w-3 ml-1" /> */}
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Pickup Date
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
                <TableHead className="text-gray-600 font-medium">
                  Items
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Destination
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                Shipping Scope
                </TableHead>
                
                <TableHead className="text-gray-600 font-medium">
                  Service Mode
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div className="flex justify-center items-center py-8">
                      <Spinner className="h-6 w-6 text-blue-600 mr-2" />
                      <span className="text-gray-600 font-medium">
                        Loading Order data...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div className="flex justify-center items-center py-8">
                      <span className="text-gray-500 font-medium">
                        No orders found
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, index) => (
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
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order.pickupDate
                      ? new Date(order.pickupDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {order.customer.name}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      // Mock payment statuses
                      const statuses = [
                        { label: "Pending", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100", variant: "secondary" },
                        { label: "Success", color: "bg-green-100 text-green-700 hover:bg-green-100", variant: "default" },
                        { label: "Failed",  color: "bg-red-100 text-red-700 hover:bg-red-100", variant: "secondary" }
                      ];
                      // Pick random status each render
                      const mockPayment = statuses[Math.floor(Math.random() * statuses.length)];
                      return (
                        <Badge
                          // variant={mockPayment.variant}
                          className={mockPayment.color}
                        >
                          ● {mockPayment.label}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {order.finalPrice?.toFixed(2)} ETB
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order?.pickupAddress?.landMark}
                  </TableCell>
                  <TableCell className="text-gray-600">
           {order.quantity}

                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order?.deliveryAddress?.landMark}
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

                    {(order.fulfillmentType == "PICKUP"&&order.status == "CREATED" && order?.shippingScope=="TOWN" ) ||
                    (order.fulfillmentType == "DROPOFF"&&order.status == "CREATED"  )?
                    
                    <div className="flex flex-row gap-2">

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
                        Request Approval
                      </Button>
                    </div>
                    :
                    
                    (order.fulfillmentType == "PICKUP"&&order.status == "CREATED" && order?.shippingScope!="TOWN" )?<Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAcceptDropoffModal(true);
                          setSelectedOrder(order);
                        }}
                      >
                        Accept Dropoff
                      </Button>  : <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                        disabled
                      >
                        No Action
                      </Button>}
                    {/* {order.fulfillmentType == "PICKUP" &&
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
                    )} */}
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
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

      {/* <ConfirmationModal
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
      </ConfirmationModal> */}
      
<ConfirmationModal
  isOpen={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  title="Request Approval"
  description="Submit a request for approval. Please review the object information as needed before sending your request."
  onConfirm={selectedOrder?.fulfillmentType == "DROPOFF"?handleRequest:handleRequestTwo}
  variant="info"
  confirmText="Request"
  isLoading={isActionLoading}
>
{(selectedOrder?.fulfillmentType == "DROPOFF") &&<>
  {/* Weight */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">Weight (kg)</label>
    <input
      type="number"
      value={weight}
      onChange={(e) => setWeight(Number(e.target.value))}
      className="border rounded-md px-4 py-2 w-full"
      placeholder="Enter weight"
    />
  </div>

  {/* Fragile */}
  <div className="mb-4 flex items-center gap-2">
    <input
      type="checkbox"
      checked={isFragile}
      onChange={(e) => setIsFragile(e.target.checked)}
    />
    <span className="font-medium">Is Fragile?</span>
  </div>

  {/* Unusual */}
  <div className="mb-4 flex items-center gap-2">
    <input
      type="checkbox"
      checked={isUnusual}
      onChange={(e) => setIsUnusual(e.target.checked)}
    />
    <span className="font-medium">Is Unusual?</span>
  </div>

  {/* Unusual Reason */}
  {isUnusual && (
    <div>
      <textarea
        value={unusualReason}
        onChange={(e) => setUnusualReason(e.target.value)}
        placeholder="Explain why this object is unusual"
        className="placeholder-gray-500 py-4 h-32 resize-none border rounded-md px-4 w-full"
      />
    </div>
  )}</>}

</ConfirmationModal>

       <ConfirmationModal
        isOpen={acceptDropoffModal}
        onClose={() => setIsAcceptDropoffModal(false)}
        title="Accept Dropoff"
        description={`You are about to accept the drop-off for package with tracking code: ${selectedOrder?.trackingCode}. Please confirm this action.`}
        onConfirm={handleAcceptDropoff}
        variant="info"
        confirmText="Accept"
        isLoading={isActionLoading}
      >
        {/* <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="reason "
          className=" placeholder-gray-500 py-4 h-32 resize-none border rounded-md px-4 w-full"
        /> */}
        <></>
      </ConfirmationModal>
     
      <ConfirmationModal
        isOpen={isAssignDriverDialogOpen}
        onClose={() => setIsAssignDriverDialogOpen(false)}
        title="Assign Driver"
        description=""
        onConfirm={handleAssignDriver}
        variant="info"
        confirmText="Assign"
        isLoading={isActionLoading}
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
                          driver.map((driverItem) => (
                            <div
                              key={driverItem.id}
                              onClick={() =>
                               {setSelectedDriver(driverItem)
                               setDriverSearch(driverItem.name || driverItem.user?.name || "")}
                              }
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {driverItem.name || driverItem.user?.name || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-600">
                                ID: {driverItem.id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {driverItem.email || driverItem.user?.email || ""}
                              </div>
                            </div>
                          ))
                        ) : !loadingDriver ? (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No drivers found
                          </div>
                        ) : null}
                      </div>
                    )}
                   
                  </div>
      </ConfirmationModal>
    </div>
  );
}
