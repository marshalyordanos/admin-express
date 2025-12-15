"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IoPerson,
  IoLocation,
  IoCall,
  IoCar,
  IoAdd,

  IoClose
} from "react-icons/io5";

import "leaflet/dist/leaflet.css";
import api from "@/lib/api/api";
import toast from "react-hot-toast";
import type { Pagination } from "@/types/types";


// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom driver icon - different colors for INTERNAL and EXTERNAL drivers
const createDriverIcon = (type: string) => {
  // Use different colors based on driver type
  const color = type === "INTERNAL" ? "#3b82f6" : "#10b981"; // Blue for INTERNAL, Green for EXTERNAL
  
  return L.divIcon({
    className: "custom-driver-icon",
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface Driver {
  id: string;
  userId: string;
  vehicleId: string;
  status: string;
  availablityStatus: string;
  type: "INTERNAL" | "EXTERNAL";
  licenseNumber?: string | null;
  licenseExpiry?: string | null;
  licenseIssue?: string | null;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  verifiedByOCR?: boolean;
  currentLat?: number;
  currentLon?: number;
  updatedAt: string;
  createdBy?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
  };
  vehicles?: Array<{
    id: string;
    model: string;
    plateNumber: string;
    status: string;
  }>;
  performance?: {
    totalOrders: number;
    completedOrders: number;
    failedOrders: number;
    completionRate: string;
  };
}

interface DriversMapViewProps {
  onCreateDriver: () => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
    case "ONLINE":
      return "bg-green-100 text-green-700";
    case "ON_ROUTE":
    case "ON ROUTE":
      return "bg-blue-100 text-blue-700";
    case "ON_BREAK":
    case "ON BREAK":
      return "bg-yellow-100 text-yellow-700";
    case "OFFLINE":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function DriversMapView({
  onCreateDriver,
}: DriversMapViewProps) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [dispatchProgress] = useState(75);

  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverLoading, setDriverLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [driverSearch] = useState("");

  
  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  // const handlePageSizeChange = (size: number) => {
  //   setPageSize(size);
  //   setCurrentPage(1); // Reset to first page when changing page size
  // };

 
  const featchOrders = async () => {
    try {
      setDriverLoading(true);

      const staffs = await api.get<{
        data: { drivers: Driver[] };
        pagination: Pagination;
      }>(`/staff/driver`);

      setDrivers(staffs.data.data?.drivers || []);
      setPagination(staffs.data.pagination);
      setDriverLoading(false);
    } catch (error: unknown) {
      setDriverLoading(false);

      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error);
    }
  };

  useEffect(() => {
    featchOrders();
  }, [driverSearch,currentPage,pageSize]);
 


  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  // const handleSelectAll = () => {
  //   if (selectedDrivers.length === filteredDrivers.length) {
  //     setSelectedDrivers([]);
  //   } else {
  //     setSelectedDrivers(filteredDrivers.map((d) => d.id));
  //   }
  // };

  // const handleDriverSelection = (driverId: string) => {
  //   setSelectedDrivers((prev) =>
  //     prev.includes(driverId)
  //       ? prev.filter((id) => id !== driverId)
  //       : [...prev, driverId]
  //   );
  // };
  const date = new Date();

  return (
    <div className="flex h-[calc(100vh-200px)] bg-gray-50">
      {/* Left Panel - Driver List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Drivers ({driverLoading ? "..." : drivers?.length || 0})
            </h2>
            <Button
              onClick={onCreateDriver}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <IoAdd className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </div>

          {/* Search and Filter */}
          {/* <div className="space-y-3">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Driver, city or des.."
                className="pl-10 py-7"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <IoFilter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Checkbox
                checked={
                  selectedDrivers.length === filteredDrivers.length &&
                  filteredDrivers.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">SELECT ALL</span>
            </div>
          </div> */}
        </div>

        {/* Driver List */}
        <div className="flex-1 overflow-y-auto">
          {driverLoading ? (
            // Loading skeleton
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 border-b border-gray-100 animate-pulse"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : drivers && drivers.length > 0 ? (
            drivers.map((driver) => (
              <div
                key={driver.id}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedDriver?.id === driver.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleSelectDriver(driver)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <IoPerson className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {driver?.user?.name || "Unknown"}
                        </h3>
                        {(driver?.performance?.totalOrders ?? 0) > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-700"
                          >
                            {driver.performance?.totalOrders ?? 0}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {driver?.type || "N/A"}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">
                            {driver?.performance?.completedOrders || 0}/{driver?.performance?.totalOrders || 0}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{
                                width: `${
                                  (driver?.performance?.totalOrders ?? 0) > 0
                                    ? (((driver.performance?.completedOrders ?? 0) / (driver.performance?.totalOrders ?? 1)) *
                                      100)
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle location tracking
                      }}
                    >
                      <IoLocation className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle calling driver
                      }}
                    >
                      <IoCall className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <IoPerson className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">No drivers found</p>
              <p className="text-sm text-gray-400 mt-1">
                Add a new driver to get started
              </p>
              <Button
                onClick={onCreateDriver}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <IoAdd className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200">
          {driverLoading ? (
            <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
          ) : (
            <p className="text-sm text-gray-500">
              {drivers && drivers.length > 0
                ? `1-${drivers.length} of ${pagination?.total || drivers.length} results`
                : "0 results"}
            </p>
          )}
        </div>
      </div>

      {/* Right Panel - Map and Details */}
      <div className="flex-1 flex flex-col">
        {/* Top Section - Dispatch Overview */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            {/* Dispatch Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    DISPATCH PROGRESS (3)
                  </h3>
                  <span className="text-sm text-gray-500">
                    {dispatchProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${dispatchProgress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Date */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">DATE</h3>
                <p className="text-sm text-gray-600">
                  {date.getDay() +
                    " / " +
                    date.getMonth() +
                    " / " +
                    date.getFullYear()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="flex-1 relative">
          {driverLoading ? (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : null}
          <MapContainer
            center={[9.0192, 38.7525]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {drivers &&
              drivers
                .filter(
                  (driver) =>
                    driver.currentLat !== undefined &&
                    driver.currentLon !== undefined &&
                    !isNaN(driver.currentLat) &&
                    !isNaN(driver.currentLon)
                )
                .map((driver) => (
                  <Marker
                    key={driver.id}
                    position={[driver.currentLat as number, driver.currentLon as number]}
                    icon={createDriverIcon(
                      driver.type || "EXTERNAL"
                    )}
                    eventHandlers={{
                      click: () => handleSelectDriver(driver),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-medium">
                          {driver?.user?.name || "Unknown"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {driver.type || "N/A"}
                        </p>
                        <Badge
                          className={getStatusColor(
                            driver.availablityStatus || driver.status || "OFFLINE"
                          )}
                        >
                          {driver.availablityStatus || driver.status || "OFFLINE"}
                        </Badge>
                      </div>
                    </Popup>
                  </Marker>
                ))}
          </MapContainer>
        </div>

        {/* Bottom Section - Driver Details and Live Feed */}
        {selectedDriver && (
          <div className="p-4 bg-white border-t border-gray-200">
            <div className=" flex flex-row justify-end">
            <Button variant="outline" className="my-2" onClick={()=>setSelectedDriver(null)} size="sm">
            <IoClose className="my-2" />
            </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Driver Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    DRIVER DETAILS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-medium">
                      {selectedDriver?.user?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedDriver?.type || "N/A"} • {selectedDriver?.user?.phone || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <IoCall className="h-4 w-4 mr-2" />
                      CALL DRIVER
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <IoLocation className="h-4 w-4 mr-2" />
                      LOCATION
                    </Button>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      CURRENT ROUTE
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Masonhave</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Janafort</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Feed */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900">
                      LIVE FEED
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">LIVE</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <div className="text-center">
                      <IoCar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Live camera feed</p>
                      <p className="text-xs text-gray-400">
                        From {selectedDriver?.user?.name || "Unknown"}'s vehicle
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <select className="w-full text-sm border border-gray-200 rounded px-2 py-1">
                      <option>ROAD VIEW</option>
                      <option>DRIVER VIEW</option>
                      <option>REAR VIEW</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
