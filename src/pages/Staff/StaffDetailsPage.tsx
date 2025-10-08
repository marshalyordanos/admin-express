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
  User,
  Settings,
  Building2,
  Shield,
  MapPin,
  Users,
  FileText,
  Calendar,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";

// Mock staff data - in real app, this would come from API
const staffData = {
  id: "STF-001",
  name: "Abebe Kebede",
  email: "abebe.k@company.com",
  phone: "+251 911 234 567",
  role: "Driver",
  branch: "Addis Ababa Central",
  branchId: "1",
  status: "Active",
  assignedOrders: 12,
  completedOrders: 145,
  rating: 4.8,
  joinDate: "2022-01-15",
  department: "Operations",
  employeeType: "Full-time",
  salary: "25,000 ETB",
  address: "Bole, Addis Ababa",
  emergencyContact: "Tigist Kebede (+251 911 234 568)",
  licenseNumber: "DL-ET-123456",
  licenseExpiry: "2026-03-15",
  vehicleAssigned: "VH-001 (AA-12345)",
};

// Mock related staff for team management
const relatedStaff = [
  {
    id: "STF-002",
    name: "Tigist Hailu",
    role: "Manager",
    branch: "Addis Ababa Central",
    department: "Operations",
    distance: "Same Branch",
  },
  {
    id: "STF-004",
    name: "Marta Tadesse",
    role: "Dispatcher",
    branch: "Addis Ababa Central",
    department: "Operations",
    distance: "Same Branch",
  },
  {
    id: "STF-006",
    name: "Solomon Bekele",
    role: "Driver",
    branch: "Addis Ababa Central",
    department: "Operations",
    distance: "Same Branch",
  },
];

// Mock work history
const workHistory = [
  {
    id: "WH-001",
    date: "2024-12-15",
    type: "Order Completion",
    description: "Successfully delivered 15 packages across 3 routes",
    location: "Addis Ababa - Bole Area",
    rating: 5.0,
    status: "Completed",
  },
  {
    id: "WH-002",
    date: "2024-12-14",
    type: "Training",
    description: "Completed defensive driving course",
    location: "Training Center",
    rating: null,
    status: "Completed",
  },
  {
    id: "WH-003",
    date: "2024-12-12",
    type: "Performance Review",
    description: "Monthly performance evaluation - Excellent rating",
    location: "Office",
    rating: 4.8,
    status: "Completed",
  },
];

export default function StaffDetailsPage() {
  const navigate = useNavigate();
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Manager":
        return "bg-purple-100 text-purple-700";
      case "Driver":
        return "bg-blue-100 text-blue-700";
      case "Dispatcher":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
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
            onClick={() => navigate("/staff")}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Staff Details - #{staffData.id}
            </h1>
            <p className="text-gray-500 text-sm">
              Manage staff information and work assignments
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
          {/* Staff Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Staff Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Employee Name
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {staffData.name}
                  </p>
                  <p className="text-sm text-gray-500">{staffData.id}</p>
                  <p className="text-sm text-gray-500">{staffData.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Employment Status
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(staffData.status)}>
                      ● {staffData.status}
                    </Badge>
                    <Badge className={getRoleColor(staffData.role)}>
                      {staffData.role}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Assigned Orders
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {staffData.assignedOrders}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Completed Orders
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {staffData.completedOrders}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Rating
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <p className="text-lg font-semibold text-gray-900">
                      {staffData.rating}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Configuration */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Work Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Employee Type
                  </Label>
                  <Select defaultValue="fulltime">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Department
                  </Label>
                  <Select defaultValue="operations">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="customer-service">
                        Customer Service
                      </SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {staffData.employeeType}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700">
                  {staffData.department}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Branch Assignment */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                Branch Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Select Branch
                </Label>
                <Select defaultValue={staffData.branchId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Addis Ababa Central</SelectItem>
                    <SelectItem value="2">Dire Dawa Branch</SelectItem>
                    <SelectItem value="3">Mekelle Branch</SelectItem>
                    <SelectItem value="4">Bahir Dar Branch</SelectItem>
                    <SelectItem value="5">Hawassa Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Status */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Performance & Status
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
                    Work Status
                  </Label>
                  <Select defaultValue="active">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Phone Number
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {staffData.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Email Address
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {staffData.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Address
                  </Label>
                  <span className="text-sm text-gray-900">
                    {staffData.address}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Emergency Contact
                  </Label>
                  <span className="text-sm text-gray-900">
                    {staffData.emergencyContact}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Management */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select team members for collaborative work assignments:
              </p>
              <div className="space-y-3">
                {relatedStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedStaff.includes(staff.id)}
                      onCheckedChange={() => handleStaffSelect(staff.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {staff.name} ({staff.id})
                      </div>
                      <div className="text-sm text-gray-500">
                        {staff.role} - {staff.department}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {staff.distance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Staff Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Join Date
                  </Label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(staffData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    License Number
                  </Label>
                  <p className="text-sm font-semibold text-gray-900">
                    {staffData.licenseNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Vehicle Assigned
                  </Label>
                  <p className="text-sm text-gray-900">
                    {staffData.vehicleAssigned}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    License Expiry
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(staffData.licenseExpiry).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work History */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Recent Work History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workHistory.map((record) => (
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
                        <span>{record.location}</span>
                        {record.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{record.rating}</span>
                          </div>
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
