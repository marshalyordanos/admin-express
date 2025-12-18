"use client";

import { Formik, Form } from "formik";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import SuccessModal from "@/components/common/SuccessModal";
import PricingFormHeader from "./PricingFormHeader";
import ActionButtons from "./ActionButtons";
import AdditionalChargesSection from "./AdditionalChargesSection";
import ServiceTypeSection from "./ServiceTypeSection";
import toast from "react-hot-toast";
import api from "@/lib/api/api";
import { Spinner } from "@/utils/spinner";

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
  fixedCost?: number;
  driverCost?: number;
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
  const [searchParams] = useSearchParams();
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [parsedPrice, setParsedPrice] = useState<any | null>(null);

  const createInitialValues: InitialValues = {
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
        setSuccessMessage("")
        console.error("Error fetching vehicle types", error);
      }
    };
    fetchVehicleTypes();
  }, []);

  // Parse query param if editing
  useEffect(() => {
    const raw = searchParams.get("price");
    if (!raw) return;
    try {
      const decoded = decodeURIComponent(raw);
      const obj = JSON.parse(decoded);
      setParsedPrice(obj);
    } catch {
      setParsedPrice(null);
    }
  }, [searchParams]);

  const isEditing = Boolean(parsedPrice && parsedPrice.id);

  const buildInitialValues = (): InitialValues => {
    const base = { ...createInitialValues };

    // driver commission skeleton
    const driverSkeleton = vehicleTypes.map(v => ({
      category: v.id,
      name: v.name,
      fixedCost: undefined,
      driverCost: undefined,
      percentage: undefined,
    }));
    base.driverCommission = driverSkeleton;

    if (!isEditing) return base;

    const serviceTypes: any[] = parsedPrice.serviceTypes || [];
    const standardST = serviceTypes.find(s => s.serviceType === "STANDARD");
    const expressST = serviceTypes.find(s => s.serviceType === "EXPRESS");
    const overnightST = serviceTypes.find(s => s.serviceType === "OVERNIGHT");

    base.standard = standardST?.baseFee ?? 0;
    base.sameDay = expressST?.baseFee ?? 0;
    base.overnight = overnightST?.baseFee ?? 0;
    base.profitMargin = parsedPrice.profitMargin?.percentage ?? parsedPrice.profit ?? 0;

    // map driver commissions
    const backendDCs: any[] = parsedPrice.driverCommissions || [];
    base.driverCommission = vehicleTypes.map(v => {
      const matched = backendDCs.find(d => d.vehicleTypeId === v.id);
      return {
        category: v.id,
        name: v.name,
        fixedCost: matched?.fixed,
        driverCost: matched?.perKm,
        percentage: matched?.percentage,
      };
    });

    return base;
  };

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
        driverCommissions: values.driverCommission
          .filter(c => {
            // Only include entries that have at least one value
            const hasFixed = c.fixedCost !== undefined && c.fixedCost !== null && c.fixedCost !== 0;
            const hasPerKm = c.driverCost !== undefined && c.driverCost !== null && c.driverCost !== 0;
            const hasPercentage = c.percentage !== undefined && c.percentage !== null && c.percentage !== 0;
            return hasFixed || hasPerKm || hasPercentage;
          })
          .map(c => {
            const commission: any = {
              vehicleTypeId: c.category,
            };
            // Only include fields that have values
            if (c.fixedCost !== undefined && c.fixedCost !== null && c.fixedCost !== 0) {
              commission.fixed = c.fixedCost;
            }
            if (c.driverCost !== undefined && c.driverCost !== null && c.driverCost !== 0) {
              commission.perKm = c.driverCost;
            }
            if (c.percentage !== undefined && c.percentage !== null && c.percentage !== 0) {
              commission.percentage = c.percentage;
            }
            return commission;
          }),
        profit: values.profitMargin,
      };

      if (isEditing) {
        await api.patch(`/pricing/tariff/${parsedPrice.id}`, payload);
        toast.success("Town pricing updated successfully!");
      } else {
        await api.post("/pricing/tariff", payload);
        toast.success("Town pricing saved successfully!");
      }

      navigate("/pricing");
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        "Failed to save tariff";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 bg-white relative">
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-blue-600" />
            <p className="text-gray-600 font-medium">
              {isEditing ? "Updating pricing..." : "Saving pricing..."}
            </p>
          </div>
        </div>
      )}
      <Formik
        enableReinitialize
        initialValues={buildInitialValues()}
        validationSchema={TownPricingSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => (
          <Form className={loading ? "pointer-events-none opacity-50" : ""}>
            <PricingFormHeader 
              title={isEditing ? "Edit Town Pricing Configuration" : "Town Pricing Configuration"} 
            />

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

            <ActionButtons isEditing={isEditing} loading={loading} />
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
