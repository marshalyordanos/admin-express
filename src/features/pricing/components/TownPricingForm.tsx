"use client";

import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/common/Button";
import { IoArrowBack, IoPricetags } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import SuccessModal from "@/components/common/SuccessModal";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const TownPricingSchema = Yup.object().shape({
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
  profitMargin: Yup.number()
    .min(0, "Profit margin must be positive")
    .max(100, "Profit margin cannot exceed 100%")
    .required("Profit margin is required"),
});

export default function TownPricingForm() {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWeightExpanded, setIsWeightExpanded] = useState(true);

  const initialValues = {
    zone: "town",
    standard: 0,
    sameDay: 0,
    overnight: 0,
    costPerKm: 0,
    profitMargin: 0,
    // Weight ranges
    weightRanges: [{ from: "1", to: "3", price: 0 }],
  };

  const handleSubmit = (
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    console.log("Town Pricing Data:", values);
    setSuccessMessage("Town pricing configuration saved successfully!");
    setIsSuccessModalOpen(true);

    setTimeout(() => {
      resetForm();
    }, 1000);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/pricing");
  };

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={TownPricingSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            {/* Header */}
            <header className="relative">
              <div className="absolute h-full top-0 left-0 flex items-center">
                <Button
                  type="button"
                  className="!text-white !size-[40px] bg-blue-500 hover:bg-blue-400 !rounded-full !p-0 !py-0 flex items-center justify-center !cursor-pointer"
                  onClick={() => navigate("/pricing")}
                >
                  <IoArrowBack className="text-white text-lg" />
                </Button>
              </div>
              <div className="flex gap-5 items-center justify-center mb-6">
                <div className="flex gap-4 items-center">
                  <IoPricetags className="text-4xl text-blue-500" />
                  <h1 className="text-3xl font-medium text-gray-700">
                    Town Pricing Configuration
                  </h1>
                </div>
              </div>
            </header>

            {/* Service Types Pricing */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Service Types</h2>

              <div>
                <Label className="mb-1">Standard Service Price ($)</Label>
                <Field
                  as={Input}
                  type="number"
                  step="0.01"
                  name="standard"
                  placeholder="Enter standard service price"
                  className={`py-7 ${
                    errors.standard && touched.standard ? "border-red-500" : ""
                  }`}
                />
                {errors.standard && touched.standard && (
                  <p className="text-red-500 text-sm mt-1">{errors.standard}</p>
                )}
              </div>

              <div>
                <Label className="mb-1">Same Day Service Price ($)</Label>
                <Field
                  as={Input}
                  type="number"
                  step="0.01"
                  name="sameDay"
                  placeholder="Enter same day service price"
                  className={`py-7 ${
                    errors.sameDay && touched.sameDay ? "border-red-500" : ""
                  }`}
                />
                {errors.sameDay && touched.sameDay && (
                  <p className="text-red-500 text-sm mt-1">{errors.sameDay}</p>
                )}
              </div>

              <div>
                <Label className="mb-1">Overnight Service Price ($)</Label>
                <Field
                  as={Input}
                  type="number"
                  step="0.01"
                  name="overnight"
                  placeholder="Enter overnight service price"
                  className={`py-7 ${
                    errors.overnight && touched.overnight
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors.overnight && touched.overnight && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.overnight}
                  </p>
                )}
              </div>
            </div>

            {/* Weight Ranges */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Weight Ranges</h2>
                <button
                  type="button"
                  className="p-2 !bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  onClick={() => setIsWeightExpanded(!isWeightExpanded)}
                >
                  {isWeightExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>

              {isWeightExpanded && (
                <>
                  {values.weightRanges.map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg items-center"
                    >
                      <div>
                        <Label className="mb-1">From (kg)</Label>
                        <Field
                          as={Input}
                          type="number"
                          name={`weightRanges.${index}.from`}
                          placeholder="From weight"
                          className="py-7"
                        />
                      </div>
                      <div>
                        <Label className="mb-1">To (kg)</Label>
                        <Field
                          as={Input}
                          type="number"
                          name={`weightRanges.${index}.to`}
                          placeholder="To weight"
                          className="py-7"
                        />
                      </div>
                      <div>
                        <Label className="mb-1">Price ($)</Label>
                        <Field
                          as={Input}
                          type="number"
                          step="0.01"
                          name={`weightRanges.${index}.price`}
                          placeholder="Price"
                          className="py-7"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          className={`p-2 !bg-gray-100 hover:!bg-gray-200 rounded-lg cursor-pointer transition-colors ${
                            values.weightRanges.length === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-500 hover:bg-red-50 hover:text-red-700"
                          }`}
                          onClick={() => {
                            if (values.weightRanges.length > 1) {
                              const newRanges = values.weightRanges.filter(
                                (_, i) => i !== index
                              );
                              setFieldValue("weightRanges", newRanges);
                            }
                          }}
                          disabled={values.weightRanges.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    className="!border-blue-400 hover:bg-blue-700 !cursor-pointer mt-4 text-white"
                    onClick={() => {
                      const lastRange =
                        values.weightRanges[values.weightRanges.length - 1];
                      setFieldValue("weightRanges", [
                        ...values.weightRanges,
                        {
                          from: lastRange.to,
                          to: String(Number(lastRange.to) + 5),
                          price: 0,
                        },
                      ]);
                    }}
                  >
                    Add Weight Range
                  </Button>
                </>
              )}
            </div>

            {/* Additional Charges */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Additional Charges</h2>

              <div>
                <Label className="mb-1">Cost Per Km ($)</Label>
                <Field
                  as={Input}
                  type="number"
                  step="0.01"
                  name="costPerKm"
                  placeholder="Enter cost per km"
                  className={`py-7 ${
                    errors.costPerKm && touched.costPerKm
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors.costPerKm && touched.costPerKm && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.costPerKm}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1">Profit Margin (%)</Label>
                <Field
                  as={Input}
                  type="number"
                  step="0.01"
                  name="profitMargin"
                  placeholder="Enter profit margin percentage"
                  className={`py-7 ${
                    errors.profitMargin && touched.profitMargin
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors.profitMargin && touched.profitMargin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profitMargin}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h2 className="text-lg font-medium mb-4">
                Complete Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  type="submit"
                  className="cursor-pointer hover:bg-blue-700"
                >
                  Save Configuration
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/pricing")}
                  className="bg-gray-100 hover:bg-gray-200 cursor-pointer !text-black border border-gray-300 !w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        trackingNumber={successMessage}
      />
    </div>
  );
}
