import * as Yup from "yup";

export const MaintenanceLogSchema = Yup.object().shape({
  vehicleId: Yup.string().required("Vehicle selection is required"),
  // type: Yup.string().required("Maintenance type is required"),
  // service: Yup.string()
  //   .required("Service description is required")
  //   .min(5, "Service description must be at least 5 characters"),
  // date: Yup.string().required("Service date is required"),
  cost: Yup.number()
    .required("Cost is required")
    .min(0, "Cost must be a positive number"),
  // mileage: Yup.number()
  //   .required("Mileage is required")
  //   .min(0, "Mileage must be a positive number"),
  // provider: Yup.string()
  //   .required("Service provider is required")
  //   .min(2, "Provider name must be at least 2 characters"),
  // status: Yup.string().required("Status is required"),
  // technician: Yup.string()
  //   .required("Technician name is required")
  //   .min(2, "Technician name must be at least 2 characters"),
  // nextService: Yup.string().nullable(),
  notes: Yup.string().nullable(),
});
