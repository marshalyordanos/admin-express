import { useState, useEffect } from "react";
import { useOrderReport } from "@/hooks/useOrderReport";
import type { OrderReportFilters, OrderReportResponse } from "@/lib/api/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RefreshCw, Package, DollarSign } from "lucide-react";

export default function OrderReportPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<OrderReportFilters>({
    startDate: "",
    endDate: "",
    dateField: "createdAt",
    page: 1,
    limit: 20,
    groupBy: "month",
    serviceType: "STANDARD",
    shippingScope: "REGIONAL",
    fulfillmentType: "PICKUP",
    shipmentType: "PARCEL",
    isFragile: false,
    isUnusual: false,
    lateDeliveryOnly: false,
  });

  const { data, isLoading, error, refetch } = useOrderReport(filters);

  const summary = (data as OrderReportResponse | undefined)?.summary;
  const pagination = (data as OrderReportResponse | undefined)?.pagination;

  const totalOrders =
    summary?.totalOrders ?? summary?.data.length ?? pagination?.total ?? 0;
  const totalRevenue = summary?.totalRevenue ?? 0;

  useEffect(() => {
    console.log("Order Detailed Report Data:", data);
  }, [data]);

  const handleApplyFilters = () => {
    refetch();
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Order Reports
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Detailed analytics and filters for individual orders
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Order Filters</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="startDate"
                        className="text-xs font-medium"
                      >
                        From
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={filters.startDate || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            startDate: e.target.value || undefined,
                          }))
                        }
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-xs font-medium">
                        To
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={filters.endDate || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            endDate: e.target.value || undefined,
                          }))
                        }
                        className="h-9"
                      />
                    </div>
                  </div>

                  {/* Shipping scope */}
                  <div className="space-y-2">
                    <Label htmlFor="shippingScope" className="text-xs font-medium">
                      Shipping Scope
                    </Label>
                    <Select
                      value={filters.shippingScope ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          shippingScope: (v === "all" ? undefined : v) as OrderReportFilters["shippingScope"],
                        }))
                      }
                    >
                      <SelectTrigger id="shippingScope" className="h-9 w-full">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="REGIONAL">Regional</SelectItem>
                        <SelectItem value="TOWN">Town</SelectItem>
                        <SelectItem value="INTERNATIONAL">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-xs font-medium">
                      Service Type
                    </Label>
                    <Select
                      value={filters.serviceType ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          serviceType: (v === "all" ? undefined : v) as OrderReportFilters["serviceType"],
                        }))
                      }
                    >
                      <SelectTrigger id="serviceType" className="h-9 w-full">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="EXPRESS">Express</SelectItem>
                        <SelectItem value="SAME_DAY">Same Day</SelectItem>
                        <SelectItem value="OVERNIGHT">Overnight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fulfillment Type */}
                  <div className="space-y-2">
                    <Label htmlFor="fulfillmentType" className="text-xs font-medium">
                      Fulfillment Type
                    </Label>
                    <Select
                      value={filters.fulfillmentType ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          fulfillmentType: (v === "all" ? undefined : v) as OrderReportFilters["fulfillmentType"],
                        }))
                      }
                    >
                      <SelectTrigger id="fulfillmentType" className="h-9 w-full">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="PICKUP">Pickup</SelectItem>
                        <SelectItem value="DROPOFF">Dropoff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="minPrice" className="text-xs font-medium">
                        Min Price
                      </Label>
                      <Input
                        id="minPrice"
                        type="number"
                        value={filters.minPrice ?? ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxPrice" className="text-xs font-medium">
                        Max Price
                      </Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        value={filters.maxPrice ?? ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="minWeight"
                        className="text-xs font-medium"
                      >
                        Min Weight
                      </Label>
                      <Input
                        id="minWeight"
                        type="number"
                        value={filters.minWeight ?? ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            minWeight: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="maxWeight"
                        className="text-xs font-medium"
                      >
                        Max Weight
                      </Label>
                      <Input
                        id="maxWeight"
                        type="number"
                        value={filters.maxWeight ?? ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxWeight: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="h-9"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="isFragile"
                      checked={!!filters.isFragile}
                      onCheckedChange={(checked) =>
                        setFilters((prev) => ({
                          ...prev,
                          isFragile: Boolean(checked),
                        }))
                      }
                    />
                    <Label htmlFor="isFragile" className="text-xs font-medium">
                      Fragile shipments only
                    </Label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters({
                          startDate: "",
                          endDate: "",
                          dateField: "createdAt",
                          page: 1,
                          limit: 20,
                          groupBy: "month",
                          serviceType: "STANDARD",
                          shippingScope: "REGIONAL",
                          fulfillmentType: "PICKUP",
                          shipmentType: "PARCEL",
                          isFragile: false,
                          isUnusual: false,
                          lateDeliveryOnly: false,
                        })
                      }
                      className="flex-1 cursor-pointer"
                    >
                      Reset all
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApplyFilters}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                    >
                      Apply now
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading order report...</span>
        </div>
      )}

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600">
              Error loading order report: {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && summary && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Orders
                </CardTitle>
                <Package className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalOrders.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalRevenue.toLocaleString()}{" "}
                  <span className="text-sm font-medium text-gray-500">
                    {summary.data[0]?.currency ?? "ETB"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders list */}
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {summary.data.length === 0 ? (
                <p className="text-sm text-gray-500">No orders found.</p>
              ) : (
                <div className="space-y-3">
                  {summary.data.map((order) => (
                    <details
                      key={order.id}
                      className="group border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.trackingCode}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.customer?.name ?? "Unknown customer"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">
                            {order.status ?? "—"}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {(order.finalPrice ?? 0).toLocaleString()} {order.currency ?? "ETB"}
                          </span>
                        </div>
                      </summary>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-700">
                        <div>
                          <span className="font-semibold">Service:</span>{" "}
                          {order.serviceType ?? "—"} · {order.fulfillmentType ?? "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Route:</span>{" "}
                          {order.originCityRaw ?? "—"} → {order.destinationCityRaw ?? "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Weight:</span>{" "}
                          {order.weight != null ? `${order.weight} kg` : "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Pickup:</span>{" "}
                          {order.pickupDate
                            ? new Date(order.pickupDate).toLocaleString()
                            : "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Delivery:</span>{" "}
                          {order.deliveryDate
                            ? new Date(order.deliveryDate).toLocaleString()
                            : "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Created At:</span>{" "}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "—"}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-semibold">Customer:</span>{" "}
                          {order.customer?.name} ({order.customer?.phone})
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-semibold">Receiver:</span>{" "}
                          {order.receiver?.name} ({order.receiver?.phone})
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

