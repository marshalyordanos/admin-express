import { useState } from "react";
import {
  Download,
  Save,
  Package,
  Globe,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types

interface WeightData {
  costPerKm: string;
  profitMargin: string;
}

interface ServiceData {
  [weightRange: string]: WeightData;
}

interface ZoneData {
  standard: ServiceData;
  sameDay: ServiceData;
  overnight: ServiceData;
  airportFee: string;
  [key: string]: ServiceData | string;
}

interface PricingData {
  Town: ZoneData;
  Regional: ZoneData;
  International: ZoneData;
}

interface PricingParameters {
  title: string;
  icon: React.ReactNode;
  services: string[];
  weightRanges: string[];
  airportFee: boolean;
}

// Metrics data for dashboard
const metrics = [
  {
    title: "Total Packages",
    value: "24",
    change: "12.5% this month",
    trend: "up",
    color: "blue",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Average Price",
    value: "$35.50",
    change: "8.2% this month",
    trend: "up",
    color: "green",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Active Zones",
    value: "3",
    change: "No change",
    trend: "up",
    color: "purple",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    title: "Service Types",
    value: "6",
    change: "2 new this week",
    trend: "up",
    color: "orange",
    icon: <Users className="h-5 w-5" />,
  },
];

// MiniChart component for metrics
const MiniChart = ({ color }: { color: string }) => {
  const colors = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    purple: "stroke-purple-500",
    orange: "stroke-orange-500",
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

// Pricing parameters data
const pricingParameters: Record<string, PricingParameters> = {
  town: {
    title: "Town",
    icon: <Package className="h-5 w-5" />,
    services: ["Standard", "Same Day", "Overnight"],
    weightRanges: ["1-3kg", "3-5kg", "5-10kg"],
    airportFee: false,
  },
  regional: {
    title: "Regional",
    icon: <Globe className="h-5 w-5" />,
    services: ["Standard", "Same Day", "Overnight"],
    weightRanges: ["1-3kg", "3-5kg", "5-10kg", "10-20kg"],
    airportFee: true,
  },
  international: {
    title: "International",
    icon: <Globe className="h-5 w-5" />,
    services: ["Standard", "Same Day", "Overnight"],
    weightRanges: ["1-3kg", "3-5kg", "5-10kg", "10-20kg", "20kg+"],
    airportFee: true,
  },
};

export default function PricingMain() {
  const [activeTab, setActiveTab] = useState("town");
  const [pricingData, setPricingData] = useState<PricingData>({
    Town: {
      standard: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
      },
      sameDay: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
      },
      overnight: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
      },
      airportFee: "",
    },
    Regional: {
      standard: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
        "10-20kg": { costPerKm: "", profitMargin: "" },
      },
      sameDay: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
        "10-20kg": { costPerKm: "", profitMargin: "" },
      },
      overnight: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
        "10-20kg": { costPerKm: "", profitMargin: "" },
      },
      airportFee: "",
    },
    International: {
      standard: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
        "10-20kg": { costPerKm: "", profitMargin: "" },
        "20kg+": { costPerKm: "", profitMargin: "" },
      },
      sameDay: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
        "10-20kg": { costPerKm: "", profitMargin: "" },
        "20kg+": { costPerKm: "", profitMargin: "" },
      },
      overnight: {
        "1-3kg": { costPerKm: "", profitMargin: "" },
        "3-5kg": { costPerKm: "", profitMargin: "" },
        "5-10kg": { costPerKm: "", profitMargin: "" },
        "10-20kg": { costPerKm: "", profitMargin: "" },
        "20kg+": { costPerKm: "", profitMargin: "" },
      },
      airportFee: "",
    },
  });
  const [duplicatedWeights, setDuplicatedWeights] = useState<
    Record<string, number>
  >({});

  const handleAirportFeeChange = (zone: keyof PricingData, value: string) => {
    setPricingData((prev) => ({
      ...prev,
      [zone]: {
        ...prev[zone],
        airportFee: value,
      },
    }));
  };

  const handleAddWeight = (zoneKey: string) => {
    setDuplicatedWeights((prev) => ({
      ...prev,
      [zoneKey]: (prev[zoneKey] || 0) + 1,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving pricing data:", pricingData);
    // Here you would typically send the data to your backend
  };

  const renderPricingCard = (zoneKey: string) => {
    console.log(zoneKey);
    const zone = pricingParameters[zoneKey];
    const currentData = pricingData[zone?.title as keyof PricingData];

    return (
      <Card className="w-full max-w-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* <div className="p-2 bg-blue-100 rounded-lg">{zone?.icon}</div> */}
              <CardTitle className="text-xl font-bold text-gray-800">
                {zone?.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Service Types - Original */}
          {zone?.services.map((service) => (
            <div key={service} className="grid grid-cols-2">
              <Label className="font-semibold text-gray-700 capitalize">
                {service}
              </Label>
              <Input placeholder="Enter service type price" className="py-7" />
            </div>
          ))}

          {/* Duplicated Service Types */}
          {Array.from(
            { length: duplicatedWeights[zoneKey] || 0 },
            (_, index) => (
              <div
                key={`duplicate-${index}`}
                className="space-y-4 border-t pt-4"
              >
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Weight Range {index + 1}
                </div>

                <div key={`${index}`} className="grid grid-cols-2">
                  <Label className="font-semibold text-gray-700 capitalize">
                    From
                  </Label>
                  <Input placeholder="Enter from weight" className="py-7" />
                </div>
                <div key={`${index}`} className="grid grid-cols-2">
                  <Label className="font-semibold text-gray-700 capitalize">
                    To
                  </Label>
                  <Input placeholder="Enter to weight" className="py-7" />
                </div>
                <div key={`${index}`} className="grid grid-cols-2">
                  <Label className="font-semibold text-gray-700 capitalize">
                    Price
                  </Label>
                  <Input placeholder="Enter price" className="py-7" />
                </div>
              </div>
            )
          )}

          {/* Add Weight Button */}
          <div className="pt-2">
            <Button
              variant="outline"
              className="text-blue-700 border-blue-400 cursor-pointer"
              type="button"
              onClick={() => handleAddWeight(zoneKey)}
            >
              Add Weight
            </Button>
          </div>

          <div className="grid grid-cols-2 mt-4">
            <Label className="font-semibold text-gray-700 capitalize">
              Cost Per Km
            </Label>
            <Input placeholder="Enter cost per km" className="py-7" />
          </div>

          {/* Airport Fee - Only for Regional and International */}
          {zone?.airportFee && (
            <div className="grid grid-cols-2">
              <Label className="font-semibold text-gray-700 capitalize">
                Airport Fee
              </Label>

              <Input
                placeholder="Enter airport fee amount"
                value={currentData.airportFee || ""}
                onChange={(e) =>
                  handleAirportFeeChange(
                    zone?.title as keyof PricingData,
                    e.target.value
                  )
                }
                className="py-7"
              />
            </div>
          )}

          <div className="grid grid-cols-2">
            <Label className="font-semibold text-gray-700 capitalize">
              Profit Margin(%)
            </Label>
            <Input placeholder="Enter profit margin" className="py-7" />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Pricing & Tariff Management
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
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
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-full ${
                        metric.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : metric.color === "green"
                          ? "bg-green-100 text-green-600"
                          : metric.color === "purple"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {metric.icon}
                    </div>
                    <MiniChart color={metric.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          {Object.keys(pricingParameters).map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveTab(zone)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === zone
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {pricingParameters[zone]?.title}
            </button>
          ))}
        </div>

        {/* Pricing Card */}
        <div className="mb-8">
          {activeTab && renderPricingCard(activeTab as string)}
        </div>
      </main>
    </div>
  );
}
