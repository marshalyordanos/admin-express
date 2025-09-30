"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  IoClose,
  IoPerson,
  // IoPhone,
  IoCar,
  IoLocation,
  IoTime,
  IoCheckmarkCircle,
  // IoAdd,
  IoMail,
  IoPhonePortraitOutline,
} from "react-icons/io5";

interface Driver {
  id: string;
  name: string;
  status: string;
  currentLocation: string;
  vehicle: string;
  capacity: number;
  currentLoad: number;
  rating: number;
  phone: string;
  lastUpdate: string;
  route: string;
  deliveries: number;
  completed: number;
  remaining: number;
}

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
  deliveryAddress: string;
  priority: string;
  serviceType: string;
  onDispatch: (driverId: string, notes?: string) => void;
}

const availableDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    status: "Available",
    currentLocation: "Warehouse",
    vehicle: "Van #001",
    capacity: 15,
    currentLoad: 0,
    rating: 4.8,
    phone: "+1 (555) 123-4567",
    lastUpdate: "2 min ago",
    route: "None",
    deliveries: 0,
    completed: 0,
    remaining: 0,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    status: "Available",
    currentLocation: "Depot",
    vehicle: "Truck #002",
    capacity: 25,
    currentLoad: 5,
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
    status: "Available",
    currentLocation: "Service Center",
    vehicle: "Van #003",
    capacity: 12,
    currentLoad: 3,
    rating: 4.7,
    phone: "+1 (555) 345-6789",
    lastUpdate: "10 min ago",
    route: "None",
    deliveries: 0,
    completed: 0,
    remaining: 0,
  },
];

const externalDrivers = [
  {
    id: "ext-1",
    name: "David Brown",
    company: "Express Logistics",
    phone: "+1 (555) 456-7890",
    email: "david@expresslogistics.com",
    rating: 4.6,
    availability: "Available",
  },
  {
    id: "ext-2",
    name: "Lisa Garcia",
    company: "Quick Delivery Co.",
    phone: "+1 (555) 567-8901",
    email: "lisa@quickdelivery.com",
    rating: 4.8,
    availability: "Available",
  },
  {
    id: "ext-3",
    name: "Robert Taylor",
    company: "Fast Track Services",
    phone: "+1 (555) 678-9012",
    email: "robert@fasttrack.com",
    rating: 4.5,
    availability: "Available",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700";
    case "Busy":
      return "bg-red-100 text-red-700";
    case "On Break":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

function DispatchModal({
  isOpen,
  onClose,
  orderId,
  customerName,
  deliveryAddress,
  priority,
  serviceType,
  onDispatch,
}: DispatchModalProps) {
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedExternalDriver, setSelectedExternalDriver] = useState("");
  const [dispatchNotes, setDispatchNotes] = useState("");
  const [activeTab, setActiveTab] = useState("internal");
  const [isContactingExternal, setIsContactingExternal] = useState(false);

  const handleDispatch = () => {
    if (selectedDriver || selectedExternalDriver) {
      const driverId = selectedDriver || selectedExternalDriver;
      onDispatch(driverId, dispatchNotes);
      onClose();
      // Reset form
      setSelectedDriver("");
      setSelectedExternalDriver("");
      setDispatchNotes("");
    }
  };

  const handleContactExternal = (driver: { name: string; company: string }) => {
    setIsContactingExternal(true);
    // Simulate contacting external driver
    setTimeout(() => {
      setIsContactingExternal(false);
      alert(`Contacting ${driver.name} at ${driver.company}...`);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              Dispatch Order {orderId}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <IoClose className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Customer: {customerName} • Priority: {priority} • Service:{" "}
            {serviceType}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Order ID</Label>
                <p className="font-medium">{orderId}</p>
              </div>
              <div>
                <Label className="text-gray-600">Customer</Label>
                <p className="font-medium">{customerName}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-600">Delivery Address</Label>
                <p className="font-medium">{deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Driver Selection Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: "internal", label: "Internal Drivers" },
                { id: "external", label: "External Drivers" },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`hover:bg-white cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900"
                      : "text-gray-600 hover:text-gray-900 "
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Internal Drivers */}
            {activeTab === "internal" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Available Internal Drivers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDrivers.map((driver) => (
                    <Card
                      key={driver.id}
                      className={`cursor-pointer transition-all ${
                        selectedDriver === driver.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDriver(driver.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <IoPerson className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-sm text-gray-500">
                                ★ {driver.rating} • {driver.phone}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <IoCar className="h-4 w-4 text-gray-400" />
                            <span>{driver.vehicle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IoLocation className="h-4 w-4 text-gray-400" />
                            <span>{driver.currentLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IoTime className="h-4 w-4 text-gray-400" />
                            <span>Last update: {driver.lastUpdate}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Capacity</span>
                            <span>
                              {driver.currentLoad}/{driver.capacity}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (driver.currentLoad / driver.capacity) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        {selectedDriver === driver.id && (
                          <div className="mt-3 flex items-center gap-2 text-blue-600">
                            <IoCheckmarkCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Selected
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* External Drivers */}
            {activeTab === "external" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  External Driver Partners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {externalDrivers.map((driver) => (
                    <Card
                      key={driver.id}
                      className={`cursor-pointer transition-all ${
                        selectedExternalDriver === driver.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedExternalDriver(driver.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <IoPerson className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-sm text-gray-500">
                                {driver.company}
                              </p>
                              <p className="text-sm text-gray-500">
                                ★ {driver.rating}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            {driver.availability}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <IoPhonePortraitOutline className="h-4 w-4 text-gray-400" />
                            <span>{driver.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IoMail className="h-4 w-4 text-gray-400" />
                            <span>{driver.email}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactExternal(driver);
                            }}
                            disabled={isContactingExternal}
                            className="flex-1 cursor-pointer"
                          >
                            <IoPhonePortraitOutline className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                          {selectedExternalDriver === driver.id && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <IoCheckmarkCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Selected
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dispatch Notes */}
          <div>
            <Label className="mb-2">Dispatch Notes (Optional)</Label>
            <Textarea
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              placeholder="Add any special instructions for the driver..."
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleDispatch}
              disabled={!selectedDriver && !selectedExternalDriver}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <IoCheckmarkCircle className="h-4 w-4 mr-2" />
              Dispatch Order
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DispatchModal;
