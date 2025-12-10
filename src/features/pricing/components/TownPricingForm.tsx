"use client";

import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import SuccessModal from "@/components/common/SuccessModal";
import PricingFormHeader from "./PricingFormHeader";
import ActionButtons from "./ActionButtons";
import AdditionalChargesSection from "./AdditionalChargesSection";
import ServiceTypeSection from "./ServiceTypeSection";
import toast from "react-hot-toast";
import api from "@/lib/api/api";

const TownPricingSchema = Yup.object().shape({
  standard: Yup.number().min(0).required("Standard price is required"),
  sameDay: Yup.number().min(0).required("Same Day price is required"),
  overnight: Yup.number().min(0).required("Overnight price is required"),
  costPerKm: Yup.number().min(0).required("Cost per km is required"),
  profitMargin: Yup.number()
    .min(0)
    .max(100)
    .required("Profit margin is required"),
});

type DriverCommission = {
  category: string;
  name: string;
  fixedCost: number;
  driverCost: number;
  percentage?: number;
};

type InitialValues = {
  zone: string;
  standard: number;
  sameDay: number;
  overnight: number;
  costPerKm: number;
  profitMargin: number;
  driverCommission: DriverCommission[];
};

export default function TownPricingForm() {
  const navigate = useNavigate();
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const initialValues: InitialValues = {
    zone: "town",
    standard: 0,
    sameDay: 0,
    overnight: 0,
    costPerKm: 0,
    profitMargin: 0,
    driverCommission: [],
  };

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const res = await api.get(`/fleet/type?search=&page=1&limit=1000`);
        const vehicles = res.data.data?.vehicleTypes || [];
        setVehicleTypes(vehicles);
      } catch (error) {
        console.error("Error fetching vehicle types", error);
      }
    };
    fetchVehicleTypes();
  }, []);

  const handleSubmit = async (values: InitialValues) => {
    try {
      setLoading(true);
      const payload = {
        name: "Town Delivery Tariff",
        shippingScope: "TOWN",
        currency: "ETB",
        serviceTypes: [
          { serviceType: "STANDARD", baseFee: values.standard },
          { serviceType: "EXPRESS", baseFee: values.sameDay },
          { serviceType: "OVERNIGHT", baseFee: values.overnight },
        ],
        driverCommissions: values.driverCommission.map(c => ({
          vehicleTypeId: c.category,
          ...(c.fixedCost ? { fixed: c.fixedCost } : {}),
          ...(c.driverCost ? { perKm: c.driverCost } : {}),
          ...(c.percentage ? { percentage: c.percentage } : {}),
        })),
        profit: values.profitMargin,
      };

      await api.post("/pricing/tariff", payload);

      toast.success("Town pricing saved successfully!");
      navigate("/pricing");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save tariff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        enableReinitialize
        initialValues={{
          ...initialValues,
          driverCommission: vehicleTypes.map(v => ({
            category: v.id,
            name: v.name,
            fixedCost: 0,
            driverCost: 0,
            percentage: 0,
          })),
        }}
        validationSchema={TownPricingSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <PricingFormHeader title="Town Pricing Configuration" />

            {/* Services without weight ranges */}
            <ServiceTypeSection
              serviceName="Standard Service"
              serviceLabel="Standard Price"
              fieldName="standard"
              weightRanges={[]} // Not needed
              selectedRows={new Set()}
              onSelectionChange={() => {}}
              onAddRange={() => {}}
              onDeleteSelected={() => {}}
              fieldPrefix=""
              error={errors.standard}
              touched={touched.standard}
              incrementValue={0}
              isExpanded={true}
              onToggle={() => {}}
              hasWeight={false}
            />

            <ServiceTypeSection
              serviceName="Same Day Service"
              serviceLabel="Same Day Price"
              fieldName="sameDay"
              weightRanges={[]}
              selectedRows={new Set()}
              onSelectionChange={() => {}}
              onAddRange={() => {}}
              onDeleteSelected={() => {}}
              fieldPrefix=""
              error={errors.sameDay}
              touched={touched.sameDay}
              incrementValue={0}
              isExpanded={true}
              onToggle={() => {}}
              hasWeight={false}
            />

            <ServiceTypeSection
              serviceName="Overnight Service"
              serviceLabel="Overnight Price"
              fieldName="overnight"
              weightRanges={[]}
              selectedRows={new Set()}
              onSelectionChange={() => {}}
              onAddRange={() => {}}
              onDeleteSelected={() => {}}
              fieldPrefix=""
              error={errors.overnight}
              touched={touched.overnight}
              incrementValue={0}
              isExpanded={true}
              onToggle={() => {}}
              hasWeight={false}
            />

            {/* Additional Charges */}
            <AdditionalChargesSection
              costPerKmError={errors.costPerKm}
              costPerKmTouched={touched.costPerKm}
              airportFeeError={undefined}
              airportFeeTouched={undefined}
              profitMarginError={errors.profitMargin}
              profitMarginTouched={touched.profitMargin}
              driverCommission={values.driverCommission}
              showAirportFee={false}
            />

            <ActionButtons />
          </Form>
        )}
      </Formik>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate("/pricing");
        }}
        trackingNumber={successMessage}
      />
    </div>
  );
}
