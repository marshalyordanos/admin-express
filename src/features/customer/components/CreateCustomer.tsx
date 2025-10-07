import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "../../../components/common/Button";
// import api from "../../../lib/api/api";
import { CustomerSchema } from "../schemas/CustomerSchema";
import { IoArrowBack, IoPersonAdd, IoBusiness } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

const CreateCustomer = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialValues] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    address: "",
    city: "",
    notes: "",
    companyName: "",
    contactPerson: "",
    contractNumber: "",
    creditLimit: "",
    paymentTerms: "",
    preferredLanguage: "",
    communicationPreference: "",
    marketingOptIn: false,
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Fetch customer data if in edit mode
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isEditMode) return;

      setLoading(true);
      // try {
      //   // const response = await api.get(`/customer/${id}`);
      //   // const { success, data } = response.data;

      //   if (success && data) {
      //     setInitialValues({
      //       name: data.name || "",
      //       email: data.email || "",
      //       phone: data.phone || "",
      //       type: data.type || "",
      //       address: data.address || "",
      //       city: data.city || "",
      //       notes: data.notes || "",
      //       companyName: data.companyName || "",
      //       contactPerson: data.contactPerson || "",
      //       contractNumber: data.contractNumber || "",
      //       creditLimit: data.creditLimit?.toString() || "",
      //       paymentTerms: data.paymentTerms || "",
      //       preferredLanguage: data.preferredLanguage || "",
      //       communicationPreference: data.communicationPreference || "",
      //       marketingOptIn: data.marketingOptIn || false,
      //     });
      //   }
      // } catch (error) {
      //   console.error("Error fetching customer data:", error);
      //   setMessage("Failed to load customer data");
      //   setStatus("error");
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchCustomerData();
  }, [id, isEditMode]);

  const handleSubmit = async () =>
    // values: typeof initialValues,
    // { resetForm }: { resetForm: () => void }
    {
      try {
        setStatus("submitting");
        setMessage(null);

        // const endpoint = isEditMode ? `/customer/${id}` : "/customer";
        // const method = isEditMode ? "put" : "post";

        // const payload = {
        //   name: values.name,
        //   email: values.email,
        //   phone: values.phone,
        //   type: values.type,
        //   address: values.address,
        //   city: values.city,
        //   notes: values.notes || null,
        //   companyName: values.type === "Corporate" ? values.companyName : null,
        //   contactPerson:
        //     values.type === "Corporate" ? values.contactPerson : null,
        //   contractNumber: values.contractNumber || null,
        //   creditLimit: values.creditLimit ? parseFloat(values.creditLimit) : null,
        //   paymentTerms: values.paymentTerms || null,
        //   preferredLanguage: values.preferredLanguage,
        //   communicationPreference: values.communicationPreference,
        //   marketingOptIn: values.marketingOptIn,
        // };

        // const response = await api[method](endpoint, payload);
        // const { success, message: responseMessage } = response.data;

        // if (success) {
        //   setStatus("success");
        //   setMessage(
        //     responseMessage ||
        //       (isEditMode
        //         ? "Customer updated successfully!"
        //         : "Customer created successfully!")
        //   );
        //   if (!isEditMode) {
        //     resetForm();
        //   }
        //   setTimeout(() => {
        //     navigate("/customer");
        //   }, 2000);
        // } else {
        //   setStatus("error");
        //   setMessage(
        //     responseMessage ||
        //       (isEditMode
        //         ? "Failed to update customer"
        //         : "Failed to create customer")
        //   );
        // }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        console.error(
          isEditMode ? "Update customer error:" : "Add customer error:",
          error
        );
      } finally {
        setTimeout(() => setStatus("idle"), 2500);
      }
    };

  if (loading) {
    return (
      <div className="max-w-4xl p-6 bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading customer data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={CustomerSchema}
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
                  {values.type === "Corporate" ? (
                    <IoBusiness className="text-3xl text-purple-500" />
                  ) : (
                    <IoPersonAdd className="text-3xl text-blue-500" />
                  )}
                  <h1 className="text-3xl font-medium text-gray-700">
                    {isEditMode ? "Edit Customer" : "Add New Customer"}
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
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                <div>
                  <Label className="mb-1">Customer Type *</Label>
                  <Select
                    value={values.type}
                    onValueChange={(val) => setFieldValue("type", val)}
                  >
                    <SelectTrigger
                      className={`py-7 !w-full ${
                        errors.type && touched.type ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select customer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && touched.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Full Name *</Label>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Enter customer full name"
                    className={`py-7 ${
                      errors.name && touched.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Email Address *</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="customer@email.com"
                    className={`py-7 ${
                      errors.email && touched.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Phone Number *</Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="phone"
                    placeholder="+251 911 234 567"
                    className={`py-7 ${
                      errors.phone && touched.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Address & Location */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Address & Location</h2>
                <div>
                  <Label className="mb-1">Address *</Label>
                  <Field
                    as={Input}
                    name="address"
                    placeholder="Enter full address"
                    className={`py-7 ${
                      errors.address && touched.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.address && touched.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">City *</Label>
                  <Field
                    as={Input}
                    name="city"
                    placeholder="e.g., Addis Ababa, Dire Dawa"
                    className={`py-7 ${
                      errors.city && touched.city ? "border-red-500" : ""
                    }`}
                  />
                  {errors.city && touched.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Preferred Language *</Label>
                  <Select
                    value={values.preferredLanguage}
                    onValueChange={(val) =>
                      setFieldValue("preferredLanguage", val)
                    }
                  >
                    <SelectTrigger
                      className={`py-7 !w-full ${
                        errors.preferredLanguage && touched.preferredLanguage
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Amharic">Amharic</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Oromo">Oromo</SelectItem>
                      <SelectItem value="Tigrinya">Tigrinya</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferredLanguage && touched.preferredLanguage && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.preferredLanguage}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Communication Preference *</Label>
                  <Select
                    value={values.communicationPreference}
                    onValueChange={(val) =>
                      setFieldValue("communicationPreference", val)
                    }
                  >
                    <SelectTrigger
                      className={`py-7 !w-full ${
                        errors.communicationPreference &&
                        touched.communicationPreference
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.communicationPreference &&
                    touched.communicationPreference && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.communicationPreference}
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Corporate Information - Only show for Corporate type */}
            {values.type === "Corporate" && (
              <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
                <h2 className="text-lg font-medium mb-4">
                  Corporate Information
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1">Company Name *</Label>
                    <Field
                      as={Input}
                      name="companyName"
                      placeholder="Enter company name"
                      className={`py-7 ${
                        errors.companyName && touched.companyName
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {errors.companyName && touched.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-1">Contact Person *</Label>
                    <Field
                      as={Input}
                      name="contactPerson"
                      placeholder="Enter contact person name"
                      className={`py-7 ${
                        errors.contactPerson && touched.contactPerson
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {errors.contactPerson && touched.contactPerson && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-1">Contract Number</Label>
                    <Field
                      as={Input}
                      name="contractNumber"
                      placeholder="Enter contract number"
                      className="py-7"
                    />
                  </div>
                  <div>
                    <Label className="mb-1">Credit Limit (ETB)</Label>
                    <Field
                      as={Input}
                      type="number"
                      name="creditLimit"
                      placeholder="0"
                      className="py-7"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Label className="mb-1">Payment Terms</Label>
                    <Field
                      as={Input}
                      name="paymentTerms"
                      placeholder="e.g., Net 30, Net 60"
                      className="py-7"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4 mb-6">
              <h2 className="text-lg font-medium mb-4">
                Additional Information
              </h2>
              <div>
                <Label className="mb-1">Notes</Label>
                <Field
                  as={Textarea}
                  name="notes"
                  placeholder="Additional notes about this customer..."
                  className="py-4 min-h-[100px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Field
                  as={Checkbox}
                  name="marketingOptIn"
                  id="marketingOptIn"
                />
                <Label htmlFor="marketingOptIn" className="text-sm">
                  Customer has opted in for marketing communications
                </Label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">
                {isEditMode
                  ? "Update Customer Information"
                  : "Complete Customer Registration"}
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
                          ? "Updating Customer..."
                          : "Creating Customer..."}
                      </span>
                    </span>
                  ) : isEditMode ? (
                    "Update Customer"
                  ) : (
                    "Create Customer"
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

export default CreateCustomer;
