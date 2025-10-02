import * as Yup from "yup";

export const CustomerSchema = Yup.object().shape({
  name: Yup.string()
    .required("Customer name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  type: Yup.string().required("Customer type is required"),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  city: Yup.string()
    .required("City is required")
    .min(2, "City must be at least 2 characters"),
  notes: Yup.string().nullable(),
  // Corporate specific fields
  companyName: Yup.string().when("type", {
    is: "Corporate",
    then: (schema) =>
      schema.required("Company name is required for corporate customers"),
    otherwise: (schema) => schema.nullable(),
  }),
  contactPerson: Yup.string().when("type", {
    is: "Corporate",
    then: (schema) =>
      schema.required("Contact person is required for corporate customers"),
    otherwise: (schema) => schema.nullable(),
  }),
  contractNumber: Yup.string().nullable(),
  creditLimit: Yup.string().nullable(),
  paymentTerms: Yup.string().nullable(),
  // Additional fields
  preferredLanguage: Yup.string().required("Preferred language is required"),
  communicationPreference: Yup.string().required(
    "Communication preference is required"
  ),
  marketingOptIn: Yup.boolean().required("Marketing opt-in is required"),
});
