import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "@/components/common/Button";
// import api from "@/lib/api/api";
import * as Yup from "yup";
import { IoArrowBack, IoCarSport } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

const VehicleValidationSchema = Yup.object().shape({
  plateNumber: Yup.string().required("Plate number is required"),
  type: Yup.string().required("Vehicle type is required"),
  brand: Yup.string().required("Brand is required"),
  model: Yup.string().required("Model is required"),
  year: Yup.number()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1, "Invalid year")
    .required("Year is required"),
  ownership: Yup.string().required("Ownership type is required"),
  fuelType: Yup.string().required("Fuel type is required"),
  capacity: Yup.string().required("Capacity is required"),
  insuranceExpiry: Yup.date().required("Insurance expiry date is required"),
});

const CreateVehicle = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialValues] = useState({
    plateNumber: "",
    type: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    ownership: "",
    driverId: "",
    fuelType: "",
    capacity: "",
    currentMileage: 0,
    insuranceNumber: "",
    insuranceProvider: "",
    insuranceExpiry: "",
    registrationDate: "",
    chassisNumber: "",
    engineNumber: "",
    color: "",
    notes: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Fetch vehicle data if in edit mode
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!isEditMode) return;

      setLoading(true);
      // try {
      //   const response = await api.get(`/fleet/vehicle/${id}`);
      //   const { success, data } = response.data;

      //   if (success && data) {
      //     // Pre-fill form with existing data
      //     setInitialValues({
      //       plateNumber: data.plateNumber || "",
      //       type: data.type || "",
      //       brand: data.brand || "",
      //       model: data.model || "",
      //       year: data.year || new Date().getFullYear(),
      //       ownership: data.ownership || "",
      //       driverId: data.driverId || "",
      //       fuelType: data.fuelType || "",
      //       capacity: data.capacity || "",
      //       currentMileage: data.currentMileage || 0,
      //       insuranceNumber: data.insuranceNumber || "",
      //       insuranceProvider: data.insuranceProvider || "",
      //       insuranceExpiry: data.insuranceExpiry || "",
      //       registrationDate: data.registrationDate || "",
      //       chassisNumber: data.chassisNumber || "",
      //       engineNumber: data.engineNumber || "",
      //       color: data.color || "",
      //       notes: data.notes || "",
      //     });
      //   }
      // } catch (error) {
      //   console.error("Error fetching vehicle data:", error);
      //   setMessage("Failed to load vehicle data");
      //   setStatus("error");
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchVehicleData();
  }, [id, isEditMode]);

  const handleSubmit = async () => {
    try {
      setStatus("submitting");
      setMessage(null);

      // const endpoint = isEditMode ? `/fleet/vehicle/${id}` : "/fleet/vehicle";
      // const method = isEditMode ? "put" : "post";

      // const response = await api[method](endpoint, values);
      // const { success, message: responseMessage } = response.data;

      // if (success) {
      //   setStatus("success");
      //   setMessage(
      //     responseMessage ||
      //       (isEditMode
      //         ? "Vehicle updated successfully!"
      //         : "Vehicle registered successfully!")
      //   );
      //   if (!isEditMode) {
      //     resetForm();
      //   }
      //   setTimeout(() => {
      //     navigate("/fleet");
      //   }, 2000);
      // } else {
      //   setStatus("error");
      //   setMessage(
      //     responseMessage ||
      //       (isEditMode
      //         ? "Failed to update vehicle"
      //         : "Failed to register vehicle")
      //   );
      // }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error(
        isEditMode ? "Update vehicle error:" : "Add vehicle error:",
        error
      );
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="max-w-4xl p-6 bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading vehicle data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={VehicleValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            {/* Header */}
            <header className="relative">
              <div className="absolute h-full top-0 left-0 flex items-center">
                <Button
                  type="button"
                  className="!text-white !size-[40px] bg-blue-500 hover:bg-blue-400 !rounded-full !p-0 !py-0 flex items-center justify-center !cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  <IoArrowBack className="text-white text-lg" />
                </Button>
              </div>
              <div className="flex gap-5 items-center justify-center mb-6">
                <div className="flex gap-4 items-center">
                  <IoCarSport className="text-3xl text-blue-500" />
                  <h1 className="text-3xl font-medium text-gray-700">
                    {isEditMode ? "Edit Vehicle" : "Register New Vehicle"}
                  </h1>
                </div>
              </div>
            </header>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
                  status === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Basic Vehicle Information */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">
                  Basic Vehicle Information
                </h2>
                <div>
                  <Label className="mb-1">Plate Number *</Label>
                  <Field
                    as={Input}
                    name="plateNumber"
                    placeholder="AA-12345"
                    className={`py-7 ${
                      errors.plateNumber && touched.plateNumber
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.plateNumber && touched.plateNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.plateNumber}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Vehicle Type *</Label>
                  <Select
                    value={values.type}
                    onValueChange={(val) => setFieldValue("type", val)}
                  >
                    <SelectTrigger
                      className={`py-7 !w-full ${
                        errors.type && touched.type ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="Pickup">Pickup Truck</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Trailer">Trailer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && touched.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Brand *</Label>
                  <Field
                    as={Input}
                    name="brand"
                    placeholder="e.g., Toyota, Isuzu, Ford"
                    className={`py-7 ${
                      errors.brand && touched.brand ? "border-red-500" : ""
                    }`}
                  />
                  {errors.brand && touched.brand && (
                    <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Model *</Label>
                  <Field
                    as={Input}
                    name="model"
                    placeholder="e.g., Hiace, Ranger, Canter"
                    className={`py-7 ${
                      errors.model && touched.model ? "border-red-500" : ""
                    }`}
                  />
                  {errors.model && touched.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Year *</Label>
                  <Field
                    as={Input}
                    type="number"
                    name="year"
                    placeholder="2023"
                    className={`py-7 ${
                      errors.year && touched.year ? "border-red-500" : ""
                    }`}
                  />
                  {errors.year && touched.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Color</Label>
                  <Field
                    as={Input}
                    name="color"
                    placeholder="e.g., White, Blue, Black"
                    className="py-7"
                  />
                </div>
              </div>

              {/* Ownership & Specifications */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">
                  Ownership & Specifications
                </h2>
                <div>
                  <Label className="mb-1">Ownership Type *</Label>
                  <Select
                    value={values.ownership}
                    onValueChange={(val) => setFieldValue("ownership", val)}
                  >
                    <SelectTrigger
                      className={`py-7 !w-full ${
                        errors.ownership && touched.ownership
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In-house">In-house (Owned)</SelectItem>
                      <SelectItem value="External">
                        External (Leased)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.ownership && touched.ownership && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownership}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Fuel Type *</Label>
                  <Select
                    value={values.fuelType}
                    onValueChange={(val) => setFieldValue("fuelType", val)}
                  >
                    <SelectTrigger
                      className={`py-7 !w-full ${
                        errors.fuelType && touched.fuelType
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fuelType && touched.fuelType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fuelType}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Load Capacity *</Label>
                  <Field
                    as={Input}
                    name="capacity"
                    placeholder="e.g., 1500 kg, 50 kg"
                    className={`py-7 ${
                      errors.capacity && touched.capacity
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.capacity && touched.capacity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.capacity}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Current Mileage (km)</Label>
                  <Field
                    as={Input}
                    type="number"
                    name="currentMileage"
                    placeholder="45000"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Assigned Driver ID</Label>
                  <Field
                    as={Input}
                    name="driverId"
                    placeholder="e.g., STF-001 (optional)"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Registration Date</Label>
                  <Field
                    as={Input}
                    type="date"
                    name="registrationDate"
                    className="py-7"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Insurance Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1">Insurance Number</Label>
                  <Field
                    as={Input}
                    name="insuranceNumber"
                    placeholder="INS-123456"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Insurance Provider</Label>
                  <Field
                    as={Input}
                    name="insuranceProvider"
                    placeholder="e.g., Ethiopian Insurance"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Insurance Expiry Date *</Label>
                  <Field
                    as={Input}
                    type="date"
                    name="insuranceExpiry"
                    className={`py-7 ${
                      errors.insuranceExpiry && touched.insuranceExpiry
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.insuranceExpiry && touched.insuranceExpiry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.insuranceExpiry}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="text-lg font-medium mb-4">Technical Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1">Chassis Number</Label>
                  <Field
                    as={Input}
                    name="chassisNumber"
                    placeholder="Enter chassis number"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Engine Number</Label>
                  <Field
                    as={Input}
                    name="engineNumber"
                    placeholder="Enter engine number"
                    className="py-7"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1">Additional Notes</Label>
                <Field
                  as={Textarea}
                  name="notes"
                  placeholder="Any additional information about the vehicle..."
                  className="py-4 min-h-[100px]"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h2 className="text-lg font-medium mb-4">
                {isEditMode
                  ? "Update Vehicle Information"
                  : "Complete Vehicle Registration"}
              </h2>

              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer !text-black border border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  className={`flex-1 cursor-pointer hover:bg-blue-700 ${
                    status === "submitting"
                      ? "disabled:opacity-70 disabled:cursor-not-allowed"
                      : ""
                  }`}
                >
                  {status === "submitting" ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {isEditMode
                          ? "Updating Vehicle..."
                          : "Registering Vehicle..."}
                      </span>
                    </span>
                  ) : isEditMode ? (
                    "Update Vehicle"
                  ) : (
                    "Register Vehicle"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateVehicle;
