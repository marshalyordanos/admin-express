"use client";

import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import SuccessModal from "@/components/common/SuccessModal";
import PricingFormHeader from "./PricingFormHeader";
import ServiceTypeSection from "./ServiceTypeSection";
import AdditionalChargesSection from "./AdditionalChargesSection";
import ActionButtons from "./ActionButtons";
import toast from "react-hot-toast";
import api from "@/lib/api/api";

const RegionalPricingSchema = Yup.object().shape({
  standard: Yup.number()
    .min(0, "Price must be positive")
    .required("Standard service price is required"),
  sameDay: Yup.number()
    .min(0, "Price must be positive")
    .required("Same Day service price is required"),
  overnight: Yup.number()
    .min(0, "Price must be positive")
    .required("Overnight service price is required"),
  costPerKm: Yup.number()
    .min(0, "Cost must be positive")
    .required("Cost per km is required"),
  airportFee: Yup.number()
    .min(0, "Airport fee must be positive")
    .required("Airport fee is required"),
  profitMargin: Yup.number()
    .min(0, "Profit margin must be positive")
    .max(100, "Profit margin cannot exceed 100%")
    .required("Profit margin is required"),
});

type DriverCommission = {
  category: string; // vehicleTypeId
  name: string;     // vehicle name for display
  fixedCost: number;
  driverCost: number; // perKm
  percentage?: number;
};

type InitialValues = {
  zone: string;
  standard: number;
  sameDay: number;
  overnight: number;
  costPerKm: number;
  airportFee: number;
  profitMargin: number;
  standardWeightRanges: { from: string; to: string; price: number }[];
  sameDayWeightRanges: { from: string; to: string; price: number }[];
  overnightWeightRanges: { from: string; to: string; price: number }[];
  driverCommission: DriverCommission[];
};

