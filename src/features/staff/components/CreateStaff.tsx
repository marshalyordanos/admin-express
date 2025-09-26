import { useState } from "react";
import { useFormik } from "formik";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";
import api from "../../../api/api";
import { CreateStaffSchema } from "../schemas/CreateStaffSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateStaff = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [popup, setPopup] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      branchId: "",
      phone: "",
    },
    validationSchema: CreateStaffSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setStatus("submitting");
        setMessage(null);

        // Send only { name, location }
        const response = await api.post("/staff", values);
        const { success, message } = response.data;

        if (success) {
          setStatus("success");
          setPopup("success");
          setMessage(message || "Staff created successfully!");
          resetForm();
        } else {
          setStatus("error");
          setPopup("error");
          setMessage(message || "Failed to create staff");
        }
      } catch (error) {
        setStatus("error");
        setPopup("error");
        setMessage("Something went wrong. Please try again.");
        console.error("Add staff error:", error);
      } finally {
        setTimeout(() => setStatus("idle"), 2500);
      }
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  return (
    <div className="py-16 flex items-center justify-center font-text">
      <div className="w-full max-w-lg bg-white border border-gray rounded-lg shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-black text-center mb-6">
            Add New Staff
          </h1>

          {/* Success/Error Message */}
          {message && (
            <div
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
                popup === "success"
                  ? "bg-lightgreen text-green"
                  : "bg-lightred text-red"
              }`}
            >
              {message}
            </div>
          )}

          {/* Add Branch Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            autoComplete="off"
          >
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter staff name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              label="Staff Name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              label="Email"
            />

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                label="Password"
              />
              <button
                type="button"
                className={`${
                  errors.password ? "right-4 top-2" : "right-4 top-7"
                } absolute inset-y-0 text-black cursor-pointer`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <Input
              id="branchId"
              name="email"
              type="text"
              placeholder="Enter branch Id"
              value={values.branchId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.branchId}
              touched={touched.branchId}
              label="Branch ID"
            />

            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter phone no"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              touched={touched.phone}
              label="Phone No"
            />

            <Button
              type="submit"
              disabled={status === "submitting"}
              className={`flex justify-center w-full ${
                status === "submitting"
                  ? "disabled:opacity-70 disabled:cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <Loading />
                  <span>Creating...</span>
                </span>
              ) : (
                "Create Staff"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStaff;
