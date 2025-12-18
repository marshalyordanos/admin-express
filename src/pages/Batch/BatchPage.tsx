"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Download,
  Package,
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
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import TablePagination from "@/components/common/TablePagination";
import { IoAdd, IoEye, IoPersonAdd } from "react-icons/io5";
import { getBatches, assignOfficerToBatch } from "@/lib/api/batch";
import type { Batch, Pagination } from "@/types/types";
import toast from "react-hot-toast";
import { Skeleton } from "antd";
import { exportToExcel } from "@/utils/exportToExcel";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api/api";
import { Spinner } from "@/utils/spinner";

interface Metric {
  title: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down";
  color: "blue" | "green" | "purple" | "orange";
}

function BatchPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [cargoOfficers, setCargoOfficers] = useState<any[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const [officerSearch, setOfficerSearch] = useState("");
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [isAssignCargoOfficerModal, setisAssignCargoOfficerModal] = useState(false);
  const [selectedBatchForOfficer, setSelectedBatchForOfficer] = useState<Batch | null>(null);
  const [isAssignCargoOfficerLoading, setIsAssignCargoOfficerLoading] = useState(false);
  const [showCargoOfficerDropdown, setShowCargoOfficerDropdown] = useState(false);
  const [cargoOfficerSearch, setCargoOfficerSearch] = useState("");
  const [selectedCargoOfficer, setSelectedCargoOfficer] = useState<any>(null);
  const [loadingCargoOfficer, setLoadingCargoOfficer] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  const fetchBatches = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response :any= await getBatches({
        page,
        pageSize: limit,
        search: searchText || undefined,
      });

      console.log("Batches API Response:", response);

      // Backend shape:
      // { success, message, data: { batches: Batch[], pagination: Pagination } }
      const batchesData: any[] = response.data?.batches ?? [];
      const paginationData: Pagination | null = response.data?.pagination ?? null;

      setBatches(batchesData);
      setPagination(paginationData);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setBatches([]);
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    fetchBatches(currentPage, pageSize);
  }, [searchText, currentPage, pageSize]);

  // Calculate metrics from batches
  useEffect(() => {
    if (Array.isArray(batches) && batches.length > 0) {
      const totalBatches = batches.length;
      const pendingBatches = batches.filter((b) => b.status === "PENDING").length;
      const acceptedBatches = batches.filter((b) => b.status === "ACCEPTED").length;
      const inTransitBatches = batches.filter((b) => b.status === "IN_TRANSIT").length;

      setMetrics([
        {
          title: "Total Batches",
          value: totalBatches,
          change: `${pagination?.total || 0} total`,
          trend: "up",
          color: "blue",
        },
        {
          title: "Pending",
          value: pendingBatches,
          change: `${Math.round((pendingBatches / totalBatches) * 100)}% of total`,
          trend: pendingBatches > 0 ? "up" : "down",
          color: "orange",
        },
        {
          title: "Accepted",
          value: acceptedBatches,
          change: `${Math.round((acceptedBatches / totalBatches) * 100)}% of total`,
          trend: "up",
          color: "green",
        },
        {
          title: "In Transit",
          value: inTransitBatches,
          change: `${Math.round((inTransitBatches / totalBatches) * 100)}% of total`,
          trend: "up",
          color: "purple",
        },
      ]);
    }
  }, [batches, pagination]);

  const handleExport = () => {
    if (!Array.isArray(batches)) {
      toast.error("No batches to export");
      return;
    }
    exportToExcel("batches", batches, (b) => ({
      "Batch Code": b.batchCode ?? "",
      Scope: b.scope ?? "",
      "Service Type": b.serviceType ?? "",
      Status: b.status ?? "",
      "Order Count": b.orders?.length ?? 0,
      Weight: b.weight ?? "N/A",
      "Created At": b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "",
    }));
  };

  const handleBatchToggle = (batchId: string) => {
    setSelectedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleSelectAll = () => {
    if (Array.isArray(batches)) {
      setSelectedBatches(batches.map((b) => b.id));
    }
  };

  const handleDeselectAll = () => {
    setSelectedBatches([]);
  };

  const fetchCargoOfficers = async () => {
    try {
      setLoadingOfficers(true);
      const response = await api.get<any>(
        `/users/cargo-officer?search=all:${officerSearch}&page=1&pageSize=20`
      );
      setCargoOfficers(response.data.data?.cargoOfficers || []);
      setLoadingOfficers(false);
    } catch (error: any) {
      setLoadingOfficers(false);
      toast.error("Failed to load cargo officers");
    }
  };

  const featchCargoOfficer = async (page = 1, limit = 10) => {
    try {
      setLoadingCargoOfficer(true);
      const response = await api.get<any>(
        `/users/cargo-officer?search=all:${cargoOfficerSearch}&page=${page}&pageSize=${limit}`
      );
      setCargoOfficers(response.data.data?.cargoOfficers || []);
      setLoadingCargoOfficer(false);
    } catch (error: any) {
      setLoadingCargoOfficer(false);
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAssignModalOpen) {
      fetchCargoOfficers();
    }
  }, [isAssignModalOpen, officerSearch]);

  useEffect(() => {
    if (isAssignCargoOfficerModal) {
      featchCargoOfficer();
    }
  }, [cargoOfficerSearch, isAssignCargoOfficerModal]);

  const handleAssignOfficer = async () => {
    if (selectedBatches.length === 0) {
      toast.error("Please select at least one batch");
      return;
    }

    if (!selectedOfficer) {
      toast.error("Please select an officer");
      return;
    }

    try {
      setAssigning(true);
      const response = await assignOfficerToBatch({
        batchId: selectedBatches,
        officerId: selectedOfficer.id,
      });
      toast.success(response.message || "Officer assigned successfully");
      setIsAssignModalOpen(false);
      setSelectedBatches([]);
      setSelectedOfficer(null);
      setOfficerSearch("");
      fetchBatches(currentPage, pageSize);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to assign officer";
      toast.error(message);
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignCargoOfficer = async () => {
    if (!selectedBatchForOfficer) {
      toast.error("No batch selected");
      return;
    }

    if (!selectedCargoOfficer) {
      toast.error("Please select a cargo officer");
      return;
    }

    try {
      setIsAssignCargoOfficerLoading(true);
      const response = await api.post("/dispatch/batch/assign-officer", {
        batchId: [selectedBatchForOfficer.id],
        officerId: selectedCargoOfficer.id,
      });
      toast.success(response.data.message || "Cargo officer assigned successfully");
      setisAssignCargoOfficerModal(false);
      setSelectedBatchForOfficer(null);
      setSelectedCargoOfficer(null);
      setCargoOfficerSearch("");
      fetchBatches(currentPage, pageSize);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to assign cargo officer";
      toast.error(message);
    } finally {
      setIsAssignCargoOfficerLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-700";
      case "DISPATCHED":
        return "bg-purple-100 text-purple-700";
      case "IN_TRANSIT":
        return "bg-indigo-100 text-indigo-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-teal-100 text-teal-700";
      case "CLOSED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case "IN_TOWN":
        return "bg-blue-100 text-blue-700";
      case "REGIONAL":
        return "bg-green-100 text-green-700";
      case "INTERNATIONAL":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Batch Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track batch dispatches
          </p>
        </div>
        <div className="flex gap-3">
          {selectedBatches.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setIsAssignModalOpen(true)}
              className="text-gray-600 bg-white border-gray-300 flex items-center gap-2"
            >
              <IoPersonAdd className="h-4 w-4" />
              Assign Officer ({selectedBatches.length})
            </Button>
          )}
          <Button
            onClick={() => navigate("/batch/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <IoAdd className="h-5 w-5" />
            Create Batch
          </Button>
        </div>
      </div>

      {/* Metrics */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    {metric.change}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search batches by code, status..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-3 w-full py-6"
              />
            </div>
            <div className="flex gap-3">
              {batches.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-gray-600 bg-white border-gray-300"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                    className="text-gray-600 bg-white border-gray-300"
                  >
                    Deselect All
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleExport}
                className="text-gray-600 bg-white border-gray-300 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : !Array.isArray(batches) || batches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No batches found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            Array.isArray(batches) &&
                            batches.length > 0 &&
                            selectedBatches.length === batches.length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleSelectAll();
                            } else {
                              handleDeselectAll();
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Batch Code</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(batches) && batches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBatches.includes(batch.id)}
                            onCheckedChange={() => handleBatchToggle(batch.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {batch.batchCode}
                        </TableCell>
                        <TableCell>
                          <Badge className={getScopeColor(batch.scope)}>
                            {batch.scope}
                          </Badge>
                        </TableCell>
                        <TableCell>{batch.serviceType}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(batch.status)}>
                            {batch.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{batch.orders?.length || 0}</TableCell>
                        <TableCell>
                          {batch.weight ? `${batch.weight} kg` : "N/A"}
                        </TableCell>
                        <TableCell>
                          {batch.createdAt
                            ? new Date(batch.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!batch.officerId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBatchForOfficer(batch);
                                  setisAssignCargoOfficerModal(true);
                                }}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <IoPersonAdd className="h-4 w-4" />
                                Assign Officer
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/batch/details/${batch.id}`, {
                                  state: { batch },
                                });
                              }}
                              className="flex items-center gap-1"
                            >
                              <IoEye className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  pageSize={pageSize}
                  totalItems={pagination.total}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Assign Officer Modal */}
      <ConfirmationModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedOfficer(null);
          setOfficerSearch("");
        }}
        onConfirm={handleAssignOfficer}
        title="Assign Officer to Batches"
        description={`Assign an officer to ${selectedBatches.length} selected batch(es)`}
        confirmText="Assign"
        cancelText="Cancel"
        variant="info"
        isLoading={assigning}
      >
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Search Officer
            </label>
            <Input
              value={officerSearch}
              onChange={(e) => setOfficerSearch(e.target.value)}
              placeholder="Search by name or email..."
            />
          </div>

          {loadingOfficers ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {cargoOfficers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No officers found
                </p>
              ) : (
                cargoOfficers.map((officer) => (
                  <div
                    key={officer.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedOfficer?.id === officer.id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                    onClick={() => setSelectedOfficer(officer)}
                  >
                    <p className="font-medium">
                      {officer.user?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {officer.user?.email || ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedOfficer && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium">Selected Officer:</p>
              <p className="text-sm text-gray-600">
                {selectedOfficer.user?.name} ({selectedOfficer.user?.email})
              </p>
            </div>
          )}
        </div>
      </ConfirmationModal>

      {/* Assign Cargo Officer Modal */}
      <ConfirmationModal
        isOpen={isAssignCargoOfficerModal}
        onClose={() => {
          setisAssignCargoOfficerModal(false);
          setSelectedBatchForOfficer(null);
          setSelectedCargoOfficer(null);
          setCargoOfficerSearch("");
        }}
        title="Assign Cargo Officer"
        description={`Assign a cargo officer to batch: ${selectedBatchForOfficer?.batchCode || ""}`}
        onConfirm={handleAssignCargoOfficer}
        variant="info"
        confirmText="Assign"
        cancelText="Cancel"
        isLoading={isAssignCargoOfficerLoading}
      >
        <div className="mt-4 space-y-4">
          <div className="relative">
            <label className="text-sm font-medium mb-2 block">
              Search Cargo Officer
            </label>
            <div className="relative">
              <Input
                placeholder="Search cargo officer by name or email..."
                value={cargoOfficerSearch}
                onChange={(e) => {
                  setCargoOfficerSearch(e.target.value);
                  setShowCargoOfficerDropdown(true);
                  if (!e.target.value) {
                    setSelectedCargoOfficer(null);
                  }
                }}
                onFocus={() => setShowCargoOfficerDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowCargoOfficerDropdown(false), 200)
                }
                className="py-7"
              />
              {selectedCargoOfficer && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCargoOfficer(null);
                    setCargoOfficerSearch("");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                >
                  ✕
                </button>
              )}
            </div>

            {showCargoOfficerDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {loadingCargoOfficer ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-gray-600">Loading...</span>
                  </div>
                ) : cargoOfficers.length > 0 ? (
                  cargoOfficers.map((officer: any) => (
                    <div
                      key={officer?.id}
                      onClick={() => {
                        setSelectedCargoOfficer(officer);
                        setCargoOfficerSearch(
                          officer?.user?.name || officer?.name || ""
                        );
                        setShowCargoOfficerDropdown(false);
                      }}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        selectedCargoOfficer?.id === officer?.id
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {officer?.user?.name || officer?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {officer?.user?.email || officer?.email || ""}
                      </div>
                      {officer?.id && (
                        <div className="text-xs text-gray-500">
                          ID: {officer.id}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No cargo officers found
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedCargoOfficer && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium">Selected Cargo Officer:</p>
              <p className="text-sm text-gray-600">
                {selectedCargoOfficer?.user?.name || selectedCargoOfficer?.name}{" "}
                ({selectedCargoOfficer?.user?.email || selectedCargoOfficer?.email})
              </p>
            </div>
          )}
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default BatchPage;
