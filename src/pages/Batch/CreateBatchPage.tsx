"use client";

import { useEffect, useState } from "react";
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
import type { Order, CategorizedOrdersResponse } from "@/types/types";
import toast from "react-hot-toast";
import { Skeleton } from "antd";
import { Spinner } from "@/utils/spinner";
import SuccessModal from "@/components/common/SuccessModal";

const SCOPES = ["IN_TOWN", "REGIONAL", "INTERNATIONAL"] as const;
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
  const [isFragile, setIsFragile] = useState(false);
  const [notes, setNotes] = useState("");
  const [weight, setWeight] = useState("");
  const [shipmentDate, setShipmentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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

  useEffect(() => {
    fetchCategorizedOrders();
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

  const getOrdersForSelection = (): Order[] => {
    if (!categorizedOrders || !selectedScope || !selectedServiceType) {
      return [];
    }
    // Handle both "TOWN" and "IN_TOWN" - API returns "TOWN" but we use "IN_TOWN" for batch creation
    const scopeKey = selectedScope === "IN_TOWN" ? "TOWN" : selectedScope;
    const scopeData = categorizedOrders.grouped[scopeKey as keyof typeof categorizedOrders.grouped];
    return scopeData?.[selectedServiceType] || [];
  };

  // Get available scopes from the API response
  const getAvailableScopes = (): string[] => {
    if (!categorizedOrders) return [];
    const available: string[] = [];
    if (categorizedOrders.grouped.TOWN || categorizedOrders.grouped.IN_TOWN) {
      available.push("IN_TOWN");
    }
    if (categorizedOrders.grouped.REGIONAL) {
      available.push("REGIONAL");
    }
    if (categorizedOrders.grouped.INTERNATIONAL) {
      available.push("INTERNATIONAL");
    }
    return available;
  };

  const handleSubmit = async () => {
    if (!selectedScope || !selectedServiceType) {
      toast.error("Please select scope and service type");
      return;
    }

    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order");
      return;
    }

    // Resolve origin and destination automatically from the first selected order
    const ordersForSelection = getOrdersForSelection();
    const firstSelectedOrder = ordersForSelection.find(
      (o) => o.id === selectedOrders[0]
    );

    if (!firstSelectedOrder) {
      toast.error("Unable to resolve addresses from selected order");
      return;
    }

    const originId = firstSelectedOrder.pickupAddressId;
    const destinationId = firstSelectedOrder.deliveryAddressId;

    if (!shipmentDate) {
      toast.error("Please select a shipment date");
      return;
    }

    try {
      setSubmitting(true);
      const batchData = {
        // Backend expects "TOWN" instead of "IN_TOWN"
        scope: selectedScope === "IN_TOWN" ? ("TOWN" as const) : selectedScope,
        serviceType: selectedServiceType,
        // If user didn't manually add category, derive from first order if available
        category:
          category.length > 0
            ? category
            : Array.isArray(firstSelectedOrder.category) &&
              firstSelectedOrder.category.length > 0
            ? firstSelectedOrder.category
            : undefined,
        isFragile,
        originId,
        destinationId,
        notes: notes || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        orders: selectedOrders,
        shipmentDate,
      };

      const response = await createBatch(batchData);
      toast.success(response.message || "Batch created successfully");
      // Show success modal with batch code
      setBatchCode(response.data?.batchCode || "");
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

  const ordersForSelection = getOrdersForSelection();
  const selectedOrdersData = ordersForSelection.filter((o) =>
    selectedOrders.includes(o.id)
  );

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
                        ? getAvailableScopes().map((scope) => (
                            <SelectItem key={scope} value={scope}>
                              {scope === "IN_TOWN" ? "IN TOWN" : scope.replace("_", " ")}
                            </SelectItem>
                          ))
                        : SCOPES.map((scope) => (
                            <SelectItem key={scope} value={scope}>
                              {scope === "IN_TOWN" ? "IN TOWN" : scope.replace("_", " ")}
                            </SelectItem>
                          ))}
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
                        {SERVICE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.replace("_", " ")}
                          </SelectItem>
                        ))}
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
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Total batch weight"
                  />
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

                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isFragile}
                    onCheckedChange={(checked) =>
                      setIsFragile(checked as boolean)
                    }
                  />
                  <Label>Fragile Items</Label>
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
