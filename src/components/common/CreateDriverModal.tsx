"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";

interface CreateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driverData: DriverData) => void;
}

interface DriverData {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehicleType: string;
  capacity: number;
  licenseNumber: string;
  address: string;
  city: string;
  status: string;
  notes: string;
}

export default function CreateDriverModal({
  isOpen,
  onClose,
  onSave,
}: CreateDriverModalProps) {
  const [formData, setFormData] = useState<DriverData>({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    vehicleType: "",
    capacity: 0,
    licenseNumber: "",
    address: "",
    city: "",
    status: "Available",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    field: keyof DriverData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(formData);
      onClose();
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle: "",
        vehicleType: "",
        capacity: 0,
        licenseNumber: "",
        address: "",
        city: "",
        status: "Available",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating driver:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              Add New Driver
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
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter driver's full name"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2">Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="driver@example.com"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2">Phone Number *</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2">License Number *</Label>
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      handleInputChange("licenseNumber", e.target.value)
                    }
                    placeholder="DL123456789"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Vehicle Type *</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) =>
                      handleInputChange("vehicleType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2">Vehicle Number *</Label>
                  <Input
                    value={formData.vehicle}
                    onChange={(e) =>
                      handleInputChange("vehicle", e.target.value)
                    }
                    placeholder="Van #001"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2">Capacity (kg) *</Label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="15"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2">Initial Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="On Break">On Break</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Addis Ababa"
                    required
                  />
                </div>
                <div>
                  <Label className="mb-2">Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="123 Main Street"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Additional Information
              </h3>
              <div>
                <Label className="mb-2">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional notes about the driver..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Driver...
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircle className="h-4 w-4 mr-2" />
                    Create Driver
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
