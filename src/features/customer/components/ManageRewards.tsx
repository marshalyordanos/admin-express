"use client";

import { useState } from "react";
import { Search, Gift, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { IoAdd, IoGift, IoArrowBack, IoStar } from "react-icons/io5";
import { FaAward } from "react-icons/fa";

const rewards = [
  {
    id: "REW-001",
    name: "Free Shipping",
    description: "Free delivery on next order",
    pointsRequired: 200,
    type: "Service",
    status: "Active",
    usageCount: 156,
    totalRedeemed: 89,
    validUntil: "2025-12-31",
    tierRestriction: "Bronze+",
  },
  {
    id: "REW-002",
    name: "10% Discount",
    description: "10% off on next purchase",
    pointsRequired: 500,
    type: "Discount",
    status: "Active",
    usageCount: 234,
    totalRedeemed: 145,
    validUntil: "2025-12-31",
    tierRestriction: "Silver+",
  },
  {
    id: "REW-003",
    name: "Premium Gift Box",
    description: "Exclusive gift box with company merchandise",
    pointsRequired: 1000,
    type: "Physical",
    status: "Active",
    usageCount: 45,
    totalRedeemed: 23,
    validUntil: "2025-06-30",
    tierRestriction: "Gold+",
  },
  {
    id: "REW-004",
    name: "VIP Support",
    description: "Priority customer support for 1 month",
    pointsRequired: 800,
    type: "Service",
    status: "Active",
    usageCount: 78,
    totalRedeemed: 34,
    validUntil: "2025-12-31",
    tierRestriction: "Gold+",
  },
  {
    id: "REW-005",
    name: "Free Upgrade",
    description: "Free service upgrade on next order",
    pointsRequired: 300,
    type: "Service",
    status: "Inactive",
    usageCount: 0,
    totalRedeemed: 0,
    validUntil: "2024-12-31",
    tierRestriction: "Silver+",
  },
];

const metrics = [
  {
    title: "Total Rewards",
    value: "15",
    change: "3 new this month",
    trend: "up",
    icon: <Gift className="h-5 w-5" />,
    color: "blue",
  },
  {
    title: "Active Rewards",
    value: "12",
    change: "80% active rate",
    trend: "up",
    icon: <Star className="h-5 w-5" />,
    color: "green",
  },
  {
    title: "Total Redemptions",
    value: "291",
    change: "This month",
    trend: "up",
    icon: <Award className="h-5 w-5" />,
    color: "purple",
  },
  {
    title: "Popular Reward",
    value: "Free Shipping",
    change: "156 redemptions",
    trend: "up",
    icon: <Gift className="h-5 w-5" />,
    color: "orange",
  },
];

export default function ManageRewards() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  // Filter rewards
  const filteredRewards = rewards.filter((reward) => {
    const typeMatch = filterType === "all" || reward.type === filterType;
    const statusMatch =
      filterStatus === "all" || reward.status === filterStatus;
    return typeMatch && statusMatch;
  });

  // Calculate pagination
  const totalItems = filteredRewards.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRewards = filteredRewards.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-gray-100 text-gray-700";
      case "Expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Service":
        return "bg-blue-100 text-blue-700";
      case "Discount":
        return "bg-green-100 text-green-700";
      case "Physical":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Bronze+":
        return <IoStar className="h-4 w-4 text-amber-500" />;
      case "Silver+":
        return <IoStar className="h-4 w-4 text-gray-500" />;
      case "Gold+":
        return <IoStar className="h-4 w-4 text-yellow-500" />;
      case "Platinum+":
        return <FaAward className="h-4 w-4 text-purple-500" />;
      default:
        return <IoStar className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        <Card className="shadow-none border-none">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/customer/loyalty")}
                    className="cursor-pointer bg-blue-400 text-white hover:bg-blue-500 hover:text-white p-2"
                  >
                    <IoArrowBack className="h-5 w-5" />
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <IoGift className="text-purple-500" />
                    Manage Rewards
                  </h1>
                </div>
                <p className="text-gray-500 text-sm ml-11">
                  Create and manage loyalty program rewards and redemption items
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button
                  onClick={() => navigate("/customer/loyalty/rewards/create")}
                  className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white"
                >
                  <IoAdd className="mr-2 h-4 w-4" />
                  Create Reward
                </Button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {metric.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {metric.change}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg bg-${metric.color}-100 text-${metric.color}-600`}
                      >
                        {metric.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-80">
                <Search className="absolute left-3 top-4 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search rewards..."
                  className="pl-10 pr-3 w-full py-6"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-6 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="Service">Service</option>
                <option value="Discount">Discount</option>
                <option value="Physical">Physical</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-6 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-gray-600 font-medium">
                      Reward
                    </TableHead>
                    <TableHead className="text-gray-600 font-medium">
                      Type
                    </TableHead>
                    <TableHead className="text-gray-600 font-medium">
                      Points Required
                    </TableHead>
                    <TableHead className="text-gray-600 font-medium">
                      Tier Restriction
                    </TableHead>
                    <TableHead className="text-gray-600 font-medium">
                      Usage Stats
                    </TableHead>
                    <TableHead className="text-gray-600 font-medium">
                      Valid Until
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
                  {paginatedRewards.map((reward, index) => (
                    <TableRow
                      key={index}
                      className="border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/customer/loyalty/rewards/details/${reward.id}`
                        )
                      }
                    >
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <IoGift className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              {reward.name}
                            </span>
                            <div className="text-sm text-gray-500 max-w-[200px] truncate">
                              {reward.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getTypeColor(reward.type)}
                        >
                          {reward.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IoStar className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-gray-900">
                            {reward.pointsRequired}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTierIcon(reward.tierRestriction)}
                          <span className="text-sm">
                            {reward.tierRestriction}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {reward.totalRedeemed} redeemed
                          </span>
                          <span className="text-sm text-gray-500">
                            {reward.usageCount} available
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(reward.validUntil).toLocaleDateString(
                          "en-GB"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(reward.status)}
                        >
                          ● {reward.status}
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
                              navigate(
                                `/customer/loyalty/rewards/edit/${reward.id}`
                              );
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 px-3 text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/customer/loyalty/rewards/usage/${reward.id}`
                              );
                            }}
                          >
                            Usage
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
