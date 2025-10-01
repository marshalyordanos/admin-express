import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "../../../components/common/Button";
import api from "../../../api/api";
import { CreateStaffSchema } from "../schemas/CreateStaffSchema";
import { IoArrowBack, IoPersonAdd, IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CreateStaff = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    branchId: "",
    phone: "",
    role: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setStatus("submitting");
      setMessage(null);

      const response = await api.post("/staff", values);
      const { success, message: responseMessage } = response.data;

      if (success) {
        setStatus("success");
        setMessage(responseMessage || "Staff created successfully!");
        resetForm();
        setTimeout(() => {
          navigate("/staff");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(responseMessage || "Failed to create staff");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error("Add staff error:", error);
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={CreateStaffSchema}
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
                  <IoPersonAdd className="text-2xl text-blue-500" />
                  <h1 className="text-3xl font-medium text-gray-700">
                    Add New Staff Member
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
              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">
                  Personal Information
                </h2>
                <div>
                  <Label className="mb-1">Full Name *</Label>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Enter staff full name"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Email Address *</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="staff@company.com"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Phone Number *</Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="phone"
                    placeholder="+251 911 234 567"
                    className="py-7"
                  />
                </div>
                <div className="relative">
                  <Label className="mb-1">Password *</Label>
                  <Field
                    as={Input}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="py-7 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-12 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <IoEye className="h-5 w-5" />
                    ) : (
                      <IoEyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Work Information */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Work Information</h2>
                <div>
                  <Label className="mb-1">Role *</Label>
                  <Select
                    value={values.role}
                    onValueChange={(val) => setFieldValue("role", val)}
                  >
                    <SelectTrigger className="py-7 !w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="dispatcher">Dispatcher</SelectItem>
                      <SelectItem value="warehouse">Warehouse Staff</SelectItem>
                      <SelectItem value="customer-service">
                        Customer Service
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1">Branch ID *</Label>
                  <Field
                    as={Input}
                    name="branchId"
                    placeholder="Enter branch ID (e.g., B001)"
                    className="py-7"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">
                Complete Staff Registration
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
                      <span>Creating Staff...</span>
                    </span>
                  ) : (
                    "Create Staff"
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

export default CreateStaff;
