import { useState } from "react";
import { useFormik } from "formik";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";
// import api from "../../../lib/api/api";
import { UpdateBranchSchema } from "../schemas/UpdateBranchSchema";

const UpdateBranch = () => {
  const [status] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [popup] = useState<"idle" | "success" | "error">("idle");
  const [message] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      location: "",
    },
    validationSchema: UpdateBranchSchema,
    onSubmit: async () => {
      // try {
      //   setStatus("submitting");
      //   setMessage(null);
      //   // PATCH request with branchId
      //   // const response = await api.patch(`/branch/${branchId}`, values);
      //   const response = await api.patch(`/branch`, values);
      //   const { success, message } = response.data;
      //   if (success) {
      //     setStatus("success");
      //     setPopup("success");
      //     setMessage(message || "Branch updated successfully!");
      //   } else {
      //     setStatus("error");
      //     setPopup("error");
      //     setMessage(message || "Failed to update branch");
      //   }
      // } catch (error) {
      //   setStatus("error");
      //   setPopup("error");
      //   setMessage("Something went wrong. Please try again.");
      //   console.error("Update branch error:", error);
      // } finally {
      //   setTimeout(() => setStatus("idle"), 2500);
      // }
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  return (
    <div className="py-16 flex items-center justify-center font-text">
      <div className="w-full max-w-lg bg-white border border-gray rounded-lg shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-black text-center mb-6">
            Update Branch
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

          {/* Update Branch Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            autoComplete="off"
          >
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter branch name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              label="Branch Name"
            />

            <Input
              id="location"
              name="location"
              type="text"
              placeholder="Enter branch location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.location}
              touched={touched.location}
              label="Location"
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
                  <span>Updating...</span>
                </span>
              ) : (
                "Update Branch"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBranch;
