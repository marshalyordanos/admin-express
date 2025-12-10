"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IoPerson,
  IoLocation,
  IoCall,
  IoCar,
  IoAdd,
  IoSearch,
  IoFilter,
  IoClose
} from "react-icons/io5";

import "leaflet/dist/leaflet.css";
import { FloatButton } from "antd";
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

// Custom driver icon
const createDriverIcon = (status: string) => {
  const color =
    status === "Available" ? "green" : status === "On Route" ? "blue" : "red";
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
  name: string;
  status: "Available" | "On Route" | "On Break" | "Offline";
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
  latitude: number;
  longitude: number;
  city: string;
}

interface DriversMapViewProps {
  onCreateDriver: () => void;
}

const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Dagim Birhan",
    status: "On Route",
    currentLocation: "Mexico",
    vehicle: "Van #001",
    capacity: 15,
    currentLoad: 8,
    rating: 4.8,
    phone: "+1 (555) 123-4567",
    lastUpdate: "2 min ago",
    route: "Route A",
    deliveries: 10,
    completed: 5,
    remaining: 5,
    latitude: 9.0192,
    longitude: 38.7525,
    city: "Addis Ababa",
  },
  {
    id: "2",
    name: "Wondimu Alelgne",
    status: "Available",
    currentLocation: "Dawnton",
    vehicle: "Truck #002",
    capacity: 25,
    currentLoad: 0,
    rating: 4.9,
    phone: "+1 (555) 234-5678",
    lastUpdate: "5 min ago",
    route: "None",
    deliveries: 0,
    completed: 0,
    remaining: 0,
    latitude: 9.025,
    longitude: 38.76,
    city: "Adama",
  },
  {
    id: "3",
    name: "Kirubel",
    status: "On Route",
    currentLocation: "Shinasha",
    vehicle: "Van #003",
    capacity: 12,
    currentLoad: 5,
    rating: 4.7,
    phone: "+1 (555) 345-6789",
    lastUpdate: "10 min ago",
    route: "Route B",
    deliveries: 13,
    completed: 12,
    remaining: 1,
    latitude: 9.03,
    longitude: 38.74,
    city: "Gambela",
  },
  {
    id: "4",
    name: "Thomas Derbe",
    status: "Available",
    currentLocation: "Sarbet",
    vehicle: "Van #004",
    capacity: 10,
    currentLoad: 3,
    rating: 4.6,
    phone: "+1 (555) 456-7890",
    lastUpdate: "15 min ago",
    route: "None",
    deliveries: 0,
    completed: 0,
    remaining: 0,
    latitude: 9.015,
    longitude: 38.77,
    city: "Addis Ababa",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700";
    case "On Route":
      return "bg-blue-100 text-blue-700";
    case "On Break":
      return "bg-yellow-100 text-yellow-700";
    case "Offline":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function DriversMapView({
  onCreateDriver,
}: DriversMapViewProps) {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [filterStatus] = useState<string>("all");
  const [dispatchProgress] = useState(75);


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [drivers,setDrivers] = useState<any>([])
  const [driverLoading,setDriverLoading] = useState(false)
  const [pagination,setPagination] = useState<Pagination | null>(null)
  const [driverSearch,setDriverSearch] = useState("")

  const filteredDrivers = mockDrivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

 
  const featchOrders = async (page=1,limit=10) => {
    try {
      setDriverLoading(true);

      // const staffs = await api.get<any>(`/staff/driver?search=all:${driverSearch}&page=${page}&pageSize=${limit}`)
      const staffs = await api.get<any>(`/staff/driver`)

      setDrivers(staffs.data.data?.drivers);
      setPagination(staffs.data.pagination);
      // toast.success(staffs.data.message);
      setDriverLoading(false);
    } catch (error: any) {
      setDriverLoading(false);

      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error); // optional: log the full error
    }
  };

  useEffect(() => {
    featchOrders(currentPage,pageSize);
  }, [driverSearch,currentPage,pageSize]);
 


  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
  };

  const handleSelectAll = () => {
    if (selectedDrivers.length === filteredDrivers.length) {
      setSelectedDrivers([]);
    } else {
      setSelectedDrivers(filteredDrivers.map((d) => d.id));
    }
  };

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
              Drivers ({mockDrivers.length})
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
          {drivers?.map((driver:any) => (
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
                        {driver?.user.name}
                      </h3>
                      {driver?.user?.deliveries > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700"
                        >
                          {driver.deliveries}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{driver.city}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">
                          {driver.completed}/{driver.deliveries}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full"
                            style={{
                              width: `${30
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
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            1-{mockDrivers.length} of {mockDrivers.length} results
          </p>
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
            {mockDrivers.map((driver) => (
              <Marker
                key={driver.id}
                position={[driver.latitude, driver.longitude]}
                icon={createDriverIcon(driver.status)}
                eventHandlers={{
                  click: () => handleSelectDriver(driver),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-medium">{driver.name}</h3>
                    <p className="text-sm text-gray-500">{driver.city}</p>
                    <Badge className={getStatusColor(driver.status)}>
                      {driver.status}
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
                    <h3 className="font-medium">{selectedDriver.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedDriver.city}
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
                        From {selectedDriver.name}'s vehicle
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
