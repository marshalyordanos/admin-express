"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  Building2,
  Star,
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
import {
  IoAdd,
  IoPerson,
  IoBusiness,
  IoStar,
  IoWarning,
  IoLockOpen,
} from "react-icons/io5";
import { MdEdit, MdDelete } from "react-icons/md";

const customers = [
  {
    id: "CUST-001",
    customerId: "C001",
    name: "Abebe Kebede",
    email: "abebe.k@email.com",
    phone: "+251 911 234 567",
    type: "Individual",
    status: "Active",
    registrationDate: "2024-01-15",
    lastOrderDate: "2024-12-10",
    totalOrders: 12,
    totalSpent: 45000,
    loyaltyPoints: 450,
    address: "Bole, Addis Ababa",
    city: "Addis Ababa",
    companyName: null,
    contactPerson: null,
    preferredLanguage: "Amharic",
    communicationPreference: "SMS",
  },
  {
    id: "CUST-002",
    customerId: "C002",
    name: "Ethiopian Airlines",
    email: "logistics@ethiopianairlines.com",
    phone: "+251 115 517 000",
    type: "Corporate",
    status: "Active",
    registrationDate: "2023-06-20",
    lastOrderDate: "2024-12-08",
    totalOrders: 156,
    totalSpent: 1250000,
    loyaltyPoints: 0,
    address: "Bole International Airport",
    city: "Addis Ababa",
    companyName: "Ethiopian Airlines",
    contactPerson: "Tigist Hailu",
    preferredLanguage: "English",
    communicationPreference: "Email",
  },
  {
    id: "CUST-003",
    customerId: "C003",
    name: "Marta Tadesse",
    email: "marta.t@email.com",
    phone: "+251 911 345 678",
    type: "Individual",
    status: "Active",
    registrationDate: "2024-03-10",
    lastOrderDate: "2024-12-05",
    totalOrders: 8,
    totalSpent: 28000,
    loyaltyPoints: 280,
    address: "Merkato, Addis Ababa",
    city: "Addis Ababa",
    companyName: null,
    contactPerson: null,
    preferredLanguage: "Amharic",
    communicationPreference: "Phone",
  },
  {
    id: "CUST-004",
    customerId: "C004",
    name: "Dashen Bank",
    email: "procurement@dashenbank.com",
    phone: "+251 115 151 151",
    type: "Corporate",
    status: "Active",
    registrationDate: "2023-09-15",
    lastOrderDate: "2024-12-12",
    totalOrders: 89,
    totalSpent: 780000,
    loyaltyPoints: 0,
    address: "Ras Abebe Aregay Street",
    city: "Addis Ababa",
    companyName: "Dashen Bank",
    contactPerson: "Yohannes Desta",
    preferredLanguage: "English",
    communicationPreference: "Email",
  },
  {
    id: "CUST-005",
    customerId: "C005",
    name: "Dawit Alemu",
    email: "dawit.a@email.com",
    phone: "+251 911 456 789",
    type: "Individual",
    status: "Inactive",
    registrationDate: "2024-02-28",
    lastOrderDate: "2024-08-15",
    totalOrders: 3,
    totalSpent: 12000,
    loyaltyPoints: 120,
    address: "Hawassa, SNNPR",
    city: "Hawassa",
    companyName: null,
    contactPerson: null,
    preferredLanguage: "Amharic",
    communicationPreference: "SMS",
  },
];

const metrics = [
  {
    title: "Total Customers",
    value: "1,247",
    change: "23 new this month",
    trend: "up",
    icon: <Users className="h-5 w-5" />,
    color: "blue",
  },
  {
    title: "Active Customers",
    value: "1,189",
    change: "95% active rate",
    trend: "up",
    icon: <UserCheck className="h-5 w-5" />,
    color: "green",
  },
  {
    title: "Corporate Clients",
    value: "58",
    change: "12 new contracts",
    trend: "up",
    icon: <Building2 className="h-5 w-5" />,
    color: "purple",
  },
  {
    title: "Loyalty Members",
    value: "892",
    change: "High engagement",
    trend: "up",
    icon: <Star className="h-5 w-5" />,
    color: "orange",
  },
];

export default function CustomerMain() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  // Calculate pagination
  const totalItems = customers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = customers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Customer Management
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={() => navigate("/customer/create")}
            >
              <IoAdd className="h-4 w-4 mr-2" />
              Add New Customer
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3 mb-6">
          <Button
            variant="outline"
            className="text-gray-600 bg-white cursor-pointer"
            onClick={() => navigate("/customer/corporate")}
          >
            <IoBusiness className="h-4 w-4 mr-2" />
            Corporate Clients
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 bg-white cursor-pointer"
            onClick={() => navigate("/customer/loyalty")}
          >
            <IoStar className="h-4 w-4 mr-2" />
            Loyalty Program
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 bg-white cursor-pointer"
            onClick={() => navigate("/customer/complaints")}
          >
            <IoWarning className="h-4 w-4 mr-2" />
            Complaints
          </Button>
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
                  <div
                    className={`p-3 rounded-full ${
                      metric.color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : metric.color === "green"
                        ? "bg-green-100 text-green-600"
                        : metric.color === "purple"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-80 mb-6">
          <Search className="absolute left-3 top-4 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            className="pl-10 pr-3 w-full py-6"
          />
        </div>

        {/* Customers Table */}
        <Card className="bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Customer ID
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Contact
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Type
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Total Orders
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Total Spent
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Loyalty Points
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Last Order
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer, index) => (
                <TableRow
                  key={index}
                  className="border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/customer/details/${customer.id}`)}
                >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    <Button
                      variant="ghost"
                      className="p-0 text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {customer.customerId}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {customer.type === "Corporate" ? (
                          <IoBusiness className="h-4 w-4 text-blue-600" />
                        ) : (
                          <IoPerson className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          {customer.name}
                        </span>
                        {customer.companyName && (
                          <div className="text-sm text-gray-500">
                            {customer.companyName}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">
                        {customer.email}
                      </span>
                      <span className="text-sm text-gray-500">
                        {customer.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        customer.type === "Corporate"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    >
                      {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {customer.totalSpent.toLocaleString()} ETB
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IoStar className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">
                        {customer.loyaltyPoints}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(customer.lastOrderDate).toLocaleDateString(
                      "en-GB"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : customer.status === "Inactive"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      ● {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customer/edit/${customer.id}`);
                        }}
                      >
                        <MdEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 opacity-60"
                      >
                        <IoLockOpen className="h-6 w-6 font-bold" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-400 bg-red-50 cursor-not-allowed opacity-60 hover:bg-red-100 hover:text-red-700"
                      >
                        <MdDelete className="h-4 w-4" />
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
