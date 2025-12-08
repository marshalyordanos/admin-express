"use client";

import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/common/Button";
import { IoArrowBack, IoPricetags } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import SuccessModal from "@/components/common/SuccessModal";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import axios from "axios";
import api from "@/lib/api/api";
import type { Pagination } from "@/types/types";
import { Spinner } from "@/utils/spinner";
import toast from "react-hot-toast";

export default function TownPricingForm() {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWeightExpanded, setIsWeightExpanded] = useState(true);
  const [vehicleSearch, setVehicleSearch] = useState<{ [key: number]: string }>({});
  const [showVehicleDropdown, setShowVehicleDropdown] = useState<{ [key: number]: boolean }>({});
  const [paginationVehicles, setPaginationVehicles] = useState<Pagination | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<{ [key: number]: any | null }>({});
const [loading,setLaoding] = useState(false)
  
  const initialValues = {
    zone: "town",
    standard: 0,
    sameDay: 0,
    overnight: 0,
    costPerKm: 0,
    profitMargin: 0,
    weightRanges: [{ from: "0", to: "5", price: 0 }],

    driverCommissions: [
      {
        vehicleTypeId: "",
        type: "fixed",
        value: 0,
      },
    ],
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
    setLaoding(true)

      const payload = {
        name: "REGIONAL Delivery Tariff",
        shippingScope: "REGIONAL",
        currency: "ETB",

        serviceTypes: [
          { serviceType: "STANDARD", baseFee: values.standard },
          { serviceType: "EXPRESS", baseFee: values.sameDay },
          { serviceType: "OVERNIGHT", baseFee: values.overnight },
        ],

        weightBrackets: values.weightRanges.map((range) => ({
          startKg: Number(range.from),
          endKg: Number(range.to),
          price: Number(range.price),
        })),

        driverCommissions: values.driverCommissions.map((d) => {
          const base: any = { vehicleTypeId: d.vehicleTypeId };

          if (d.type === "fixed") base.fixed = Number(d.value);
          if (d.type === "perKm") base.perKm = Number(d.value);
          if (d.type === "percentage") base.percentage = Number(d.value);

          return base;
        }),

        additionalCharges: {
          costPerKm: Number(values.costPerKm),
          profitMargin: Number(values.profitMargin),
        },
      };

      console.log("SENDING PAYLOAD:", payload);

      await api.post(`/pricing/tariff`, payload);

      // setSuccessMessage("Town pricing configuration saved successfully!");
      // setIsSuccessModalOpen(true);
      toast.success("Town pricing configuration saved successfully!");

      navigate('/pricing')
    setLaoding(false)

    } catch (error) {
      console.error(error);
    setLaoding(false)

      // alert("Failed to save tariff");
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/pricing");
  };
  const fetchVehicleTypes = async (search = "", page = 1, limit = 10) => {
    try {
      setLoadingVehicles(true);
  
      const res = await api.get(
        `/fleet/type?search=${search}&page=${page}&limit=${limit}`
      );
  
      setVehicleTypes(res.data.data?.vehicleTypes);
      setPaginationVehicles(res.data.pagination);
    } catch (error) {
      console.error("Error fetching vehicle types", error);
    } finally {
      setLoadingVehicles(false);
    }
  };
  
  useEffect(() => {
    fetchVehicleTypes();
  }, [vehicleSearch]);
 
  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            {/* HEADER */}
            <header className="relative mb-8">
              <div className="absolute left-0 top-0">
                <Button type="button" onClick={() => navigate("/pricing")}>
                  <IoArrowBack />
                </Button>
              </div>
              <div className="flex justify-center items-center gap-2">
                <IoPricetags className="text-2xl text-blue-500" />
                <h1 className="text-2xl font-bold">
                International Pricing Configuration
                </h1>
              </div>
            </header>

            {/* SERVICE TYPES */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="font-semibold">Service Types</h2>

              <Label>Standard</Label>
              <Field as={Input} type="number" name="standard" />

              <Label>Express</Label>
              <Field as={Input} type="number" name="sameDay" />

              <Label>Overnight</Label>
              <Field as={Input} type="number" name="overnight" />
            </div>

            {/* WEIGHT BRACKETS */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <div className="flex justify-between">
                <h2 className="font-semibold">Weight Ranges</h2>
                <button type="button" onClick={() => setIsWeightExpanded(!isWeightExpanded)}>
                  {isWeightExpanded ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {isWeightExpanded &&
                values.weightRanges.map((_, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4">
                    <Field as={Input} name={`weightRanges.${index}.from`} placeholder="From KG" />
                    <Field as={Input} name={`weightRanges.${index}.to`} placeholder="To KG" />
                    <Field as={Input} name={`weightRanges.${index}.price`} placeholder="Price" />

                    <button
                      type="button"
                      onClick={() => {
                        const newRanges = values.weightRanges.filter((_, i) => i !== index);
                        setFieldValue("weightRanges", newRanges);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

              <Button
                type="button"
                onClick={() =>
                  setFieldValue("weightRanges", [
                    ...values.weightRanges,
                    { from: "", to: "", price: 0 },
                  ])
                }
              >
                Add Weight Range
              </Button>
            </div>

            {/* DRIVER COMMISSIONS */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="font-semibold">Driver Commissions</h2>

              {values.driverCommissions.map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center">
                  {/* <Field
                    as={Input}
                    name={`driverCommissions.${index}.vehicleTypeId`}
                    placeholder="Vehicle Type ID"
                  /> */}
<div className="relative">
  {/* <Label className="mb-2">Vehicle Type *</Label> */}

  <div className="relative">
    <Input
      placeholder="Search vehicle type"
      value={vehicleSearch[index] || ""}
      onChange={(e) => {
        const value = e.target.value;
        setVehicleSearch((prev) => ({ ...prev, [index]: value }));
        setShowVehicleDropdown((prev) => ({ ...prev, [index]: true }));

        if (!value) {
          setSelectedVehicle((prev) => ({ ...prev, [index]: null }));
          setFieldValue(`driverCommissions.${index}.vehicleTypeId`, "");
        }
      }}
      onFocus={() =>
        setShowVehicleDropdown((prev) => ({ ...prev, [index]: true }))
      }
      onBlur={() =>
        setTimeout(
          () =>
            setShowVehicleDropdown((prev) => ({ ...prev, [index]: false })),
          200
        )
      }
      className="py-5"
    />

    {selectedVehicle?.[index] && (
      <button
        type="button"
        onClick={() => {
          setSelectedVehicle((prev) => ({ ...prev, [index]: null }));
          setVehicleSearch((prev) => ({ ...prev, [index]: "" }));
          setFieldValue(`driverCommissions.${index}.vehicleTypeId`, "");
        }}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    )}
  </div>

  {showVehicleDropdown?.[index] && (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {loadingVehicles ? (
        <div className="flex justify-center items-center py-8">
          <Spinner className="h-6 w-6 mr-2" />
        </div>
      ) : vehicleTypes.length > 0 ? (
        vehicleTypes.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => {
              setSelectedVehicle((prev) => ({ ...prev, [index]: vehicle }));
              setVehicleSearch((prev) => ({ ...prev, [index]: vehicle.name }));

              // 👇 This keeps your payload EXACTLY the same
              setFieldValue(
                `driverCommissions.${index}.vehicleTypeId`,
                vehicle.id
              );
            }}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <div className="font-medium text-gray-900">
              {vehicle.name}
            </div>
            <div className="text-sm text-gray-600">
              ID: {vehicle.id}
            </div>
            <div className="text-sm text-gray-500">
              {vehicle.type}
            </div>
          </div>
        ))
      ) : (
        <div className="px-4 py-3 text-gray-500 text-center">
          No vehicle types found
        </div>
      )}
    </div>
  )}
</div>


                  <Field as="select" name={`driverCommissions.${index}.type`} className="border p-2 rounded">
                    <option value="fixed">Fixed</option>
                    <option value="perKm">Per Km</option>
                    <option value="percentage">Percentage</option>
                  </Field>

                  <Field
                    as={Input}
                    type="number"
                    name={`driverCommissions.${index}.value`}
                    placeholder="Value"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const newList = values.driverCommissions.filter((_, i) => i !== index);
                      setFieldValue("driverCommissions", newList);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() =>
                  setFieldValue("driverCommissions", [
                    ...values.driverCommissions,
                    { vehicleTypeId: "", type: "fixed", value: 0 },
                  ])
                }
              >
                Add Vehicle
              </Button>
            </div>

            {/* ADDITIONAL CHARGES */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="font-semibold">Additional Charges</h2>

              <Label>Cost Per Km</Label>
              <Field as={Input} type="number" name="costPerKm" />

              <Label>Profit Margin (%)</Label>
              <Field as={Input} type="number" name="profitMargin" />
            </div>

            <Button type="submit" className="w-full flex flex-row justify-center items-center">
             {loading?<Spinner className="h-6 w-6 mr-2 text-white"/>:" Save Configuration"}
            </Button>
          </Form>
        )}
      </Formik>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        trackingNumber={successMessage}
      />
    </div>
  );
}
