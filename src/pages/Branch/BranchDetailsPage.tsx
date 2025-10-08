import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Building2,
  Settings,
  User,
  Shield,
  MapPin,
  Users,
  FileText,
  Calendar,
  Package,
  TrendingUp,
  DollarSign,
} from "lucide-react";

// Mock branch data - in real app, this would come from API
const branchData = {
  id: "B0001",
  name: "Addis Ababa Central",
  location: "Bole, Addis Ababa",
  manager: "John Doe",
  managerStatus: "Assigned",
  totalOrders: 1200,
  activeOrders: 85,
  staff: 25,
  revenue: "$85,000",
  efficiency: 96,
  status: "Active",
  address: "Bole Road, Addis Ababa",
  phone: "+251 11 123 4567",
  email: "bole@company.com",
  establishedDate: "2020-01-15",
  operatingHours: "8:00 AM - 6:00 PM",
  serviceArea: "Addis Ababa & Surroundings",
  capacity: "500 orders/day",
};

// Mock related branches for coordination
const relatedBranches = [
  {
    id: "B0002",
    name: "Dire Dawa Branch",
    location: "City Center, Dire Dawa",
    manager: "Not Assigned",
    status: "Active",
    distance: "515 km",
  },
  {
    id: "B0003",
    name: "Mekelle Branch",
    location: "Downtown, Mekelle",
    manager: "Jane Smith",
    status: "Active",
    distance: "783 km",
  },
  {
    id: "B0004",
    name: "Bahir Dar Branch",
    location: "Lake Side, Bahir Dar",
    manager: "Not Assigned",
    status: "Active",
    distance: "578 km",
  },
];

// Mock operations history
const operationsHistory = [
  {
    id: "OP-001",
    date: "2024-12-15",
    type: "High Volume Day",
    description: "Processed 150 orders successfully with 98% efficiency",
    ordersProcessed: 150,
    revenue: "$12,500",
    status: "Completed",
  },
  {
    id: "OP-002",
    date: "2024-12-14",
    type: "Staff Training",
    description: "Conducted customer service training for 8 staff members",
    ordersProcessed: 0,
    revenue: "$0",
    status: "Completed",
  },
  {
    id: "OP-003",
    date: "2024-12-12",
    type: "Equipment Maintenance",
    description: "Scheduled maintenance for sorting equipment",
    ordersProcessed: 0,
    revenue: "$0",
    status: "Completed",
  },
];

export default function BranchDetailsPage() {
  const navigate = useNavigate();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "Maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getManagerStatusColor = (status: string) => {
    switch (status) {
      case "Assigned":
        return "bg-green-100 text-green-700";
      case "Vacant":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
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
            onClick={() => navigate("/branch")}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Branch Details - #{branchData.id}
            </h1>
            <p className="text-gray-500 text-sm">
              Manage branch operations and staff coordination
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
          {/* Branch Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Branch Name
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {branchData.name}
                  </p>
                  <p className="text-sm text-gray-500">{branchData.id}</p>
                  <p className="text-sm text-gray-500">{branchData.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Branch Status
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(branchData.status)}>
                      ● {branchData.status}
                    </Badge>
                    <Badge
                      className={getManagerStatusColor(
                        branchData.managerStatus
                      )}
                    >
                      {branchData.managerStatus}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Total Orders
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {branchData.totalOrders.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Active Orders
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {branchData.activeOrders}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Staff Count
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {branchData.staff}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Management Configuration */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Management Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Operating Hours
                  </Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        8:00 AM - 6:00 PM
                      </SelectItem>
                      <SelectItem value="extended">
                        7:00 AM - 8:00 PM
                      </SelectItem>
                      <SelectItem value="24hour">24/7 Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Service Level
                  </Label>
                  <Select defaultValue="premium">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium Service</SelectItem>
                      <SelectItem value="standard">Standard Service</SelectItem>
                      <SelectItem value="express">Express Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {branchData.operatingHours}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700">
                  {branchData.capacity}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Manager Assignment */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Manager Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Select Manager
                </Label>
                <Select defaultValue="assigned">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">John Doe (Current)</SelectItem>
                    <SelectItem value="stf-002">
                      Tigist Hailu (STF-002)
                    </SelectItem>
                    <SelectItem value="stf-005">
                      Yohannes Desta (STF-005)
                    </SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Operations & Performance */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Operations & Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Performance Level
                  </Label>
                  <Select defaultValue="excellent">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="needs-improvement">
                        Needs Improvement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Efficiency Target
                  </Label>
                  <Select defaultValue="95">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="85">85%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Location & Contact */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Location & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Full Address
                  </Label>
                  <span className="text-sm text-gray-900">
                    {branchData.address}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Phone Number
                  </Label>
                  <span className="text-sm text-gray-900">
                    {branchData.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Email Address
                  </Label>
                  <span className="text-sm text-gray-900">
                    {branchData.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Service Area
                  </Label>
                  <span className="text-sm text-gray-900">
                    {branchData.serviceArea}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Branch Coordination */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Branch Coordination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select branches for inter-branch coordination and transfers:
              </p>
              <div className="space-y-3">
                {relatedBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedBranches.includes(branch.id)}
                      onCheckedChange={() => handleBranchSelect(branch.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {branch.name} ({branch.id})
                      </div>
                      <div className="text-sm text-gray-500">
                        {branch.location} - {branch.manager}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {branch.distance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Branch Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Branch Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Established Date
                  </Label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(
                        branchData.establishedDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Current Revenue
                  </Label>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-semibold text-gray-900">
                      {branchData.revenue}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Efficiency Rate
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${branchData.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {branchData.efficiency}%
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Daily Capacity
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {branchData.capacity}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operations History */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Recent Operations History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {operationsHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {record.type}
                        </span>
                        <Badge className="bg-green-100 text-green-700">
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {record.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        {record.ordersProcessed > 0 && (
                          <span>{record.ordersProcessed} orders</span>
                        )}
                        {record.revenue !== "$0" && (
                          <span>{record.revenue}</span>
                        )}
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
