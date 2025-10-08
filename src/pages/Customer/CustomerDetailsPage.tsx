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
  CreditCard,
  Shield,
  MapPin,
  Users,
  FileText,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  Building2,
} from "lucide-react";

// Mock customer data - in real app, this would come from API
const customerData = {
  id: "CUST-001",
  customerId: "C001",
  name: "Abebe Kebede",
  email: "abebe.k@email.com",
  phone: "+251 911 234 567",
  type: "Individual",
  status: "Active",
  registrationDate: "2024-01-15",
  lastOrderDate: "2024-12-10",
  totalOrders: 12,
  totalSpent: 45000,
  loyaltyPoints: 450,
  address: "Bole, Addis Ababa",
  city: "Addis Ababa",
  companyName: null,
  contactPerson: null,
  preferredLanguage: "Amharic",
  communicationPreference: "SMS",
  creditLimit: "50,000 ETB",
  paymentTerms: "Net 30",
  discountRate: "5%",
  preferredDeliveryTime: "Morning",
  specialInstructions: "Call before delivery",
};

// Mock related customers for grouping
const relatedCustomers = [
  {
    id: "CUST-002",
    name: "Ethiopian Airlines",
    type: "Corporate",
    contactPerson: "Tigist Hailu",
    location: "Bole International Airport",
    distance: "5.2 km",
  },
  {
    id: "CUST-003",
    name: "Marta Tadesse",
    type: "Individual",
    contactPerson: null,
    location: "Merkato, Addis Ababa",
    distance: "12.8 km",
  },
  {
    id: "CUST-004",
    name: "Dashen Bank",
    type: "Corporate",
    contactPerson: "Yohannes Desta",
    location: "Ras Abebe Aregay Street",
    distance: "8.5 km",
  },
];

// Mock order history
const orderHistory = [
  {
    id: "ORD-001",
    date: "2024-12-10",
    type: "Standard Delivery",
    description: "Package delivery to Bole area",
    amount: "3,500 ETB",
    status: "Delivered",
    rating: 5,
  },
  {
    id: "ORD-002",
    date: "2024-12-05",
    type: "Express Delivery",
    description: "Urgent document delivery",
    amount: "2,800 ETB",
    status: "Delivered",
    rating: 4,
  },
  {
    id: "ORD-003",
    date: "2024-12-01",
    type: "Bulk Delivery",
    description: "Multiple package delivery",
    amount: "8,200 ETB",
    status: "Delivered",
    rating: 5,
  },
];

export default function CustomerDetailsPage() {
  const navigate = useNavigate();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "Suspended":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Corporate":
        return "bg-purple-100 text-purple-700";
      case "Individual":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
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
            onClick={() => navigate("/customer")}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customer Details - #{customerData.customerId}
            </h1>
            <p className="text-gray-500 text-sm">
              Manage customer information and service preferences
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
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Customer Name
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {customerData.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {customerData.customerId}
                  </p>
                  <p className="text-sm text-gray-500">{customerData.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Customer Status
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(customerData.status)}>
                      ● {customerData.status}
                    </Badge>
                    <Badge className={getTypeColor(customerData.type)}>
                      {customerData.type}
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
                    {customerData.totalOrders}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Total Spent
                  </Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {customerData.totalSpent.toLocaleString()} ETB
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Loyalty Points
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <p className="text-lg font-semibold text-gray-900">
                      {customerData.loyaltyPoints}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Configuration */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Settings className="h-5 w-5 mr-2 text-blue-600" />
                Service Configuration
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
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Communication
                  </Label>
                  <Select defaultValue="sms">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="app">Mobile App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {customerData.preferredLanguage}
                </Badge>
                <Badge className="bg-gray-100 text-gray-700">
                  {customerData.communicationPreference}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Credit Limit
                  </Label>
                  <Select defaultValue="50000">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25000">25,000 ETB</SelectItem>
                      <SelectItem value="50000">50,000 ETB</SelectItem>
                      <SelectItem value="100000">100,000 ETB</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Payment Terms
                  </Label>
                  <Select defaultValue="net30">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty & Preferences */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Loyalty & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Discount Rate
                  </Label>
                  <Select defaultValue="5">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="15">15%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Delivery Time
                  </Label>
                  <Select defaultValue="morning">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">
                        Morning (8AM-12PM)
                      </SelectItem>
                      <SelectItem value="afternoon">
                        Afternoon (12PM-5PM)
                      </SelectItem>
                      <SelectItem value="evening">Evening (5PM-8PM)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
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
                      {customerData.phone}
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
                      {customerData.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    Address
                  </Label>
                  <span className="text-sm text-gray-900">
                    {customerData.address}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-600">
                    City
                  </Label>
                  <span className="text-sm text-gray-900">
                    {customerData.city}
                  </span>
                </div>
                {customerData.companyName && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-600">
                      Company
                    </Label>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {customerData.companyName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Grouping */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Customer Grouping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Select customers for bulk operations and group discounts:
              </p>
              <div className="space-y-3">
                {relatedCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => handleCustomerSelect(customer.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {customer.name} ({customer.id})
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.type} - {customer.location}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.distance}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Customer Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Registration Date
                  </Label>
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(
                        customerData.registrationDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Last Order
                  </Label>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(
                        customerData.lastOrderDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-gray-600">
                  Special Instructions
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {customerData.specialInstructions}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Recent Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {order.type}
                        </span>
                        <Badge className="bg-green-100 text-green-700">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                        <span>{order.amount}</span>
                        {order.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{order.rating}</span>
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
