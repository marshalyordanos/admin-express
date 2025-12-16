"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IoArrowBack, IoAdd } from "react-icons/io5";
import { getBatches, addOrdersToBatch, getCategorizedOrders } from "@/lib/api/batch";
import type { Batch, Order, CategorizedOrdersResponse } from "@/types/types";
import toast from "react-hot-toast";
import { Skeleton } from "antd";
import { Spinner } from "@/utils/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function BatchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [showAddOrders, setShowAddOrders] = useState(false);
  const [categorizedOrders, setCategorizedOrders] =
    useState<CategorizedOrdersResponse | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchBatch = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getBatches({ page: 1, pageSize: 1 });
      const foundBatch = response.data.find((b) => b.id === id);
      if (foundBatch) {
        setBatch(foundBatch);
      } else {
        toast.error("Batch not found");
        navigate("/batch");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const message =
        error?.response?.data?.message || "Failed to load batch";
      toast.error(message);
    }
  };

  const fetchCategorizedOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await getCategorizedOrders({ pageSize: 100 });
      setCategorizedOrders(response.data);
      setLoadingOrders(false);
    } catch (error: any) {
      setLoadingOrders(false);
      toast.error("Failed to load available orders");
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [id]);

  useEffect(() => {
    if (showAddOrders) {
      fetchCategorizedOrders();
    }
  }, [showAddOrders]);

  const handleOrderToggle = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getAvailableOrders = (): Order[] => {
    if (!categorizedOrders || !batch) return [];
    // Handle both "TOWN" and "IN_TOWN" - API returns "TOWN" but batch uses "IN_TOWN"
    const scopeKey = batch.scope === "IN_TOWN" ? "TOWN" : batch.scope;
    const scopeData = categorizedOrders.grouped[scopeKey as keyof typeof categorizedOrders.grouped];
    const orders = scopeData?.[batch.serviceType] || [];
    return orders.filter((order) => !batch.orders.some((bo) => bo.id === order.id));
  };

  const handleAddOrders = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order");
      return;
    }

    if (!id) return;

    try {
      setSubmitting(true);
      const response = await addOrdersToBatch(id, { orders: selectedOrders });
      toast.success(response.message || "Orders added successfully");
      setShowAddOrders(false);
      setSelectedOrders([]);
      fetchBatch();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to add orders";
      toast.error(message);
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (!batch) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Batch not found</p>
        <Button onClick={() => navigate("/batch")} className="mt-4">
          Back to Batches
        </Button>
      </div>
    );
  }

  const availableOrders = getAvailableOrders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/batch")}
          className="flex items-center gap-2"
        >
          <IoArrowBack className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Batch Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">{batch.batchCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Information */}
          <Card>
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Batch Code</Label>
                  <p className="font-medium">{batch.batchCode}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <div>
                    <Badge className={getStatusColor(batch.status)}>
                      {batch.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Scope</Label>
                  <div>
                    <Badge className={getScopeColor(batch.scope)}>
                      {batch.scope}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Service Type</Label>
                  <p className="font-medium">{batch.serviceType}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Weight</Label>
                  <p className="font-medium">
                    {batch.weight ? `${batch.weight} kg` : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Fragile</Label>
                  <p className="font-medium">{batch.isFragile ? "Yes" : "No"}</p>
                </div>
                {batch.awbNumber && (
                  <div>
                    <Label className="text-gray-500">AWB Number</Label>
                    <p className="font-medium">{batch.awbNumber}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-500">Created At</Label>
                  <p className="font-medium">
                    {batch.createdAt
                      ? new Date(batch.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {batch.category && batch.category.length > 0 && (
                <div>
                  <Label className="text-gray-500">Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {batch.category.map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {batch.notes && (
                <div>
                  <Label className="text-gray-500">Notes</Label>
                  <p className="mt-1">{batch.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Orders ({batch.orders?.length || 0})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddOrders(!showAddOrders)}
                className="flex items-center gap-2"
              >
                <IoAdd className="h-4 w-4" />
                Add Orders
              </Button>
            </CardHeader>
            <CardContent>
              {batch.orders && batch.orders.length > 0 ? (
                <div className="space-y-2">
                  {batch.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{order.trackingCode}</p>
                        <p className="text-sm text-gray-500">ID: {order.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No orders in this batch
                </p>
              )}
            </CardContent>
          </Card>

          {/* Add Orders Modal */}
          {showAddOrders && (
            <Card>
              <CardHeader>
                <CardTitle>Add Orders to Batch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingOrders ? (
                  <Skeleton active paragraph={{ rows: 5 }} />
                ) : availableOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No available orders in this category
                  </p>
                ) : (
                  <>
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {availableOrders.map((order) => (
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
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddOrders(false);
                          setSelectedOrders([]);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddOrders}
                        disabled={submitting || selectedOrders.length === 0}
                        className="flex-1"
                      >
                        {submitting ? <Spinner /> : "Add Selected Orders"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-500">Origin ID</Label>
                <p className="font-medium">{batch.originId}</p>
              </div>
              <div>
                <Label className="text-gray-500">Destination ID</Label>
                <p className="font-medium">{batch.destinationId}</p>
              </div>
              {batch.driverId && (
                <div>
                  <Label className="text-gray-500">Driver ID</Label>
                  <p className="font-medium">{batch.driverId}</p>
                </div>
              )}
              {batch.vehicleId && (
                <div>
                  <Label className="text-gray-500">Vehicle ID</Label>
                  <p className="font-medium">{batch.vehicleId}</p>
                </div>
              )}
              {batch.officerId && (
                <div>
                  <Label className="text-gray-500">Officer ID</Label>
                  <p className="font-medium">{batch.officerId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BatchDetailsPage;