export default function RegionalPricingForm() {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedSection, setExpandedSection] = useState<"standard" | "sameDay" | "overnight" | null>("standard");
  const [selectedRows, setSelectedRows] = useState<{
    standard: Set<number>;
    sameDay: Set<number>;
    overnight: Set<number>;
  }>({
    standard: new Set(),
    sameDay: new Set(),
    overnight: new Set(),
  });
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);

  const initialValues: InitialValues = {
    zone: "regional",
    standard: 0,
    sameDay: 0,
    overnight: 0,
    costPerKm: 0,
    airportFee: 0,
    profitMargin: 0,
    standardWeightRanges: [{ from: "1", to: "3", price: 0 }],
    sameDayWeightRanges: [{ from: "1", to: "3", price: 0 }],
    overnightWeightRanges: [{ from: "1", to: "3", price: 0 }],
    driverCommission: [],
  };

  // Fetch vehicle types dynamically
  const fetchVehicleTypes = async () => {
    try {
      const res = await api.get(`/fleet/type?search=&page=1&limit=1000`);
      const vehicles = res.data.data?.vehicleTypes || [];
      setVehicleTypes(vehicles);
    } catch (error) {
      console.error("Error fetching vehicle types", error);
    }
  };

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const handleSubmit = async (values: InitialValues) => {
    try {
      setLoading(true);

      const payload = {
        name: "International Delivery Tariff",
        shippingScope: "INTERNATIONAL",
        currency: "ETB",
        serviceTypes: [
          { serviceType: "STANDARD", baseFee: values.standard },
          { serviceType: "EXPRESS", baseFee: values.sameDay },
          { serviceType: "OVERNIGHT", baseFee: values.overnight },
        ],
        driverCommissions: values.driverCommission.map((c) => ({
          vehicleTypeId: c.category,
          ...(c.fixedCost ? { fixed: c.fixedCost } : {}),
          ...(c.driverCost ? { perKm: c.driverCost } : {}),
          ...(c.percentage ? { percentage: c.percentage } : {}),
        })),
        profit:  values.profitMargin,
        
        airportFees: [
          {
            serviceType: "EXPRESS",
            brackets: values.sameDayWeightRanges.map((range) => ({
              minKg: Number(range.from),
              maxKg: Number(range.to),
              rate: range.price,
            })),
          },
        ],
      };

      console.log("SENDING PAYLOAD:", payload);

      await api.post("/pricing/tariff", payload);

      toast.success("pricing configuration saved successfully!");
      navigate("/pricing");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Failed to save tariff");
    }
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/pricing");
  };

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        enableReinitialize
        initialValues={{
          ...initialValues,
          driverCommission: vehicleTypes.map((v) => ({
            category: v.id,
            name: v.name,
            fixedCost: 0,
            driverCost: 0,
            percentage: 0,
          })),
        }}
        validationSchema={RegionalPricingSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <PricingFormHeader title="Regional Pricing Configuration" />

            {/* Service Type Sections */}
            <ServiceTypeSection
              serviceName="Standard Service"
              serviceLabel="Standard Service Price"
              fieldName="standard"
              weightRanges={values.standardWeightRanges}
              selectedRows={selectedRows.standard}
              onSelectionChange={(newSelection) => {
                setSelectedRows({ ...selectedRows, standard: newSelection });
              }}
              onAddRange={() => {
                const lastRange =
                  values.standardWeightRanges[values.standardWeightRanges.length - 1];
                setFieldValue("standardWeightRanges", [
                  ...values.standardWeightRanges,
                  { from: lastRange.to, to: String(Number(lastRange.to) + 5), price: 0 },
                ]);
              }}
              onDeleteSelected={() => {
                const newRanges = values.standardWeightRanges.filter(
                  (_, i) => !selectedRows.standard.has(i)
                );
                setFieldValue("standardWeightRanges", newRanges);
                setSelectedRows({ ...selectedRows, standard: new Set() });
              }}
              fieldPrefix="standardWeightRanges"
              error={errors.standard}
              touched={touched.standard}
              incrementValue={5}
              isExpanded={expandedSection === "standard"}
              onToggle={() => setExpandedSection(expandedSection === "standard" ? null : "standard")}
            />

            <ServiceTypeSection
              serviceName="Same Day Service"
              serviceLabel="Same Day Service Price"
              fieldName="sameDay"
              weightRanges={values.sameDayWeightRanges}
              selectedRows={selectedRows.sameDay}
              onSelectionChange={(newSelection) => {
                setSelectedRows({ ...selectedRows, sameDay: newSelection });
              }}
              onAddRange={() => {
                const lastRange =
                  values.sameDayWeightRanges[values.sameDayWeightRanges.length - 1];
                setFieldValue("sameDayWeightRanges", [
                  ...values.sameDayWeightRanges,
                  { from: lastRange.to, to: String(Number(lastRange.to) + 5), price: 0 },
                ]);
              }}
              onDeleteSelected={() => {
                const newRanges = values.sameDayWeightRanges.filter(
                  (_, i) => !selectedRows.sameDay.has(i)
                );
                setFieldValue("sameDayWeightRanges", newRanges);
                setSelectedRows({ ...selectedRows, sameDay: new Set() });
              }}
              fieldPrefix="sameDayWeightRanges"
              error={errors.sameDay}
              touched={touched.sameDay}
              incrementValue={5}
              isExpanded={expandedSection === "sameDay"}
              onToggle={() => setExpandedSection(expandedSection === "sameDay" ? null : "sameDay")}
            />

            <ServiceTypeSection
              serviceName="Overnight Service"
              serviceLabel="Overnight Service Price"
              fieldName="overnight"
              weightRanges={values.overnightWeightRanges}
              selectedRows={selectedRows.overnight}
              onSelectionChange={(newSelection) => {
                setSelectedRows({ ...selectedRows, overnight: newSelection });
              }}
              onAddRange={() => {
                const lastRange =
                  values.overnightWeightRanges[values.overnightWeightRanges.length - 1];
                setFieldValue("overnightWeightRanges", [
                  ...values.overnightWeightRanges,
                  { from: lastRange.to, to: String(Number(lastRange.to) + 5), price: 0 },
                ]);
              }}
              onDeleteSelected={() => {
                const newRanges = values.overnightWeightRanges.filter(
                  (_, i) => !selectedRows.overnight.has(i)
                );
                setFieldValue("overnightWeightRanges", newRanges);
                setSelectedRows({ ...selectedRows, overnight: new Set() });
              }}
              fieldPrefix="overnightWeightRanges"
              error={errors.overnight}
              touched={touched.overnight}
              incrementValue={5}
              isExpanded={expandedSection === "overnight"}
              onToggle={() => setExpandedSection(expandedSection === "overnight" ? null : "overnight")}
            />

            {/* Additional Charges */}
            <AdditionalChargesSection
              costPerKmError={errors.costPerKm}
              costPerKmTouched={touched.costPerKm}
              airportFeeError={errors.airportFee}
              airportFeeTouched={touched.airportFee}
              profitMarginError={errors.profitMargin}
              profitMarginTouched={touched.profitMargin}
              driverCommission={values.driverCommission}
              showAirportFee={true}
            />

            {/* Dynamic Driver Commission Inputs */}
            {/* <div className="mt-6">
              <h3 className="font-semibold mb-2">Driver Commissions</h3>
              {values.driverCommission.map((dc, index) => (
                <div key={dc.category} className="flex gap-4 mb-2 items-center">
                  <span className="w-32">{dc.name}</span>
                  <input
                    type="number"
                    placeholder="Fixed Cost"
                    className="border px-2 py-1 w-24"
                    value={dc.fixedCost}
                    onChange={(e) => {
                      const updated = [...values.driverCommission];
                      updated[index].fixedCost = Number(e.target.value);
                      setFieldValue("driverCommission", updated);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Per Km"
                    className="border px-2 py-1 w-24"
                    value={dc.driverCost}
                    onChange={(e) => {
                      const updated = [...values.driverCommission];
                      updated[index].driverCost = Number(e.target.value);
                      setFieldValue("driverCommission", updated);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="%"
                    className="border px-2 py-1 w-24"
                    value={dc.percentage || 0}
                    onChange={(e) => {
                      const updated = [...values.driverCommission];
                      updated[index].percentage = Number(e.target.value);
                      setFieldValue("driverCommission", updated);
                    }}
                  />
                </div>
              ))}
            </div> */}

            <ActionButtons />
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
