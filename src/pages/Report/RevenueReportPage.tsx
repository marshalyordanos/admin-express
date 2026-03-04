import { useState, useEffect } from "react";
import { useRevenueReport } from "@/hooks/useRevenueReport";
import type { RevenueReportFilters } from "@/lib/api/report";
import type { RevenueReportGroup } from "@/types/report";
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
import { Filter, RefreshCw, DollarSign, Package, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function RevenueReportPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<RevenueReportFilters>({
    page: 1,
    limit: 20,
    groupBy: "month",
    revenueType: "gross",
    currency: "ETB",
    serviceType: undefined,
    shippingScope: undefined,
    fulfillmentType: undefined,
    deliveredOnly: false,
    lateOnly: false,
    onTimeOnly: false,
  });

  const { data, isLoading, error, refetch } = useRevenueReport(filters);

  const groups: RevenueReportGroup[] = Array.isArray(data) ? data : [];
  const totalRevenue = groups.reduce((sum, g) => sum + (g.total_revenue ?? 0), 0);
  const totalOrders = groups.reduce((sum, g) => sum + (g.total_orders ?? 0), 0);
  const totalDriverEarnings = groups.reduce((sum, g) => sum + (g.total_driver_earnings ?? 0), 0);

  useEffect(() => {
    console.log("Revenue Report Data:", data);
  }, [data]);

  const handleApplyFilters = () => {
    refetch();
    setIsFilterOpen(false);
  };

  const defaultFilters: RevenueReportFilters = {
    startDate: undefined,
    endDate: undefined,
    page: 1,
    limit: 20,
    groupBy: "month",
    revenueType: "gross",
    currency: "ETB",
    serviceType: undefined,
    shippingScope: undefined,
    fulfillmentType: undefined,
    deliveredOnly: false,
    lateOnly: false,
    onTimeOnly: false,
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Revenue Reports
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Revenue analytics with filters and grouping
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 max-h-[85vh] overflow-y-auto" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Revenue Filters</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-xs font-medium">
                        From
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={filters.startDate ?? ""}
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
                        value={filters.endDate ?? ""}
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

                  <div className="space-y-2">
                    <Label htmlFor="groupBy" className="text-xs font-medium">
                      Group by
                    </Label>
                    <Select
                      value={filters.groupBy ?? "month"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({ ...prev, groupBy: v as "day" | "week" | "month" }))
                      }
                    >
                      <SelectTrigger id="groupBy" className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="revenueType" className="text-xs font-medium">
                      Revenue type
                    </Label>
                    <Select
                      value={filters.revenueType ?? "gross"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({ ...prev, revenueType: v as "gross" | "net" }))
                      }
                    >
                      <SelectTrigger id="revenueType" className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gross">Gross</SelectItem>
                        <SelectItem value="net">Net</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-xs font-medium">
                      Currency
                    </Label>
                    <Input
                      id="currency"
                      value={filters.currency ?? "ETB"}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, currency: e.target.value || "ETB" }))
                      }
                      className="h-9"
                      placeholder="ETB"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingScope" className="text-xs font-medium">
                      Shipping Scope
                    </Label>
                    <Select
                      value={filters.shippingScope ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          shippingScope: (v === "all" ? undefined : v) as RevenueReportFilters["shippingScope"],
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

                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-xs font-medium">
                      Service Type
                    </Label>
                    <Select
                      value={filters.serviceType ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          serviceType: (v === "all" ? undefined : v) as RevenueReportFilters["serviceType"],
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

                  <div className="space-y-2">
                    <Label htmlFor="fulfillmentType" className="text-xs font-medium">
                      Fulfillment Type
                    </Label>
                    <Select
                      value={filters.fulfillmentType ?? "all"}
                      onValueChange={(v) =>
                        setFilters((prev) => ({
                          ...prev,
                          fulfillmentType: (v === "all" ? undefined : v) as RevenueReportFilters["fulfillmentType"],
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

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="deliveredOnly"
                        checked={!!filters.deliveredOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({ ...prev, deliveredOnly: Boolean(checked) }))
                        }
                      />
                      <Label htmlFor="deliveredOnly" className="text-xs font-medium">
                        Delivered only
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="lateOnly"
                        checked={!!filters.lateOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({ ...prev, lateOnly: Boolean(checked) }))
                        }
                      />
                      <Label htmlFor="lateOnly" className="text-xs font-medium">
                        Late only
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="onTimeOnly"
                        checked={!!filters.onTimeOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({ ...prev, onTimeOnly: Boolean(checked) }))
                        }
                      />
                      <Label htmlFor="onTimeOnly" className="text-xs font-medium">
                        On time only
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilters({ ...defaultFilters })}
                      className="flex-1 cursor-pointer"
                    >
                      Reset all
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApplyFilters}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
                    >
                      Apply now
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={() => refetch()}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading revenue report...</span>
        </div>
      )}

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-600">Error loading revenue report: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                    {filters.currency ?? "ETB"}
                  </span>
                </div>
              </CardContent>
            </Card>
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
                  Total Driver Earnings
                </CardTitle>
                <DollarSign className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalDriverEarnings.toLocaleString()}{" "}
                  <span className="text-sm font-medium text-gray-500">
                    {filters.currency ?? "ETB"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Groups and orders */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by period</CardTitle>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <p className="text-sm text-gray-500">No revenue data found.</p>
              ) : (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <details
                      key={group.group_key}
                      className="group border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900">
                            {group.group_key
                              ? format(new Date(group.group_key), "MMM d, yyyy")
                              : "—"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {group.total_orders ?? 0} orders
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">
                            {(group.total_revenue ?? 0).toLocaleString()}{" "}
                            {filters.currency ?? "ETB"}
                          </span>
                          <span className="text-xs text-amber-600">
                            Driver: {(group.total_driver_earnings ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </summary>
                      <div className="mt-3 space-y-2 pl-6">
                        {(group.orders ?? []).length === 0 ? (
                          <p className="text-xs text-gray-500">No orders in this period.</p>
                        ) : (
                          group.orders.map((order) => (
                            <details
                              key={order.orderId}
                              className="border rounded-md p-2 hover:bg-gray-50/80"
                            >
                              <summary className="flex items-center justify-between cursor-pointer list-none text-sm">
                                <span className="font-medium text-gray-900">
                                  {order.trackingCode ?? order.orderId}
                                </span>
                                <span className="text-gray-600">
                                  {order.customer ?? "—"}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {(order.net ?? order.revenue ?? order.gross ?? 0).toLocaleString()}{" "}
                                  {filters.currency ?? "ETB"}
                                </span>
                              </summary>
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 pl-2">
                                <div>
                                  <span className="font-semibold">Customer:</span>{" "}
                                  {order.customer ?? "—"}
                                </div>
                                <div>
                                  <span className="font-semibold">Receiver:</span>{" "}
                                  {order.receiver ?? "—"}
                                </div>
                                <div>
                                  <span className="font-semibold">Gross:</span>{" "}
                                  {order.gross != null
                                    ? order.gross.toLocaleString()
                                    : "—"}
                                </div>
                                <div>
                                  <span className="font-semibold">Net:</span>{" "}
                                  {order.net != null ? order.net.toLocaleString() : "—"}
                                </div>
                                <div>
                                  <span className="font-semibold">Revenue:</span>{" "}
                                  {order.revenue != null
                                    ? order.revenue.toLocaleString()
                                    : "—"}
                                </div>
                                <div>
                                  <span className="font-semibold">Driver earnings:</span>{" "}
                                  {order.driverEarnings != null
                                    ? order.driverEarnings.toLocaleString()
                                    : "—"}
                                </div>
                              </div>
                            </details>
                          ))
                        )}
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
