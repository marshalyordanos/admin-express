"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IoLocation,
  IoTime,
  IoPerson,
  IoCar,
  IoMap,
  IoRefresh,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoPlay,
  IoPause,
  IoStop,
  IoTrendingUp,
  IoTrendingDown,
  IoStatsChart,
  IoNavigate,
  IoRadio,
  IoShield,
} from "react-icons/io5";

// Mock data for demonstration
const drivers = [
  {
    id: "1",
    name: "John Smith",
    status: "On Route",
    currentLocation: "123 Main St",
    vehicle: "Van #001",
    capacity: 15,
    currentLoad: 8,
    rating: 4.8,
    phone: "+1 (555) 123-4567",
    lastUpdate: "2 min ago",
    route: "Route A",
    deliveries: 12,
    completed: 8,
    remaining: 4,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    status: "Available",
    currentLocation: "Warehouse",
    vehicle: "Truck #002",
    capacity: 25,
    currentLoad: 0,
    rating: 4.9,
    phone: "+1 (555) 234-5678",
    lastUpdate: "5 min ago",
    route: "None",
    deliveries: 0,
    completed: 0,
    remaining: 0,
  },
  {
    id: "3",
    name: "Mike Wilson",
    status: "On Break",
    currentLocation: "456 Oak Ave",
    vehicle: "Van #003",
    capacity: 12,
    currentLoad: 5,
    rating: 4.7,
    phone: "+1 (555) 345-6789",
    lastUpdate: "10 min ago",
    route: "Route B",
    deliveries: 6,
    completed: 3,
    remaining: 3,
  },
  {
    id: "4",
    name: "Lisa Brown",
    status: "Offline",
    currentLocation: "Home",
    vehicle: "Van #004",
    capacity: 10,
    currentLoad: 0,
    rating: 4.6,
    phone: "+1 (555) 456-7890",
    lastUpdate: "1 hour ago",
    route: "None",
    deliveries: 0,
    completed: 0,
    remaining: 0,
  },
];

const pendingDeliveries = [
  {
    id: "#1002",
    customer: "Wade Warren",
    address: "123 Main St, New York, NY",
    priority: "High",
    serviceType: "Same-day",
    weight: 2.5,
    status: "Ready for Dispatch",
    estimatedTime: "30 min",
    distance: "2.3 mi",
    driver: null,
  },
  {
    id: "#1004",
    customer: "Esther Howard",
    address: "456 Oak Ave, Brooklyn, NY",
    priority: "Normal",
    serviceType: "Standard",
    weight: 1.8,
    status: "Ready for Dispatch",
    estimatedTime: "45 min",
    distance: "3.1 mi",
    driver: null,
  },
  {
    id: "#1007",
    customer: "Jenny Wilson",
    address: "789 Pine St, Queens, NY",
    priority: "Low",
    serviceType: "Overnight",
    weight: 3.2,
    status: "Assigned",
    estimatedTime: "60 min",
    distance: "4.5 mi",
    driver: "John Smith",
  },
];

const routes = [
  {
    id: "route-a",
    name: "Route A - Downtown",
    driver: "John Smith",
    status: "Active",
    deliveries: 8,
    completed: 4,
    remaining: 4,
    estimatedCompletion: "2:30 PM",
    totalDistance: "15.2 mi",
    efficiency: 85,
  },
  {
    id: "route-b",
    name: "Route B - Brooklyn",
    driver: "Mike Wilson",
    status: "Active",
    deliveries: 6,
    completed: 3,
    remaining: 3,
    estimatedCompletion: "3:15 PM",
    totalDistance: "12.8 mi",
    efficiency: 78,
  },
  {
    id: "route-c",
    name: "Route C - Queens",
    driver: null,
    status: "Planned",
    deliveries: 5,
    completed: 0,
    remaining: 5,
    estimatedCompletion: "4:00 PM",
    totalDistance: "18.5 mi",
    efficiency: 0,
  },
];

