import { useState } from "react";
import {
  Search,
  Download,
  Plus,
  Save,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdEdit, MdDelete, MdLock } from "react-icons/md";

// Mock data
const baseRates = [
  {
    id: "1",
    serviceType: "Standard",
    customerType: "Individual",
    zone: "Town",
    weightRange: "0-5kg",
    pricePerKg: "$2.50",
    perKmCost: "$0.50",
    customBoardFee: "N/A",
    profitMargin: "15%",
    status: "Active",
  },
  {
    id: "2",
    serviceType: "Same Day",
    customerType: "Corporate",
    zone: "Regional",
    weightRange: "0-10kg",
    pricePerKg: "$3.00",
    perKmCost: "$0.75",
    customBoardFee: "$15.00",
    profitMargin: "20%",
    status: "Active",
  },
  {
    id: "3",
    serviceType: "Overnight",
    customerType: "Individual",
    zone: "International",
    weightRange: "0-20kg",
    pricePerKg: "$5.00",
    perKmCost: "$1.00",
    customBoardFee: "$25.00",
    profitMargin: "25%",
    status: "Active",
  },
];

const zoneSurcharges = [
  {
    id: "1",
    zone: "North America",
    surcharge: "+15%",
    baseRate: "$25.00",
    effectiveRate: "$28.75",
    status: "Active",
  },
  {
    id: "2",
    zone: "Europe",
    surcharge: "+20%",
    baseRate: "$25.00",
    effectiveRate: "$30.00",
    status: "Active",
  },
  {
    id: "3",
    zone: "Asia Pacific",
    surcharge: "+25%",
    baseRate: "$25.00",
    effectiveRate: "$31.25",
    status: "Active",
  },
];

const corporatePlans = [
  {
    id: "1",
    clientName: "TechCorp Industries",
    planName: "Enterprise Plus",
    discount: "20%",
    minVolume: "1000",
    validUntil: "2024-12-31",
    status: "Active",
  },
  {
    id: "2",
    clientName: "Global Logistics Co.",
    planName: "Volume Discount",
    discount: "15%",
    minVolume: "500",
    validUntil: "2024-11-30",
    status: "Active",
  },
];

const promoCodes = [
  {
    id: "1",
    code: "OCTOBER20",
    discount: "20%",
    type: "Percentage",
    validFrom: "2024-10-01",
    validUntil: "2024-10-31",
    usageLimit: "1000",
    usedCount: "247",
    status: "Active",
  },
  {
    id: "2",
    code: "FREESHIP",
    discount: "$5.00",
    type: "Fixed",
    validFrom: "2024-10-01",
    validUntil: "2024-10-15",
    usageLimit: "500",
    usedCount: "156",
    status: "Active",
  },
];

const metrics = [
  {
    title: "Active Rate Plans",
    value: "12",
    change: "2 new this month",
    trend: "up",
    color: "blue",
  },
  {
    title: "Corporate Clients",
    value: "8",
    change: "1 new this week",
    trend: "up",
    color: "green",
  },
  {
    title: "Active Promo Codes",
    value: "5",
    change: "3 expiring soon",
    trend: "down",
    color: "orange",
  },
  {
    title: "Revenue Impact",
    value: "+15.2%",
    change: "vs last month",
    trend: "up",
    color: "teal",
  },
];

const MiniChart = ({ color }: { color: string }) => {
  const colors = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    orange: "stroke-orange-500",
    teal: "stroke-teal-500",
  };

  return (
    <svg width="60" height="20" viewBox="0 0 60 20" className="ml-auto">
      <path
        d="M2 18 L8 12 L14 15 L20 8 L26 11 L32 5 L38 9 L44 3 L50 7 L56 2"
        fill="none"
        strokeWidth="1.5"
        className={colors[color as keyof typeof colors]}
      />
      <path
        d="M2 18 L8 12 L14 15 L20 8 L26 11 L32 5 L38 9 L44 3 L50 7 L56 2 L60 20 L2 20 Z"
        fill="currentColor"
        className={`${colors[color as keyof typeof colors]} opacity-10`}
      />
    </svg>
  );
};

const tabs = [
  "Base Rates",
  "Zone Surcharges",
  "Corporate Plans",
  "Promo Codes",
];

