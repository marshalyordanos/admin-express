"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  IoArrowBack,
  IoPerson,
  IoLocation,
  IoTime,
  IoCube,
  IoShield,
  IoPeople,
  IoMap,
} from "react-icons/io5";

// Mock data for demonstration
const mockOrder = {
  id: "#1002",
  date: "11 Feb, 2024",
  customer: "Wade Warren",
  email: "wade.warren@email.com",
  phone: "+1 (555) 123-4567",
  payment: "Pending",
  total: "$20.00",
  items: "2 Items",
  fulfillment: "Unfulfilled",
  weight: 2.5,
  category: "PARCEL",
  isFragile: false,
  serviceType: "STANDARD",
  fulfillmentType: "PICKUP",
  pickupAddress: "123 Main St, New York, NY 10001",
  deliveryAddress: "456 Oak Ave, Brooklyn, NY 11201",
  pickupDate: "2024-02-12T10:00",
  deliveryDate: "2024-02-13T14:00",
  cost: 20.0,
  length: 30,
  width: 20,
  height: 15,
};

const drivers = [
  { id: "1", name: "John Smith", status: "Available", rating: 4.8 },
  { id: "2", name: "Sarah Johnson", status: "Busy", rating: 4.9 },
  { id: "3", name: "Mike Wilson", status: "Available", rating: 4.7 },
  { id: "4", name: "Lisa Brown", status: "Available", rating: 4.6 },
];

const relatedOrders = [
  {
    id: "#1003",
    customer: "Jane Doe",
    address: "789 Pine St, Brooklyn, NY",
    distance: "0.5 mi",
    status: "Pending Approval",
  },
  {
    id: "#1005",
    customer: "Bob Smith",
    address: "321 Elm St, Brooklyn, NY",
    distance: "0.8 mi",
    status: "Approved",
  },
  {
    id: "#1008",
    customer: "Alice Johnson",
    address: "654 Maple Ave, Brooklyn, NY",
    distance: "1.2 mi",
    status: "Pending Approval",
  },
];

const categories = [
  "Documents",
  "Edible/Food",
  "Electronics",
  "Chemicals",
  "Clothing",
  "Fragile Items",
  "Heavy Items",
  "Perishable",
];