const metrics = [
  {
    title: "Active Drivers",
    value: "3",
    change: "+1 from yesterday",
    trend: "up",
    color: "green",
  },
  {
    title: "Deliveries Today",
    value: "24",
    change: "12% increase",
    trend: "up",
    color: "blue",
  },
  {
    title: "On-Time Rate",
    value: "94%",
    change: "2% improvement",
    trend: "up",
    color: "green",
  },
  {
    title: "Route Efficiency",
    value: "87%",
    change: "5% increase",
    trend: "up",
    color: "purple",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "On Route":
      return "bg-blue-100 text-blue-700";
    case "Available":
      return "bg-green-100 text-green-700";
    case "On Break":
      return "bg-yellow-100 text-yellow-700";
    case "Offline":
      return "bg-gray-100 text-gray-700";
    case "Active":
      return "bg-green-100 text-green-700";
    case "Planned":
      return "bg-orange-100 text-orange-700";
    case "Completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Normal":
      return "bg-blue-100 text-blue-700";
    case "Low":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function Dispatch() {
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const handleDriverSelection = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const handleDeliverySelection = (deliveryId: string) => {
    setSelectedDeliveries((prev) =>
      prev.includes(deliveryId)
        ? prev.filter((id) => id !== deliveryId)
        : [...prev, deliveryId]
    );
  };

  const handleAssignDelivery = () => {
    if (selectedDriver && selectedDeliveries.length > 0) {
      console.log("Assigning deliveries to driver:", {
        driver: selectedDriver,
        deliveries: selectedDeliveries,
      });
      // Handle assignment logic here
    }
  };

  const handleStartRoute = (routeId: string) => {
    console.log("Starting route:", routeId);
    // Handle route start logic here
  };

  const handlePauseRoute = (routeId: string) => {
    console.log("Pausing route:", routeId);
    // Handle route pause logic here
  };

  const handleCompleteRoute = (routeId: string) => {
    console.log("Completing route:", routeId);
    // Handle route completion logic here
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dispatch Center
            </h1>
            <p className="text-gray-600 mt-2">
              Manage drivers, routes, and deliveries in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <IoRefresh className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <IoNavigate className="h-4 w-4 mr-2" />
              Optimize Routes
            </Button>
          </div>
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
                        <IoTrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <IoTrendingDown className="h-3 w-3 text-red-500 mr-1" />
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
                  <IoStatsChart className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          {["overview", "drivers", "routes", "deliveries"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={`capitalize hover:bg-white ${
                activeTab === tab
                  ? "bg-white text-gray-900"
                  : "text-gray-600 hover:text-gray-900 "
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Drivers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IoPerson className="h-5 w-5" />
                  Active Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers
                    .filter((driver) => driver.status === "On Route")
                    .map((driver) => (
                      <div
                        key={driver.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IoPerson className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-gray-500">
                              {driver.vehicle} • {driver.currentLocation}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {driver.completed}/{driver.deliveries} completed
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Deliveries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IoLocation className="h-5 w-5" />
                  Pending Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingDeliveries
                    .filter(
                      (delivery) => delivery.status === "Ready for Dispatch"
                    )
                    .map((delivery) => (
                      <div
                        key={delivery.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{delivery.id}</p>
                          <p className="text-sm text-gray-500">
                            {delivery.customer} • {delivery.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={getPriorityColor(delivery.priority)}
                          >
                            {delivery.priority}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            {delivery.estimatedTime}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IoPerson className="h-5 w-5" />
                  Driver Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Load</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <IoPerson className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-sm text-gray-500">
                                ★ {driver.rating} • {driver.phone}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{driver.vehicle}</p>
                            <p className="text-sm text-gray-500">
                              {driver.currentLocation}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (driver.currentLoad / driver.capacity) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {driver.currentLoad}/{driver.capacity}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {driver.route}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {driver.completed}/{driver.deliveries}
                            </p>
                            <p className="text-gray-500">
                              {driver.remaining} remaining
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <IoRadio className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <IoMap className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === "routes" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IoMap className="h-5 w-5" />
                  Route Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {routes.map((route) => (
                    <Card key={route.id} className="bg-white">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {route.name}
                          </CardTitle>
                          <Badge className={getStatusColor(route.status)}>
                            {route.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Driver: {route.driver || "Unassigned"}
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Deliveries</p>
                            <p className="font-medium">
                              {route.completed}/{route.deliveries}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Distance</p>
                            <p className="font-medium">{route.totalDistance}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Efficiency</p>
                            <p className="font-medium">{route.efficiency}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">ETA</p>
                            <p className="font-medium">
                              {route.estimatedCompletion}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3">
                          {route.status === "Active" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePauseRoute(route.id)}
                              >
                                <IoPause className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCompleteRoute(route.id)}
                              >
                                <IoCheckmarkCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {route.status === "Planned" && (
                            <Button
                              size="sm"
                              onClick={() => handleStartRoute(route.id)}
                            >
                              <IoPlay className="h-4 w-4 mr-2" />
                              Start Route
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === "deliveries" && (
          <div className="space-y-6">
            {/* Assignment Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IoLocation className="h-5 w-5" />
                  Delivery Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Select Driver
                    </label>
                    <Select
                      value={selectedDriver}
                      onValueChange={handleDriverSelection}
                    >
                      <SelectTrigger className="bg-gray-50 border-0 py-3">
                        <SelectValue placeholder="Choose a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers
                          .filter((driver) => driver.status === "Available")
                          .map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{driver.name}</span>
                                <span className="text-sm text-gray-500 ml-4">
                                  {driver.vehicle}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAssignDelivery}
                    disabled={
                      !selectedDriver || selectedDeliveries.length === 0
                    }
                    className="mt-6"
                  >
                    Assign Deliveries
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    {selectedDeliveries.length} delivery(ies) selected for
                    assignment
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Deliveries Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IoLocation className="h-5 w-5" />
                  All Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Driver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedDeliveries.includes(delivery.id)}
                            onCheckedChange={() =>
                              handleDeliverySelection(delivery.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {delivery.id}
                        </TableCell>
                        <TableCell>{delivery.customer}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{delivery.address}</p>
                            <p className="text-xs text-gray-500">
                              {delivery.distance} • {delivery.estimatedTime}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getPriorityColor(delivery.priority)}
                          >
                            {delivery.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {delivery.serviceType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              delivery.status === "Assigned"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              delivery.status === "Assigned"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {delivery.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {delivery.driver || "Unassigned"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
