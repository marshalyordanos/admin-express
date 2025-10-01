"use client";

import { useState } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  MapPin,
  Users,
  Package,
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
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { IoAdd, IoPerson, IoPersonAdd, IoPersonRemove } from "react-icons/io5";

const branches = [
  {
    id: "1",
    name: "Addis Ababa Central",
    location: "Bole, Addis Ababa",
    manager: "John Doe",
    managerStatus: "Assigned",
    totalOrders: 1200,
    activeOrders: 85,
    staff: 25,
    revenue: "$85,000",
    efficiency: 96,
    status: "Active",
  },
  {
    id: "2",
    name: "Dire Dawa Branch",
    location: "City Center, Dire Dawa",
    manager: "Not Assigned",
    managerStatus: "Vacant",
    totalOrders: 950,
    activeOrders: 62,
    staff: 18,
    revenue: "$60,000",
    efficiency: 97,
    status: "Active",
  },
  {
    id: "3",
    name: "Mekelle Branch",
    location: "Downtown, Mekelle",
    manager: "Jane Smith",
    managerStatus: "Assigned",
    totalOrders: 780,
    activeOrders: 45,
    staff: 15,
    revenue: "$40,000",
    efficiency: 94,
    status: "Active",
  },
  {
    id: "4",
    name: "Bahir Dar Branch",
    location: "Lake Side, Bahir Dar",
    manager: "Not Assigned",
    managerStatus: "Vacant",
    totalOrders: 670,
    activeOrders: 38,
    staff: 12,
    revenue: "$38,000",
    efficiency: 96,
    status: "Active",
  },
  {
    id: "5",
    name: "Hawassa Branch",
    location: "Main Street, Hawassa",
    manager: "Mike Johnson",
    managerStatus: "Assigned",
    totalOrders: 800,
    activeOrders: 55,
    staff: 16,
    revenue: "$42,000",
    efficiency: 95,
    status: "Active",
  },
];

const metrics = [
  {
    title: "Total Branches",
    value: "5",
    change: "2 new this month",
    trend: "up",
    icon: <MapPin className="h-5 w-5" />,
    color: "blue",
  },
  {
    title: "Active Orders",
    value: "285",
    change: "15% increase",
    trend: "up",
    icon: <Package className="h-5 w-5" />,
    color: "green",
  },
  {
    title: "Total Staff",
    value: "86",
    change: "8 new hires",
    trend: "up",
    icon: <Users className="h-5 w-5" />,
    color: "purple",
  },
  {
    title: "Manager Vacancies",
    value: "2",
    change: "Need assignment",
    trend: "down",
    icon: <IoPerson className="h-5 w-5" />,
    color: "orange",
  },
];

export default function BranchMain() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  // Calculate pagination
  const totalItems = branches.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBranches = branches.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDeleteClick = (branch: { id: string; name: string }) => {
    setBranchToDelete(branch);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!branchToDelete) return;

    setIsDeleting(true);
    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Deleting branch:", branchToDelete);
      // Handle successful deletion
      setDeleteModalOpen(false);
      setBranchToDelete(null);
    } catch (error) {
      console.error("Error deleting branch:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setBranchToDelete(null);
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Branch Management
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={() => navigate("/branch/create")}
            >
              <IoAdd className="h-4 w-4 mr-2" />
              Create Branch
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3 mb-6">
          <Button
            variant="outline"
            className="text-gray-600 bg-white cursor-pointer"
            onClick={() => navigate("/branch/assign-manager")}
          >
            <IoPersonAdd className="h-4 w-4 mr-2" />
            Assign Manager
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 bg-white cursor-pointer"
            onClick={() => navigate("/branch/revoke-manager")}
          >
            <IoPersonRemove className="h-4 w-4 mr-2" />
            Revoke Manager
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
            placeholder="Search branches..."
            className="pl-10 pr-3 w-full py-6"
          />
        </div>

        {/* Branches Table */}
        <Card className="bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Branch Name
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  <div className="flex items-center">
                    Location
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Manager
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Total Orders
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Active Orders
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Staff
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Revenue
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Efficiency
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
              {paginatedBranches.map((branch, index) => (
                <TableRow
                  key={index}
                  className="border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/branch/details/${branch.id}`)}
                >
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    <Button
                      variant="ghost"
                      className="p-0 text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {branch.name}
                    </Button>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {branch.location}
                  </TableCell>
                  <TableCell>
                    {branch.managerStatus === "Assigned" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <IoPerson className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-900">
                          {branch.manager}
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700"
                      >
                        Vacant
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {branch.totalOrders.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      {branch.activeOrders}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {branch.staff}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {branch.revenue}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${branch.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {branch.efficiency}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      ● {branch.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 px-3 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/branch/edit/${branch.id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 px-3 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick({
                            id: branch.id,
                            name: branch.name,
                          });
                        }}
                      >
                        Delete
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

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          description={`Are you sure you want to delete ${
            branchToDelete?.name || "this branch"
          }? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      </main>
    </div>
  );
}
