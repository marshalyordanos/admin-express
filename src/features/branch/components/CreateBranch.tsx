import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Button from "../../../components/common/Button";
import MapAddressSelector from "@/components/common/MapAddressSelector";
import api from "../../../api/api";
import { CreateBranchSchema } from "../schemas/CreateBranchSchema";
import { IoArrowBack } from "react-icons/io5";
import { BsBuildingFillAdd } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CreateBranch = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    location: "",
    address: "",
    latitude: 0,
    longitude: 0,
    phone: "",
    email: "",
    description: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setStatus("submitting");
      setMessage(null);

      // Send only { name, location }
      const response = await api.post("/branch", {
        name: values.name,
        location: values.location,
      });
      const { success, message: responseMessage } = response.data;

      if (success) {
        setStatus("success");
        setMessage(responseMessage || "Branch created successfully!");
        resetForm();
        setTimeout(() => {
          navigate("/branch");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(responseMessage || "Failed to create branch");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error("Add branch error:", error);
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={CreateBranchSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
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
                  <BsBuildingFillAdd className="text-3xl text-blue-500" />
                  <h1 className="text-3xl font-medium text-gray-700">
                    Create New Branch
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
              {/* Branch Info */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Branch Information</h2>
                <div>
                  <Label className="mb-1">Branch Name *</Label>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Enter branch name"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">City/Location *</Label>
                  <Field
                    as={Input}
                    name="location"
                    placeholder="e.g., Addis Ababa, Dire Dawa"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Phone Number</Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="phone"
                    placeholder="+251 911 234 567"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Email Address</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="branch@company.com"
                    className="py-7"
                  />
                </div>
              </div>

              {/* Address & Map */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Physical Address</h2>
                <div>
                  <Label className="mb-1">Branch Address</Label>
                  <MapAddressSelector
                    onAddressSelect={(addressData) => {
                      setFieldValue("address", addressData.address);
                      setFieldValue("latitude", addressData.latitude);
                      setFieldValue("longitude", addressData.longitude);
                    }}
                    initialAddress={values.address}
                    initialLat={values.latitude}
                    initialLng={values.longitude}
                    height="300px"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h2 className="text-lg font-medium mb-4">Additional Details</h2>
              <div>
                <Label className="mb-1">Branch Description</Label>
                <Field
                  as={Textarea}
                  name="description"
                  placeholder="Brief description about this branch, services offered, etc."
                  className="py-4 min-h-[100px]"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">
                Complete Branch Setup
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
                      <span>Creating Branch...</span>
                    </span>
                  ) : (
                    "Create Branch"
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

export default CreateBranch;
