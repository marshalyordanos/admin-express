import { useState, useEffect } from "react";
import { useOrderReport } from "@/hooks/useOrderReport";
import type { OrderReportFilters, OrderReportResponse } from "@/lib/api/report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Package,
  DollarSign,
  X,
} from "lucide-react";

export default function OrderReportPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderReportFilters>({
    startDate: "",
    endDate: "",
    dateField: "createdAt",
    groupBy: "month",
    serviceType: undefined,
    shippingScope: undefined,
    fulfillmentType: undefined,
    shipmentType: undefined,
    isFragile: undefined,
    isUnusual: undefined,
    lateDeliveryOnly: undefined,
  });

  const { data, isLoading, error, refetch } = useOrderReport(filters);

  const summary = (data as OrderReportResponse | undefined)?.summary;
  const pagination = (data as OrderReportResponse | undefined)?.pagination;

  const totalOrders =
    summary?.totalOrders ?? summary?.data.length ?? pagination?.total ?? 0;
  const totalRevenue = summary?.totalRevenue ?? 0;

  const hasActiveFilters =
    !!filters.startDate ||
    !!filters.endDate ||
    !!filters.serviceType ||
    !!filters.shippingScope ||
    !!filters.fulfillmentType ||
    !!filters.shipmentType ||
    !!filters.status ||
    !!filters.isFragile ||
    !!filters.lateDeliveryOnly;

  useEffect(() => {
    console.log("Order Detailed Report Data:", data);
  }, [data]);

  const handleApplyFilters = () => {
    refetch();
    setIsFilterOpen(false);
  };

  const toggleExpanded = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
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
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                >
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
                    <Label
                      htmlFor="shippingScope"
                      className="text-xs font-medium"
                    >
                      Shipping Scope
                    </Label>
                    <Select
                      value={filters.shippingScope ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          shippingScope: (v === "all"
                            ? undefined
                            : v) as OrderReportFilters["shippingScope"],
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
                        <SelectItem value="INTERNATIONAL">
                          International
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="serviceType"
                      className="text-xs font-medium"
                    >
                      Service Type
                    </Label>
                    <Select
                      value={filters.serviceType ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          serviceType: (v === "all"
                            ? undefined
                            : v) as OrderReportFilters["serviceType"],
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
                    <Label
                      htmlFor="fulfillmentType"
                      className="text-xs font-medium"
                    >
                      Fulfillment Type
                    </Label>
                    <Select
                      value={filters.fulfillmentType ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          fulfillmentType: (v === "all"
                            ? undefined
                            : v) as OrderReportFilters["fulfillmentType"],
                        }))
                      }
                    >
                      <SelectTrigger
                        id="fulfillmentType"
                        className="h-9 w-full"
                      >
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
                          serviceType: undefined,
                          shippingScope: undefined,
                          fulfillmentType: undefined,
                          shipmentType: undefined,
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

      {/* Applied Filters */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">
            Applied filters:
          </span>

          {filters.startDate && filters.endDate && (
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  startDate: undefined,
                  endDate: undefined,
                }));
              }}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
            >
              <span>
                Date: {filters.startDate} → {filters.endDate}
              </span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.serviceType && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  serviceType: undefined,
                }))
              }
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-100"
            >
              <span>Service: {filters.serviceType}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.fulfillmentType && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  fulfillmentType: undefined,
                }))
              }
              className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-100"
            >
              <span>Fulfillment: {filters.fulfillmentType}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.shippingScope && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  shippingScope: undefined,
                }))
              }
              className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700 hover:bg-orange-100"
            >
              <span>Scope: {filters.shippingScope}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.shipmentType && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  shipmentType: undefined,
                }))
              }
              className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-700 hover:bg-teal-100"
            >
              <span>Shipment: {filters.shipmentType}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.isFragile && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  isFragile: false,
                }))
              }
              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100"
            >
              <span>Fragile only</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {filters.lateDeliveryOnly && (
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  lateDeliveryOnly: false,
                }))
              }
              className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs text-red-700 hover:bg-red-100"
            >
              <span>Late only</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tracking Code</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Service
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Fulfillment
                        </TableHead>
                        <TableHead className="hidden xl:table-cell">
                          Scope
                        </TableHead>
                        <TableHead className="hidden xl:table-cell">
                          Weight (kg)
                        </TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary.data.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        return (
                          <>
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                {order.trackingCode ?? order.id}
                              </TableCell>
                              <TableCell>
                                {order.customer?.name ?? "Unknown"}
                              </TableCell>
                              <TableCell>
                                <span className="text-xs rounded-full bg-blue-50 text-blue-700 px-2 py-0.5">
                                  {order.status ?? "—"}
                                </span>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {order.serviceType ?? "—"}
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                {order.fulfillmentType ?? "—"}
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                {order.shippingScope ?? "—"}
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                {order.weight != null ? order.weight : "—"}
                              </TableCell>
                              <TableCell>
                                {(order.finalPrice ?? 0).toLocaleString()}{" "}
                                {order.currency ?? "ETB"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleString()
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleExpanded(order.id)}
                                  className="gap-2"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-4 w-4" />
                                      Hide
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-4 w-4" />
                                      Details
                                    </>
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow key={`${order.id}-details`}>
                                <TableCell colSpan={10} className="bg-gray-50">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-gray-700">
                                    <div>
                                      <span className="font-semibold">
                                        Service:
                                      </span>{" "}
                                      {order.serviceType ?? "—"} ·{" "}
                                      {order.fulfillmentType ?? "—"}
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Scope:
                                      </span>{" "}
                                      {order.shippingScope ?? "—"} ·{" "}
                                      {order.shipmentType ?? "—"}
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Route:
                                      </span>{" "}
                                      {order.originCityRaw ?? "—"} →{" "}
                                      {order.destinationCityRaw ?? "—"}
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Pickup:
                                      </span>{" "}
                                      {order.pickupDate
                                        ? new Date(
                                            order.pickupDate,
                                          ).toLocaleString()
                                        : "—"}
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Delivery:
                                      </span>{" "}
                                      {order.deliveryDate
                                        ? new Date(
                                            order.deliveryDate,
                                          ).toLocaleString()
                                        : "—"}
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Created At:
                                      </span>{" "}
                                      {order.createdAt
                                        ? new Date(
                                            order.createdAt,
                                          ).toLocaleString()
                                        : "—"}
                                    </div>
                                    <div className="sm:col-span-2">
                                      <span className="font-semibold">
                                        Customer:
                                      </span>{" "}
                                      {order.customer?.name ?? "—"}{" "}
                                      {order.customer?.phone
                                        ? `(${order.customer.phone})`
                                        : ""}
                                    </div>
                                    <div className="sm:col-span-2">
                                      <span className="font-semibold">
                                        Receiver:
                                      </span>{" "}
                                      {order.receiver?.name ?? "—"}{" "}
                                      {order.receiver?.phone
                                        ? `(${order.receiver.phone})`
                                        : ""}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
