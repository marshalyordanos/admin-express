"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoArrowBack, IoAdd, IoRemove } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getCategorizedOrders, createBatch } from "@/lib/api/batch";
import api from "@/lib/api/api";
import type {
  Order,
  CategorizedOrdersResponse,
  Branch,
  BranchListResponse,
} from "@/types/types";
import toast from "react-hot-toast";
import { Skeleton } from "antd";
import { Spinner } from "@/utils/spinner";
import SuccessModal from "@/components/common/SuccessModal";

// Scopes and service types for UI select
const SCOPES = ["TOWN", "REGIONAL", "INTERNATIONAL"] as const;
const SERVICE_TYPES = ["SAME_DAY", "EXPRESS", "STANDARD", "OVERNIGHT"] as const;

function CreateBatchPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categorizedOrders, setCategorizedOrders] =
    useState<CategorizedOrdersResponse | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [batchCode, setBatchCode] = useState("");

  // Form state
  const [selectedScope, setSelectedScope] = useState<typeof SCOPES[number] | "">("");
  const [selectedServiceType, setSelectedServiceType] =
    useState<typeof SERVICE_TYPES[number] | "">("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [notes, setNotes] = useState("");
  const [shipmentDate, setShipmentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [destinationBranchId, setDestinationBranchId] = useState("");

  const fetchCategorizedOrders = async () => {
    try {
      setLoading(true);
      const response = await getCategorizedOrders({ pageSize: 100 });
      setCategorizedOrders(response.data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const message =
        error?.response?.data?.message ||
        "Failed to load categorized orders";
      toast.error(message);
    }
  };

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await api.get<BranchListResponse>(
        `/branch?page=1&pageSize=50`
      );
      setBranches(response.data.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to load branches";
      toast.error(message);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    fetchCategorizedOrders();
    fetchBranches();
  }, []);

  const handleOrderToggle = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (orders: Order[]) => {
    const orderIds = orders.map((o) => o.id);
    setSelectedOrders((prev) => {
      const newIds = orderIds.filter((id) => !prev.includes(id));
      return [...prev, ...newIds];
    });
  };

  const handleDeselectAll = (orders: Order[]) => {
    const orderIds = orders.map((o) => o.id);
    setSelectedOrders((prev) => prev.filter((id) => !orderIds.includes(id)));
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !category.includes(categoryInput.trim())) {
      setCategory([...category, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategory(category.filter((c) => c !== cat));
  };

  // Utility: Get all routes for a scope
  const getRouteKeysForScope = (scopeKey: string): string[] => {
    if (!categorizedOrders) return [];
    const grouped = categorizedOrders.grouped as any;
    const scopeData = grouped[scopeKey];
    return scopeData ? Object.keys(scopeData) : [];
  };

  // Aggregates all orders for current selection
  const getOrdersForSelection = (): Order[] => {
    if (!categorizedOrders || !selectedScope || !selectedServiceType) {
      return [];
    }
    // API returns "TOWN" for in-town orders. For logic, we want "TOWN", "REGIONAL" or "INTERNATIONAL".
    const scopeKey = selectedScope;
    const grouped = categorizedOrders.grouped as any;
    const scopeData = grouped[scopeKey];
    if (!scopeData) return [];

    let result: Order[] = [];

    Object.values(scopeData).forEach((routeObj:any) => {
      // routeObj: Record<ServiceType, Order[]>
      const ordersForServiceType = routeObj[selectedServiceType];
      if (Array.isArray(ordersForServiceType) && ordersForServiceType.length > 0) {
        result = result.concat(ordersForServiceType);
      }
    });
    return result;
  };

  // Returns all available shipping scope keys based on response
  const getAvailableScopes = (): string[] => {
    if (!categorizedOrders) return [];
    const available: string[] = [];
    const grouped = categorizedOrders.grouped as any;
    if (grouped.TOWN && Object.keys(grouped.TOWN).length > 0) {
      available.push("TOWN");
    } else if (grouped.IN_TOWN && Object.keys(grouped.IN_TOWN).length > 0) {
      available.push("TOWN");
    }
    if (grouped.REGIONAL && Object.keys(grouped.REGIONAL).length > 0) {
      available.push("REGIONAL");
    }
    if (grouped.INTERNATIONAL && Object.keys(grouped.INTERNATIONAL).length > 0) {
      available.push("INTERNATIONAL");
    }
    return available;
  };

  // For a given scope, count orders across all routes, all service types
  const getScopeOrderCount = (scope: string): number => {
    if (!categorizedOrders) return 0;
    const grouped = categorizedOrders.grouped as any;
    const scopeKey = scope;
    const scopeData = grouped[scopeKey];
    if (!scopeData) return 0;
    let total = 0;
    Object.values(scopeData).forEach((routeObj: any) => {
      SERVICE_TYPES.forEach((serviceType) => {
        const arr: Order[] = routeObj[serviceType] || [];
        total += arr.length;
      });
    });
    return total;
  };

  // For a given serviceType within currently-selected scope, count orders
  const getServiceTypeOrderCount = (serviceType: string): number => {
    if (!categorizedOrders || !selectedScope) return 0;
    const grouped = categorizedOrders.grouped as any;
    const scopeData = grouped[selectedScope];
    if (!scopeData) return 0;
    let total = 0;
    Object.values(scopeData).forEach((routeObj: any) => {
      const arr: Order[] = routeObj[serviceType] || [];
      total += arr.length;
    });
    return total;
  };

  // ====== Advanced logic for Batch creation based on selected orders =======
  // Helper, used to quickly lookup all order objects by id for first order info
  const orderIdToOrderMap = useMemo(() => {
    const orders = getOrdersForSelection();
    const map: Record<string, Order> = {};
    orders.forEach(order => {
      map[order.id] = order;
    });
    return map;
    // Only recalc when categorizedOrders or selection changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorizedOrders, selectedScope, selectedServiceType]);

  const handleSubmit = async () => {
    if (!selectedScope || !selectedServiceType) {
      toast.error("Please select scope and service type");
      return;
    }

    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order");
      return;
    }

    if (!destinationBranchId) {
      toast.error("Please select destination branch");
      return;
    }

    // Get all orders for the current selection and selected orders
    const allSelectedOrdersData: Order[] = selectedOrders
      .map(orderId => orderIdToOrderMap[orderId])
      .filter(Boolean);

    // For batch creation, first order is used for category/origin logic
    const firstSelectedOrder = allSelectedOrdersData[0];

    if (!firstSelectedOrder) {
      toast.error("Unable to resolve addresses from selected order");
      return;
    }

    // Try to use branchId if exists, fallback to branch property if exists
    let originId =
      (firstSelectedOrder as any).branchId ||
      (firstSelectedOrder as any).branch?.id;

    // If originId is missing, fall back to destinationBranchId selected by user
    if (!originId) {
      if (destinationBranchId) {
        originId = destinationBranchId;
      } else {
        toast.error("Unable to resolve origin branch from selected order");
        return;
      }
    }

    if (!shipmentDate) {
      toast.error("Please select a shipment date");
      return;
    }

    // Calculate total weight
    const totalWeight = allSelectedOrdersData.reduce((sum, o) => sum + (o.weight || 0), 0);
    // Fragile flag
    const hasFragileItem = allSelectedOrdersData.some((o) => o.isFragile);

    // Collect categories from input or derive from first order
    let batchCategories: string[] | undefined;
    if (category.length > 0) {
      batchCategories = category;
    } else if(Array.isArray(firstSelectedOrder.category)) {
      batchCategories = [...firstSelectedOrder.category];
    }

    try {
      setSubmitting(true);
      const batchData = {
        scope: selectedScope,
        serviceType: selectedServiceType,
        category: batchCategories,
        isFragile: hasFragileItem,
        originId,
        destinationId: destinationBranchId,
        notes: notes || undefined,
        weight: totalWeight || undefined,
        orders: selectedOrders,
        shipmentDate,
      };

      const response: any = await createBatch(batchData);
      toast.success(response.message || "Batch created successfully");
      const code = response?.data?.batch?.batchCode || response?.batch?.batchCode || "";
      setBatchCode(code);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create batch";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    setBatchCode("");
    navigate("/batch");
  };

  // This gets *all* orders for the current selection
  const ordersForSelection = getOrdersForSelection();

  // Only display selectedOrders based on available data in selection
  const selectedOrdersData = ordersForSelection.filter((o) =>
    selectedOrders.includes(o.id)
  );
  const batchIsFragile = selectedOrdersData.some((o) => o.isFragile);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/batch")}
          className="p-2 hover:bg-gray-100 w-fit flex-shrink-0 h-fit"
        >
          <IoArrowBack className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Batch
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new batch from categorized orders
          </p>
        </div>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scope and Service Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Shipping Scope</Label>
                  <Select
                    value={selectedScope}
                    onValueChange={(value) => {
                      setSelectedScope(value as typeof SCOPES[number]);
                      setSelectedServiceType("");
                      setSelectedOrders([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableScopes().length > 0
                        ? getAvailableScopes().map((scope) => {
                            const count = getScopeOrderCount(scope);
                            return (
                              <SelectItem
                                key={scope}
                                value={scope}
                                disabled={count === 0}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span>
                                    {scope === "TOWN" ? "IN TOWN" : scope.replace("_", " ")}
                                  </span>
                                  <Badge
                                    variant={count > 0 ? "default" : "secondary"}
                                    className="ml-2"
                                  >
                                    {count} {count === 1 ? "order" : "orders"}
                                  </Badge>
                                </div>
                              </SelectItem>
                            );
                          })
                        : SCOPES.map((scope) => {
                            const count = getScopeOrderCount(scope);
                            return (
                              <SelectItem
                                key={scope}
                                value={scope}
                                disabled={count === 0}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span>
                                    {scope === "TOWN" ? "IN TOWN" : scope.replace("_", " ")}
                                  </span>
                                  <Badge
                                    variant={count > 0 ? "default" : "secondary"}
                                    className="ml-2"
                                  >
                                    {count} {count === 1 ? "order" : "orders"}
                                  </Badge>
                                </div>
                              </SelectItem>
                            );
                          })}
                    </SelectContent>
                  </Select>
                </div>

                {selectedScope && (
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select
                      value={selectedServiceType}
                      onValueChange={(value) => {
                        setSelectedServiceType(value as typeof SERVICE_TYPES[number]);
                        setSelectedOrders([]);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((type) => {
                          const count = getServiceTypeOrderCount(type);
                          return (
                            <SelectItem
                              key={type}
                              value={type}
                              disabled={count === 0}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{type.replace("_", " ")}</span>
                                <Badge
                                  variant={count > 0 ? "default" : "secondary"}
                                  className="ml-2"
                                >
                                  {count} {count === 1 ? "order" : "orders"}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedScope && selectedServiceType && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      Available orders:{" "}
                      <span className="font-semibold">
                        {ordersForSelection.length}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Selection */}
            {selectedScope && selectedServiceType && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Select Orders</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAll(ordersForSelection)}
                      className="text-gray-600 bg-white border-gray-300"
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeselectAll(ordersForSelection)}
                      className="text-gray-600 bg-white border-gray-300"
                    >
                      Deselect All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersForSelection.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No orders available in this category
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {ordersForSelection.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => handleOrderToggle(order.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {order.trackingCode}
                              </span>
                              {order.isFragile && (
                                <Badge variant="destructive">Fragile</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Weight: {order.weight} kg
                            </p>
                            {order.deliveryAddress && (
                              <p className="text-xs text-gray-500">
                                {order.deliveryAddress.addressLine ||
                                  "Address not available"}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Batch Details Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Shipment Date *</Label>
                  <Input
                    type="date"
                    value={shipmentDate}
                    onChange={(e) => setShipmentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Destination Branch *</Label>
                  <Select
                    value={destinationBranchId}
                    onValueChange={(value) => setDestinationBranchId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}{" "}
                          {branch.location
                            ? `- ${branch.location}`
                            : `(${branch.id})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingBranches && (
                    <p className="text-xs text-gray-500">Loading branches...</p>
                  )}
                  {!loadingBranches && branches.length === 0 && (
                    <p className="text-xs text-red-500">
                      No branches available. Please create a branch first.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex gap-2">
                    <Input
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                      placeholder="Add category"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      size="sm"
                    >
                      <IoAdd className="h-4 w-4" />
                    </Button>
                  </div>
                  {category.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {category.map((cat) => (
                        <Badge
                          key={cat}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {cat}
                          <button
                            onClick={() => handleRemoveCategory(cat)}
                            className="ml-1 hover:text-red-500"
                          >
                            <IoRemove className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Fragile Status</Label>
                  {batchIsFragile ? (
                    <Badge variant="destructive" className="text-xs">
                      Contains fragile items
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      No fragile items
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>

                {selectedOrders.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">
                      Selected Orders: {selectedOrders.length}
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {selectedOrdersData.map((order) => (
                        <Badge key={order.id} variant="outline">
                          {order.trackingCode}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => navigate("/batch")}
                variant="outline"
                className="w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-5 py-2 text-sm font-medium transition-colors shadow-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || selectedOrders.length === 0}
                className="w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <Spinner className="h-4 w-4 text-white mr-2" />
                    Creating...
                  </span>
                ) : (
                  "Create Batch"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        trackingNumber={batchCode}
        title="Batch Created Successfully!"
        description="Your batch has been created and is ready for dispatch."
        trackingLabel="Batch Code"
        qrCodeLabel="Scan this QR code to track your batch"
      />
    </div>
  );
}

export default CreateBatchPage;