export default function OrderDetails() {
  //   const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDriver, setSelectedDriver] = useState("");
  const [groupedOrders, setGroupedOrders] = useState<string[]>([]);
  const query = new URLSearchParams(location.search);

  const orderDetail = query.get("order")
    ? JSON.parse(query.get("order")!)
    : null;
    const [selectedCategory, setSelectedCategory] = useState(orderDetail.category);

console.log("orderdetail: ",orderDetail)
  const initialValues = {
    fulfillmentDestination: orderDetail?.shippingScope,
    serviceType: orderDetail.serviceType,
    driverId: "",
    fragilityLevel: orderDetail.isFragile ? "true" : "false",
    category: mockOrder.category,
    specialInstructions: "",
    priority: "Normal",
  };

  const handleDriverAssignment = (driverId: string) => {
    setSelectedDriver(driverId);
  };

  const handleOrderGrouping = (orderId: string) => {
    setGroupedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getFulfillmentColor = (destination: string) => {
    switch (destination) {
      case "International":
        return "bg-blue-100 text-blue-700";
      case "Regional":
        return "bg-green-100 text-green-700";
      case "In-town":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "Same-day":
        return "bg-red-100 text-red-700";
      case "Overnight":
        return "bg-purple-100 text-purple-700";
      case "Standard":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.log("Order details updated:", values);
          // Handle form submission
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-5 items-center">
                <Button
                  type="button"
                  className="!text-white !size-[40px] bg-blue-500 hover:bg-blue-400 !rounded-full !p-0 !py-0 flex items-center justify-center !cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  <IoArrowBack className="text-white text-2xl" />
                </Button>
                <div>
                  <h1 className="text-2xl font-medium text-gray-700">
                    Order Details - {orderDetail.trackingCode}
                  </h1>
                  <p className="text-gray-500">
                    Manage order fulfillment and delivery
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="!cursor-pointer !bg-blue-500 hover:!bg-blue-400"
                >
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IoCube className="h-5 w-5" />
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Customer
                        </Label>
                        <p className="text-lg font-semibold">
                          {orderDetail?.customer?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {orderDetail?.customer?.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {orderDetail?.customer?.phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Order Status
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-700"
                          >
                            {orderDetail.status}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-700"
                          >
                            {orderDetail.fulfillmentType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Total
                        </Label>
                        <p className="text-lg font-semibold">
                          {orderDetail?.finalPrice} ETB
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Weight
                        </Label>
                        <p className="text-lg font-semibold">
                          {orderDetail?.weight} kg
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          Items
                        </Label>
                        <p className="text-lg font-semibold">
                          {orderDetail?.items}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fulfillment Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IoMap className="h-5 w-5" />
                      Fulfillment Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2">Fulfillment Destination</Label>
                        <Select
                          value={values.fulfillmentDestination}
                          onValueChange={(val) =>
                            setFieldValue("fulfillmentDestination", val)
                          }
                        >
                          <SelectTrigger className="bg-gray-50 border-0 py-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="TOWN">TOWN</SelectItem>
                      <SelectItem value="REGIONAL">REGIONAL</SelectItem>
                      <SelectItem value="INTERNATIONAL">
                        INTERNATIONAL
                      </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="mb-2">Service Type</Label>
                        <Select
                          value={values.serviceType}
                          onValueChange={(val) =>
                            setFieldValue("serviceType", val)
                          }
                        >
                          <SelectTrigger className="bg-gray-50 border-0 py-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="EXPRESS">EXPRESS</SelectItem>
                    <SelectItem value="SAME_DAY">SAME DAY</SelectItem>
                    <SelectItem value="OVERNIGHT">OVERNIGHT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge
                        className={getFulfillmentColor(
                          values.fulfillmentDestination
                        )}
                      >
                        {values.fulfillmentDestination}
                      </Badge>
                      <Badge
                        className={getServiceTypeColor(values.serviceType)}
                      >
                        {values.serviceType}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Driver Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IoPerson className="h-5 w-5" />
                      Driver Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2">Select Driver</Label>
                        <Select
                          value={selectedDriver}
                          onValueChange={handleDriverAssignment}
                        >
                          <SelectTrigger className="bg-gray-50 border-0 py-3">
                            <SelectValue placeholder="Choose a driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.map((driver) => (
                              <SelectItem
                                key={driver.id}
                                value={driver.id}
                                disabled={driver.status === "Busy"}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span>{driver.name}</span>
                                  <div className="flex items-center gap-2 ml-4">
                                    <span className="text-sm text-gray-500">
                                      ★ {driver.rating}
                                    </span>
                                    <Badge
                                      variant={
                                        driver.status === "Available"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {driver.status}
                                    </Badge>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedDriver && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-green-700 font-medium">
                            Driver assigned successfully!
                          </p>
                          <p className="text-sm text-green-600">
                            {drivers.find((d) => d.id === selectedDriver)?.name}{" "}
                            will handle this order.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Fragility & Category */}
           {/* Fragility & Category */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <IoShield className="h-5 w-5" />
      Fragility & Category
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Fragility Level */}
      <div>
        <Label className="mb-2">Fragility Level</Label>
        <Select
          value={values.fragilityLevel}
          onValueChange={(val) => setFieldValue("fragilityLevel", val)}
        >
          <SelectTrigger className="bg-gray-50 border-0 py-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Multi-select Categories */}
      <div>
        <Label className="mb-2">Category</Label>
        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                checked={selectedCategory.includes(category)}
                onCheckedChange={(checked) => {
                  let updated = [...selectedCategory];
                  if (checked) updated.push(category);
                  else updated = updated.filter((c) => c !== category);
                  setSelectedCategory(updated);
                  setFieldValue("category", updated);
                }}
              />
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </CardContent>
</Card>

              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Address Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IoLocation className="h-5 w-5" />
                      Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Pickup Address
                      </Label>
                      <p className="text-sm text-gray-800 mt-1">
                        {orderDetail?.pickupAddress?.addressLine}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <IoTime className="inline h-3 w-3 mr-1" />
                        {new Date(orderDetail.pickupAddress?.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Delivery Address
                      </Label>
                      <p className="text-sm text-gray-800 mt-1">
                        {orderDetail.deliveryAddress?.addressLine}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <IoTime className="inline h-3 w-3 mr-1" />
                        {new Date(orderDetail?.deliveryAddress?.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Orders Grouping */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IoPeople className="h-5 w-5" />
                      Group Related Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Select orders to group for efficient routing:
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {relatedOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>
                                <Checkbox
                                  checked={groupedOrders.includes(order.id)}
                                  onCheckedChange={() =>
                                    handleOrderGrouping(order.id)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-sm">
                                    {order.id}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {order.customer}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {order.address}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">
                                  {order.distance}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    order.status === "Approved"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-orange-100 text-orange-700"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {groupedOrders.length > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-blue-700 text-sm font-medium">
                            {groupedOrders.length} order(s) selected for
                            grouping
                          </p>
                          <p className="text-blue-600 text-xs">
                            These orders will be bundled for efficient delivery
                            routing.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card> */}

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weight:</span>
                      <span className="text-sm font-medium">
                        {orderDetail.weight} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dimensions:</span>
                      <span className="text-sm font-medium">
                        {orderDetail.length}×{orderDetail.width}×{orderDetail.height}{" "}
                        cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost:</span>
                      <span className="text-sm font-medium">
                        {orderDetail.cost} ETB
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">{orderDetail.finalPrice} ETB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
