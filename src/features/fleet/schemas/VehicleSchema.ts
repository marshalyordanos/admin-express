import * as Yup from "yup";

export const VehicleValidationSchema = Yup.object().shape({
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
