"use client";

import { useState } from "react";
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

const orders = [
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
  "Pending review",
  "Unpaid",
  "paid",
  "completed",
  "rejected",
];

export default function Main() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  // Calculate pagination
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

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
            <Button variant="outline" className="text-gray-600 bg-transparent">
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
          {metrics.map((metric, index) => (
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
          <div className="flex items-center space-x-1 bg-[#9d979724] rounded-md p-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`hover:bg-white cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-gray-900 "
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-4 text-gray-400 h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 pr-3 w-full py-6" />
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
                  Delivery
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Items
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Destination
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
              {paginatedOrders.map((order, index) => (
                <TableRow
                  key={index}
                  className="border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/order/details/${order.id.replace("#", "")}`)
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
                      {order.id}
                    </Button>
                  </TableCell>
                  <TableCell className="text-gray-600">{order.date}</TableCell>
                  <TableCell className="text-gray-900">
                    {order.customer}
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
                      ● {order.payment}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {order.total}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order.delivery}
                  </TableCell>
                  <TableCell className="text-gray-600">{order.items}</TableCell>
                  <TableCell className="text-gray-600">
                    {order.destination}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.fulfillment === "Fulfilled"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        order.fulfillment === "Fulfilled"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      ● {order.fulfillment}
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
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 px-3 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                      >
                        Request Approval
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </Card>
      </main>
    </div>
  );
}
