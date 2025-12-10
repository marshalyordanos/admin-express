import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Car,
  User,
  Shield,
  Users,
  FileText,
  Fuel,
  Gauge,
  Wrench,
  CheckCircle,
} from "lucide-react";

// Mock vehicle data - in real app, this would come from API
const vehicleData = {
  id: "VH-001",
  plateNumber: "AA-12345",
  type: "Van",
  brand: "Toyota",
  model: "Hiace",
  year: 2022,
  ownership: "In-house",
  driver: "Abebe Kebede",
  driverId: "STF-001",
  status: "Active",
  fuelType: "Diesel",
  capacity: "1500 kg",
  currentMileage: 45000,
  lastMaintenance: "2025-09-15",
  nextMaintenance: "2025-10-15",
  utilizationRate: 85,
  totalTrips: 234,
  insurance: "Valid",
  insuranceExpiry: "2026-01-15",
  dimensions: "450x180x200 cm",
  engineType: "2.8L Turbo Diesel",
  transmission: "Manual",
  color: "White",
  registrationDate: "2022-01-15",
  purchasePrice: "$35,000",
  currentValue: "$28,000",
};

// Mock related vehicles for grouping
const relatedVehicles = [
  {
    id: "VH-002",
    plateNumber: "AA-67890",
    type: "Truck",
    brand: "Isuzu",
    model: "NMR",
    driver: "Tigist Alemu",
    location: "Bole Branch, Addis Ababa",
    distance: "0.3 mi",
  },
  {
    id: "VH-003",
    plateNumber: "AA-24680",
    type: "Pickup",
    brand: "Ford",
    model: "Ranger",
    driver: "Unassigned",
    location: "Maintenance Bay, Addis Ababa",
    distance: "0.8 mi",
  },
  {
    id: "VH-004",
    plateNumber: "AA-13579",
    type: "Van",
    brand: "Nissan",
    model: "Urvan",
    driver: "Dawit Tadesse",
    location: "Merkato Branch, Addis Ababa",
    distance: "1.2 mi",
  },
];

// Mock maintenance history
const maintenanceHistory = [
  {
    id: "MT-001",
    date: "2025-09-15",
    type: "Regular Service",
    description: "Oil change, filter replacement, brake check",
    mileage: 44800,
    cost: "$150",
    technician: "Maintenance Team",
    status: "Completed",
  },
  {
    id: "MT-002",
    date: "2025-08-20",
    type: "Repair",
    description: "Engine diagnostics and minor repairs",
    mileage: 43200,
    cost: "$320",
    technician: "John Smith",
    status: "Completed",
  },
  {
    id: "MT-003",
    date: "2025-07-10",
    type: "Inspection",
    description: "Annual safety inspection",
    mileage: 41500,
    cost: "$80",
    technician: "Safety Inspector",
    status: "Completed",
  },
];

export default function VehicleDetailsPage() {
  const navigate = useNavigate();
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);


  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const fleetDetail = query.get("fleet")
    ? JSON.parse(query.get("fleet")!)
    : null;
console.log(fleetDetail,"fleetDetail")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Maintenance":
        return "bg-orange-100 text-orange-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Scheduled":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/fleet")}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vehicle Details - #{fleetDetail.plateNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Manage vehicle maintenance and fleet operations
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="text-gray-600 bg-white cursor-pointer"
          >
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Vehicle Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Car className="h-5 w-5 mr-2 text-blue-600" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Driver
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {fleetDetail.driver?.name??"Not assigned"}  
                  </p>
                  {/* <p className="text-sm text-gray-500">
                    {fleetDetail.driverId}
                  </p> */}
                  <p className="text-sm text-gray-500">{fleetDetail?.driver?.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Vehicle Status
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(vehicleData.status)}>
                      ● {vehicleData.status}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      {vehicleData.ownership}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                {/* <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Total Trips
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {vehicleData.totalTrips}
                  </p>
                </div> */}
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Capacity
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {fleetDetail.maxLoad} KG
                  </p>
                </div>
                {/* <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Utilization
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {vehicleData.utilizationRate}%
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Configuration */}
          {/* <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Maintenance Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Service Type
                  </Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Maintenance Level
                  </Label>
                  <Select defaultValue="routine">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Badge className="bg-orange-100 text-orange-700">
                  In-house
                </Badge>
                <Badge className="bg-gray-100 text-gray-700">STANDARD</Badge>
              </div>
            </CardContent>
          </Card> */}

          {/* Driver Assignment */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Driver Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Select Driver
                </Label>
                <Select defaultValue={vehicleData.driverId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STF-001">
                      Abebe Kebede (STF-001)
                    </SelectItem>
                    <SelectItem value="STF-007">
                      Tigist Alemu (STF-007)
                    </SelectItem>
                    <SelectItem value="STF-015">
                      Solomon Bekele (STF-015)
                    </SelectItem>
                    <SelectItem value="STF-022">
                      Yonas Girma (STF-022)
                    </SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Fleet Status & Category */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Fleet Status & Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Fleet Category
                  </Label>
                  <Select defaultValue={fleetDetail.type}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="Pickup">Pickup Truck</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Trailer">Trailer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Status
                  </Label>
                  <Select defaultValue={fleetDetail?.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                    
  
                        <SelectItem value="ACTIVE">ACTIVE </SelectItem>
                      <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Vehicle Specifications */}
          {/* <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Vehicle Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Current Location
                  </Label>
                  <span className="text-sm text-gray-900">
                    Bole Branch, Addis Ababa
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Last Update
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      2/12/2024, 10:00:00 AM
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Next Maintenance
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      2/13/2024, 2:00:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Group Related Vehicles */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Group Related Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select vehicles to group for efficient maintenance scheduling:
              </p>
              <div className="space-y-3">
                {relatedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedVehicles.includes(vehicle.id)}
                      onCheckedChange={() => handleVehicleSelect(vehicle.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        #{vehicle.id} {vehicle.driver} {vehicle.brand}{" "}
                        {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.location}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {vehicle.distance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Vehicle Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Mileage
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {vehicleData.currentMileage.toLocaleString()} km
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Dimensions
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {vehicleData.dimensions}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Fuel Type
                  </Label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Fuel className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {vehicleData.fuelType}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Engine
                  </Label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Gauge className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {vehicleData.engineType}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance History */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Wrench className="h-5 w-5 mr-2 text-blue-600" />
                Recent Maintenance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {record.type}
                        </span>
                        <Badge
                          className={getMaintenanceStatusColor(record.status)}
                        >
                          {record.status === "Completed" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {record.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{record.date}</span>
                        <span>{record.mileage.toLocaleString()} km</span>
                        <span>{record.technician}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {record.cost}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