export default function PricingMain() {
  const [activeTab, setActiveTab] = useState("Base Rates");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSaveAndPublish = () => {
    setShowSaveModal(true);
    // Simulate API call
    setTimeout(() => {
      setShowSaveModal(false);
      setHasUnsavedChanges(false);
      // Show success notification
    }, 2000);
  };

  const renderBaseRates = () => (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Base Rate Configuration
        </CardTitle>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rate
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Service Type
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Customer Type
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Zone</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Weight Range
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Price/Kg
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Per Km
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Custom Board Fee
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Margin
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {baseRates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">
                  {rate.serviceType}
                </TableCell>
                <TableCell>{rate.customerType}</TableCell>
                <TableCell>
                  <Badge variant="outline">{rate.zone}</Badge>
                </TableCell>
                <TableCell>{rate.weightRange}</TableCell>
                <TableCell className="text-blue-600 font-semibold">
                  {rate.pricePerKg}
                </TableCell>
                <TableCell className="text-green-600 font-semibold">
                  {rate.perKmCost}
                </TableCell>
                <TableCell className="text-orange-600">
                  {rate.customBoardFee}
                </TableCell>
                <TableCell className="text-purple-600">
                  {rate.profitMargin}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={rate.status === "Active" ? "default" : "secondary"}
                    className={
                      rate.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {rate.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                    >
                      <MdEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                    >
                      <MdLock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-red-400 bg-red-50 cursor-not-allowed opacity-60"
                    >
                      <MdDelete className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderZoneSurcharges = () => (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Zone-Based Surcharges
        </CardTitle>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Surcharge
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Zone</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Surcharge
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Base Rate
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Effective Rate
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zoneSurcharges.map((surcharge) => (
              <TableRow key={surcharge.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{surcharge.zone}</TableCell>
                <TableCell className="text-orange-600 font-semibold">
                  {surcharge.surcharge}
                </TableCell>
                <TableCell>{surcharge.baseRate}</TableCell>
                <TableCell className="text-green-600 font-semibold">
                  {surcharge.effectiveRate}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      surcharge.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      surcharge.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {surcharge.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                    >
                      <MdEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                    >
                      <MdLock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-red-400 bg-red-50 cursor-not-allowed opacity-60"
                    >
                      <MdDelete className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderCorporatePlans = () => (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Corporate Plans</CardTitle>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Client Name
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Plan Name
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Discount
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Min Volume
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Valid Until
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {corporatePlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{plan.clientName}</TableCell>
                <TableCell>{plan.planName}</TableCell>
                <TableCell className="text-green-600 font-semibold">
                  {plan.discount}
                </TableCell>
                <TableCell>{plan.minVolume} orders/month</TableCell>
                <TableCell>{plan.validUntil}</TableCell>
                <TableCell>
                  <Badge
                    variant={plan.status === "Active" ? "default" : "secondary"}
                    className={
                      plan.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {plan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                    >
                      <MdEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                    >
                      <MdLock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-red-400 bg-red-50 cursor-not-allowed opacity-60"
                    >
                      <MdDelete className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderPromoCodes = () => (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Promo Codes</CardTitle>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Promo Code
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Code</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Discount
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Type</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Valid Period
              </TableHead>
              <TableHead className="text-gray-600 font-medium">Usage</TableHead>
              <TableHead className="text-gray-600 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium font-mono">
                  {code.code}
                </TableCell>
                <TableCell className="text-purple-600 font-semibold">
                  {code.discount}
                </TableCell>
                <TableCell>{code.type}</TableCell>
                <TableCell>
                  {code.validFrom} - {code.validUntil}
                </TableCell>
                <TableCell>
                  {code.usedCount}/{code.usageLimit}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={code.status === "Active" ? "default" : "secondary"}
                    className={
                      code.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {code.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                    >
                      <MdEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"
                    >
                      <MdLock className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="p-2 text-red-400 bg-red-50 cursor-not-allowed opacity-60"
                    >
                      <MdDelete className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <main>
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Pricing & Tariff Management
            </h1>
            {hasUnsavedChanges && (
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-200"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Rates
            </Button>
            <Button
              onClick={handleSaveAndPublish}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save & Publish
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
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
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
                  <MiniChart color={metric.color} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-10 mb-6">
          <div className="flex items-center space-x-1 bg-[#9d979724] rounded-md p-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`hover:bg-white cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-4 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search rates, plans, codes..."
              className="pl-10 pr-3 w-full py-6"
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "Base Rates" && renderBaseRates()}
        {activeTab === "Zone Surcharges" && renderZoneSurcharges()}
        {activeTab === "Corporate Plans" && renderCorporatePlans()}
        {activeTab === "Promo Codes" && renderPromoCodes()}

        {/* Save & Publish Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-white/10 flex items-center justify-center z-50">
            <Card className="w-96 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Publishing Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    <span className="text-sm text-gray-600">
                      Syncing rates to customer portal...
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Changes will be live within 30 seconds
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New{" "}
                  {activeTab === "Base Rates"
                    ? "Rate"
                    : activeTab === "Zone Surcharges"
                    ? "Surcharge"
                    : activeTab === "Corporate Plans"
                    ? "Plan"
                    : "Promo Code"}
                </h2>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <div className="space-y-6">
                  {activeTab === "Base Rates" && (
                    <>
                      {/* Service Configuration */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <h3 className="text-lg font-medium mb-4">
                          Service Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="mb-1">Service Type</Label>
                            <Select>
                              <SelectTrigger className="py-7 w-full">
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">
                                  Standard
                                </SelectItem>
                                <SelectItem value="sameday">
                                  Same Day
                                </SelectItem>
                                <SelectItem value="overnight">
                                  Overnight
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="mb-1">Customer Type</Label>
                            <Select>
                              <SelectTrigger className="py-7 w-full">
                                <SelectValue placeholder="Select customer type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="individual">
                                  Individual
                                </SelectItem>
                                <SelectItem value="corporate">
                                  Corporate
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="mb-1">Destination Zone</Label>
                            <Select>
                              <SelectTrigger className="py-7 w-full">
                                <SelectValue placeholder="Select zone" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="town">Town</SelectItem>
                                <SelectItem value="regional">
                                  Regional
                                </SelectItem>
                                <SelectItem value="international">
                                  International
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Weight & Distance Pricing */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <h3 className="text-lg font-medium mb-4">
                          Weight & Distance Pricing
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="mb-1">Weight Range (kg)</Label>
                            <Input className="py-7" placeholder="e.g., 0-5" />
                          </div>
                          <div>
                            <Label className="mb-1">
                              Base Price per Kg ($)
                            </Label>
                            <Input
                              className="py-7"
                              type="number"
                              step="0.01"
                              placeholder="e.g., 2.50"
                            />
                          </div>
                          <div>
                            <Label className="mb-1">Per Km Cost ($)</Label>
                            <Input
                              className="py-7"
                              type="number"
                              step="0.01"
                              placeholder="e.g., 0.50"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Fees */}
                      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <h3 className="text-lg font-medium mb-4">
                          Additional Fees
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="mb-1">
                              Custom Board Fee (Regional/International)
                            </Label>
                            <Input
                              className="py-7"
                              type="number"
                              step="0.01"
                              placeholder="e.g., 15.00"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Applied only for Regional and International
                              shipments
                            </p>
                          </div>
                          <div>
                            <Label className="mb-1">Profit Margin (%)</Label>
                            <Input
                              className="py-7"
                              type="number"
                              step="0.1"
                              placeholder="e.g., 15"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Percentage added to final calculated price
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "Zone Surcharges" && (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h3 className="text-lg font-medium mb-4">
                        Zone Surcharge Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1">Zone</Label>
                          <Select>
                            <SelectTrigger className="py-7 w-full">
                              <SelectValue placeholder="Select zone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="town">Town</SelectItem>
                              <SelectItem value="regional">Regional</SelectItem>
                              <SelectItem value="international">
                                International
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-1">Surcharge Percentage</Label>
                          <Input className="py-7" placeholder="e.g., 15" />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-1">Base Rate</Label>
                        <Input className="py-7" placeholder="e.g., $25.00" />
                      </div>
                    </div>
                  )}

                  {activeTab === "Corporate Plans" && (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h3 className="text-lg font-medium mb-4">
                        Corporate Plan Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1">Client Name</Label>
                          <Input
                            className="py-7"
                            placeholder="e.g., TechCorp Industries"
                          />
                        </div>
                        <div>
                          <Label className="mb-1">Plan Name</Label>
                          <Input
                            className="py-7"
                            placeholder="e.g., Enterprise Plus"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1">Discount Percentage</Label>
                          <Input className="py-7" placeholder="e.g., 20" />
                        </div>
                        <div>
                          <Label className="mb-1">
                            Minimum Volume (orders/month)
                          </Label>
                          <Input className="py-7" placeholder="e.g., 1000" />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-1">Valid Until</Label>
                        <Input className="py-7" type="date" />
                      </div>
                    </div>
                  )}

                  {activeTab === "Promo Codes" && (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <h3 className="text-lg font-medium mb-4">
                        Promo Code Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1">Promo Code</Label>
                          <Input
                            className="py-7 font-mono"
                            placeholder="e.g., OCTOBER20"
                          />
                        </div>
                        <div>
                          <Label className="mb-1">Discount Value</Label>
                          <Input
                            className="py-7"
                            placeholder="e.g., 20% or $5.00"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="mb-1">Valid From</Label>
                          <Input className="py-7" type="date" />
                        </div>
                        <div>
                          <Label className="mb-1">Valid Until</Label>
                          <Input className="py-7" type="date" />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-1">Usage Limit</Label>
                        <Input className="py-7" placeholder="e.g., 1000" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200 mt-6">
                  <Button
                    onClick={() => setShowAddModal(false)}
                    variant="outline"
                    className="flex-1 py-7 text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddModal(false);
                      setHasUnsavedChanges(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-7"
                  >
                    Add{" "}
                    {activeTab === "Base Rates"
                      ? "Rate"
                      : activeTab === "Zone Surcharges"
                      ? "Surcharge"
                      : activeTab === "Corporate Plans"
                      ? "Plan"
                      : "Promo Code"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
