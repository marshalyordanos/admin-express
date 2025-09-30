"use client";

import { useState } from "react";
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
import {
  // IoLocation,
  // IoMap,
  IoRefresh,
  // IoCheckmarkCircle,
  // IoPlay,
  // IoPause,
  IoTrendingUp,
  IoTrendingDown,
  IoStatsChart,
} from "react-icons/io5";
import { ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DispatchModal from "@/components/common/DispatchModal";
import DriversMapView from "@/components/common/DriversMapView";
import CreateDriverModal from "@/components/common/CreateDriverModal";

// Mock data for demonstration
// const drivers = [
//   {
//     id: "1",
//     name: "John Smith",
//     status: "On Route",
//     currentLocation: "123 Main St",
//     vehicle: "Van #001",
//     capacity: 15,
//     currentLoad: 8,
//     rating: 4.8,
//     phone: "+1 (555) 123-4567",
//     lastUpdate: "2 min ago",
//     route: "Route A",
//     deliveries: 12,
//     completed: 8,
//     remaining: 4,
//   },
//   {
//     id: "2",
//     name: "Sarah Johnson",
//     status: "Available",
//     currentLocation: "Warehouse",
//     vehicle: "Truck #002",
//     capacity: 25,
//     currentLoad: 0,
//     rating: 4.9,
//     phone: "+1 (555) 234-5678",
//     lastUpdate: "5 min ago",
//     route: "None",
//     deliveries: 0,
//     completed: 0,
//     remaining: 0,
//   },
//   {
//     id: "3",
//     name: "Mike Wilson",
//     status: "On Break",
//     currentLocation: "456 Oak Ave",
//     vehicle: "Van #003",
//     capacity: 12,
//     currentLoad: 5,
//     rating: 4.7,
//     phone: "+1 (555) 345-6789",
//     lastUpdate: "10 min ago",
//     route: "Route B",
//     deliveries: 6,
//     completed: 3,
//     remaining: 3,
//   },
//   {
//     id: "4",
//     name: "Lisa Brown",
//     status: "Offline",
//     currentLocation: "Home",
//     vehicle: "Van #004",
//     capacity: 10,
//     currentLoad: 0,
//     rating: 4.6,
//     phone: "+1 (555) 456-7890",
//     lastUpdate: "1 hour ago",
//     route: "None",
//     deliveries: 0,
//     completed: 0,
//     remaining: 0,
//   },
// ];

// const pendingDeliveries = [
//   {
//     id: "#1002",
//     customer: "Wade Warren",
//     address: "123 Main St, New York, NY",
//     priority: "High",
//     serviceType: "Same-day",
//     weight: 2.5,
//     status: "Ready for Dispatch",
//     estimatedTime: "30 min",
//     distance: "2.3 mi",
//     driver: null,
//   },
//   {
//     id: "#1004",
//     customer: "Esther Howard",
//     address: "456 Oak Ave, Brooklyn, NY",
//     priority: "Normal",
//     serviceType: "Standard",
//     weight: 1.8,
//     status: "Ready for Dispatch",
//     estimatedTime: "45 min",
//     distance: "3.1 mi",
//     driver: null,
//   },
//   {
//     id: "#1007",
//     customer: "Jenny Wilson",
//     address: "789 Pine St, Queens, NY",
//     priority: "Low",
//     serviceType: "Overnight",
//     weight: 3.2,
//     status: "Assigned",
//     estimatedTime: "60 min",
//     distance: "4.5 mi",
//     driver: "John Smith",
//   },
// ];

// const routes = [
//   {
//     id: "route-a",
//     name: "Route A - Downtown",
//     driver: "John Smith",
//     status: "Active",
//     deliveries: 8,
//     completed: 4,
//     remaining: 4,
//     estimatedCompletion: "2:30 PM",
//     totalDistance: "15.2 mi",
//     efficiency: 85,
//   },
//   {
//     id: "route-b",
//     name: "Route B - Brooklyn",
//     driver: "Mike Wilson",
//     status: "Active",
//     deliveries: 6,
//     completed: 3,
//     remaining: 3,
//     estimatedCompletion: "3:15 PM",
//     totalDistance: "12.8 mi",
//     efficiency: 78,
//   },
//   {
//     id: "route-c",
//     name: "Route C - Queens",
//     driver: null,
//     status: "Planned",
//     deliveries: 5,
//     completed: 0,
//     remaining: 5,
//     estimatedCompletion: "4:00 PM",
//     totalDistance: "18.5 mi",
//     efficiency: 0,
//   },
// ];

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

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "On Route":
//       return "bg-blue-100 text-blue-700";
//     case "Available":
//       return "bg-green-100 text-green-700";
//     case "On Break":
//       return "bg-yellow-100 text-yellow-700";
//     case "Offline":
//       return "bg-gray-100 text-gray-700";
//     case "Active":
//       return "bg-green-100 text-green-700";
//     case "Planned":
//       return "bg-orange-100 text-orange-700";
//     case "Completed":
//       return "bg-blue-100 text-blue-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };

// const getPriorityColor = (priority: string) => {
//   switch (priority) {
//     case "High":
//       return "bg-red-100 text-red-700";
//     case "Normal":
//       return "bg-blue-100 text-blue-700";
//     case "Low":
//       return "bg-gray-100 text-gray-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };

const orders = [
  {
    id: "#1002",
    date: "11 Feb, 2024",
    customer: "Wade Warren",
    payment: "Pending",
    total: "$20.00",
    delivery: "N/A",
    items: "2 Items",
    fulfillment: "Unfulfilled",
    destination: "Town",
  },
  {
    id: "#1004",
    date: "13 Feb, 2024",
    customer: "Esther Howard",
    payment: "Success",
    total: "$22.00",
    delivery: "N/A",
    items: "3 Items",
    fulfillment: "Fulfilled",
    destination: "Regional",
  },
  {
    id: "#1007",
    date: "15 Feb, 2024",
    customer: "Jenny Wilson",
    payment: "Pending",
    total: "$25.00",
    delivery: "N/A",
    items: "1 Items",
    fulfillment: "Unfulfilled",
    destination: "International",
  },
  {
    id: "#1009",
    date: "17 Feb, 2024",
    customer: "Guy Hawkins",
    payment: "Success",
    total: "$27.00",
    delivery: "N/A",
    items: "5 Items",
    fulfillment: "Fulfilled",
    destination: "Town",
  },
  {
    id: "#1011",
    date: "19 Feb, 2024",
    customer: "Jacob Jones",
    payment: "Pending",
    total: "$32.00",
    delivery: "N/A",
    items: "4 Items",
    fulfillment: "Unfulfilled",
    destination: "Regional",
  },
  {
    id: "#1013",
    date: "21 Feb, 2024",
    customer: "Kristin Watson",
    payment: "Success",
    total: "$25.00",
    delivery: "N/A",
    items: "3 Items",
    fulfillment: "Fulfilled",
    destination: "International",
  },
  {
    id: "#1015",
    date: "23 Feb, 2024",
    customer: "Albert Flores",
    payment: "Pending",
    total: "$28.00",
    delivery: "N/A",
    items: "2 Items",
    fulfillment: "Unfulfilled",
    destination: "Town",
  },
  {
    id: "#1018",
    date: "25 Feb, 2024",
    customer: "Eleanor Pena",
    payment: "Success",
    total: "$35.00",
    delivery: "N/A",
    items: "1 Items",
    fulfillment: "Fulfilled",
    destination: "Regional",
  },
  {
    id: "#1019",
    date: "27 Feb, 2024",
    customer: "Theresa Webb",
    payment: "Pending",
    total: "$20.00",
    delivery: "N/A",
    items: "2 Items",
    fulfillment: "Unfulfilled",
    destination: "International",
  },
];

export default function Dispatch() {
  const navigate = useNavigate();
  // const [selectedDriver, setSelectedDriver] = useState("");
  // const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isCreateDriverModalOpen, setIsCreateDriverModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    customer: string;
    date: string;
    payment: string;
    total: string;
    delivery: string;
    items: string;
    fulfillment: string;
    destination: string;
  } | null>(null);

  // const handleDriverSelection = (driverId: string) => {
  //   setSelectedDriver(driverId);
  // };

  // const handleDeliverySelection = (deliveryId: string) => {
  //   setSelectedDeliveries((prev) =>
  //     prev.includes(deliveryId)
  //       ? prev.filter((id) => id !== deliveryId)
  //       : [...prev, deliveryId]
  //   );
  // };

  // const handleAssignDelivery = () => {
  //   if (selectedDriver && selectedDeliveries.length > 0) {
  //     console.log("Assigning deliveries to driver:", {
  //       driver: selectedDriver,
  //       deliveries: selectedDeliveries,
  //     });
  //     // Handle assignment logic here
  //   }
  // };

  // const handleStartRoute = (routeId: string) => {
  //   console.log("Starting route:", routeId);
  //   // Handle route start logic here
  // };

  // const handlePauseRoute = (routeId: string) => {
  //   console.log("Pausing route:", routeId);
  //   // Handle route pause logic here
  // };

  // const handleCompleteRoute = (routeId: string) => {
  //   console.log("Completing route:", routeId);
  //   // Handle route completion logic here
  // };

  const handleDispatchOrder = (order: {
    id: string;
    customer: string;
    date: string;
    payment: string;
    total: string;
    delivery: string;
    items: string;
    fulfillment: string;
    destination: string;
  }) => {
    console.log("Dispatching order:", order);
    setSelectedOrder(order);
    setIsDispatchModalOpen(true);
  };

  const handleDispatch = (driverId: string, notes?: string) => {
    console.log("Dispatching order:", {
      order: selectedOrder,
      driverId,
      notes,
    });
    // Handle dispatch logic here
    setIsDispatchModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseDispatchModal = () => {
    setIsDispatchModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCreateDriver = () => {
    setIsCreateDriverModalOpen(true);
  };

  const handleSaveDriver = (driverData: {
    name: string;
    email: string;
    phone: string;
    vehicle: string;
    vehicleType: string;
    capacity: number;
    licenseNumber: string;
    address: string;
    city: string;
    status: string;
    notes: string;
  }) => {
    console.log("Creating new driver:", driverData);
    // Handle driver creation logic here
    setIsCreateDriverModalOpen(false);
  };

  const handleCloseCreateDriverModal = () => {
    setIsCreateDriverModalOpen(false);
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
          {["orders", "drivers"].map((tab) => (
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

        {/* Orders Table */}
        {activeTab === "orders" && (
          <Card className="bg-white">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Order
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Customer
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Payment
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Total
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Delivery
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Items
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Destination
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Fulfillment
                  </TableHead>
                  <TableHead className="text-gray-600 font-medium">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow
                    key={index}
                    className="border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/order/details/${order.id.replace("#", "")}`)
                    }
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      <Button
                        variant="ghost"
                        className="p-0 text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {order.id}
                      </Button>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.date}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {order.customer}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.payment === "Success" ? "default" : "secondary"
                        }
                        className={
                          order.payment === "Success"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        }
                      >
                        ● {order.payment}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {order.total}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.delivery}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.items}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {order.destination}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.fulfillment === "Fulfilled"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          order.fulfillment === "Fulfilled"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        ● {order.fulfillment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 px-3 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDispatchOrder(order);
                          }}
                        >
                          Dispatch
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <DriversMapView onCreateDriver={handleCreateDriver} />
        )}

        {/* Routes Tab */}
        {/* {activeTab === "routes" && (
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
        )} */}

        {/* Deliveries Tab */}
        {
          //activeTab === "deliveries" && (
          // <div className="space-y-6">
          //   {/* Assignment Panel */}
          //   {/* <Card>
          //     <CardHeader>
          //       <CardTitle className="flex items-center gap-2">
          //         <IoLocation className="h-5 w-5" />
          //         Delivery Assignment
          //       </CardTitle>
          //     </CardHeader>
          //     <CardContent>
          //       <div className="flex items-center gap-4 mb-4">
          //         <div className="flex-1">
          //           <label className="text-sm font-medium text-gray-600 mb-2 block">
          //             Select Driver
          //           </label>
          //           <Select
          //             value={selectedDriver}
          //             onValueChange={handleDriverSelection}
          //           >
          //             <SelectTrigger className="bg-gray-50 border-0 py-3">
          //               <SelectValue placeholder="Choose a driver" />
          //             </SelectTrigger>
          //             <SelectContent>
          //               {drivers
          //                 .filter((driver) => driver.status === "Available")
          //                 .map((driver) => (
          //                   <SelectItem key={driver.id} value={driver.id}>
          //                     <div className="flex items-center justify-between w-full">
          //                       <span>{driver.name}</span>
          //                       <span className="text-sm text-gray-500 ml-4">
          //                         {driver.vehicle}
          //                       </span>
          //                     </div>
          //                   </SelectItem>
          //                 ))}
          //             </SelectContent>
          //           </Select>
          //         </div>
          //         <Button
          //           onClick={handleAssignDelivery}
          //           disabled={
          //             !selectedDriver || selectedDeliveries.length === 0
          //           }
          //           className="mt-6"
          //         >
          //           Assign Deliveries
          //         </Button>
          //       </div>
          //       <div className="bg-blue-50 p-4 rounded-lg">
          //         <p className="text-blue-700 text-sm">
          //           {selectedDeliveries.length} delivery(ies) selected for
          //           assignment
          //         </p>
          //       </div>
          //     </CardContent>
          //   </Card> */}
          //   {/* Deliveries Table */}
          //   {/* <Card>
          //     <CardHeader>
          //       <CardTitle className="flex items-center gap-2">
          //         <IoLocation className="h-5 w-5" />
          //         All Deliveries
          //       </CardTitle>
          //     </CardHeader>
          //     <CardContent>
          //       <Table>
          //         <TableHeader>
          //           <TableRow>
          //             <TableHead className="w-12">
          //               <Checkbox />
          //             </TableHead>
          //             <TableHead>Order ID</TableHead>
          //             <TableHead>Customer</TableHead>
          //             <TableHead>Address</TableHead>
          //             <TableHead>Priority</TableHead>
          //             <TableHead>Service Type</TableHead>
          //             <TableHead>Status</TableHead>
          //             <TableHead>Driver</TableHead>
          //           </TableRow>
          //         </TableHeader>
          //         <TableBody>
          //           {pendingDeliveries.map((delivery) => (
          //             <TableRow key={delivery.id}>
          //               <TableCell>
          //                 <Checkbox
          //                   checked={selectedDeliveries.includes(delivery.id)}
          //                   onCheckedChange={() =>
          //                     handleDeliverySelection(delivery.id)
          //                   }
          //                 />
          //               </TableCell>
          //               <TableCell className="font-medium">
          //                 {delivery.id}
          //               </TableCell>
          //               <TableCell>{delivery.customer}</TableCell>
          //               <TableCell>
          //                 <div>
          //                   <p className="text-sm">{delivery.address}</p>
          //                   <p className="text-xs text-gray-500">
          //                     {delivery.distance} • {delivery.estimatedTime}
          //                   </p>
          //                 </div>
          //               </TableCell>
          //               <TableCell>
          //                 <Badge
          //                   className={getPriorityColor(delivery.priority)}
          //                 >
          //                   {delivery.priority}
          //                 </Badge>
          //               </TableCell>
          //               <TableCell>
          //                 <Badge variant="outline">
          //                   {delivery.serviceType}
          //                 </Badge>
          //               </TableCell>
          //               <TableCell>
          //                 <Badge
          //                   variant={
          //                     delivery.status === "Assigned"
          //                       ? "default"
          //                       : "secondary"
          //                   }
          //                   className={
          //                     delivery.status === "Assigned"
          //                       ? "bg-green-100 text-green-700"
          //                       : "bg-orange-100 text-orange-700"
          //                   }
          //                 >
          //                   {delivery.status}
          //                 </Badge>
          //               </TableCell>
          //               <TableCell>
          //                 <span className="text-sm text-gray-600">
          //                   {delivery.driver || "Unassigned"}
          //                 </span>
          //               </TableCell>
          //             </TableRow>
          //           ))}
          //         </TableBody>
          //       </Table>
          //     </CardContent>
          //   </Card> */}
          // </div>
          //)}
        }

        {/* Dispatch Modal */}
        <DispatchModal
          isOpen={isDispatchModalOpen}
          onClose={handleCloseDispatchModal}
          orderId={selectedOrder?.id || ""}
          customerName={selectedOrder?.customer || ""}
          deliveryAddress="123 Main St, New York, NY" // This would come from order data
          priority="High" // This would come from order data
          serviceType="Same-day" // This would come from order data
          onDispatch={handleDispatch}
        />

        {/* Create Driver Modal */}
        <CreateDriverModal
          isOpen={isCreateDriverModalOpen}
          onClose={handleCloseCreateDriverModal}
          onSave={handleSaveDriver}
        />
      </div>
    </div>
  );
}
