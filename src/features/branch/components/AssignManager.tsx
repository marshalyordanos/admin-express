import { useState } from "react";
import { useFormik } from "formik";
import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";
import api from "../../../api/api";
import { AssignManagerSchema } from "../schemas/AssignManagerSchema";

// Demo data - replace with actual API calls
const demoManagers = [
  { id: "M001", name: "John Smith", email: "john.smith@company.com" },
  { id: "M002", name: "Sarah Johnson", email: "sarah.j@company.com" },
  { id: "M003", name: "Mike Williams", email: "mike.w@company.com" },
  { id: "M004", name: "Emily Davis", email: "emily.d@company.com" },
  { id: "M005", name: "Robert Brown", email: "robert.b@company.com" },
];

const demoBranches = [
  { id: "B001", name: "Downtown Branch", location: "123 Main St" },
  { id: "B002", name: "Uptown Branch", location: "456 Oak Ave" },
  { id: "B003", name: "Westside Branch", location: "789 Pine Rd" },
  { id: "B004", name: "Eastside Branch", location: "321 Elm St" },
  { id: "B005", name: "Central Branch", location: "654 Maple Dr" },
];

const AssignManager = () => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [popup, setPopup] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Dropdown states
  const [managers] = useState(demoManagers);
  const [branches] = useState(demoBranches);
  const [managerSearch, setManagerSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  // Filter managers based on search
  const filteredManagers = managers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(managerSearch.toLowerCase()) ||
      manager.id.toLowerCase().includes(managerSearch.toLowerCase()) ||
      manager.email.toLowerCase().includes(managerSearch.toLowerCase())
  );

  // Filter branches based on search
  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
      branch.id.toLowerCase().includes(branchSearch.toLowerCase()) ||
      branch.location.toLowerCase().includes(branchSearch.toLowerCase())
  );

  const formik = useFormik({
    initialValues: {
      managerID: "",
      branchID: "",
      managerName: "", // For display purposes
      branchName: "", // For display purposes
    },
    validationSchema: AssignManagerSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setStatus("submitting");
        setMessage(null);

        // Send only managerID and branchID
        const payload = {
          managerID: values.managerID,
          branchID: values.branchID,
        };

        const response = await api.post("/branch/assign-manager", payload);
        const { success, message } = response.data;

        if (success) {
          setStatus("success");
          setPopup("success");
          setMessage(message || "Manager assigned successfully!");
          resetForm();
          setManagerSearch("");
          setBranchSearch("");
        } else {
          setStatus("error");
          setPopup("error");
          setMessage(message || "Failed to assign manager");
        }
      } catch (error) {
        setStatus("error");
        setPopup("error");
        setMessage("Something went wrong. Please try again.");
        console.error("Assign manager error:", error);
      } finally {
        setTimeout(() => setStatus("idle"), 2500);
      }
    },
  });

  const { values, handleSubmit, errors, touched, setFieldValue } = formik;

  // Select manager handler
  const selectManager = (manager: {
    id: string;
    name: string;
    email: string;
  }) => {
    setFieldValue("managerID", manager.id);
    setFieldValue("managerName", manager.name);
    setManagerSearch(`${manager.name} (${manager.id})`);
    setShowManagerDropdown(false);
  };

  // Select branch handler
  const selectBranch = (branch: { id: string; name: string }) => {
    setFieldValue("branchID", branch.id);
    setFieldValue("branchName", branch.name);
    setBranchSearch(`${branch.name} (${branch.id})`);
    setShowBranchDropdown(false);
  };

  // Clear manager selection
  const clearManager = () => {
    setFieldValue("managerID", "");
    setFieldValue("managerName", "");
    setManagerSearch("");
  };

  // Clear branch selection
  const clearBranch = () => {
    setFieldValue("branchID", "");
    setFieldValue("branchName", "");
    setBranchSearch("");
  };

  return (
    <div className="py-16 flex items-center justify-center font-text">
      <div className="w-full max-w-4xl bg-white border border-gray rounded-lg shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-black text-center mb-6">
            Assign Manager
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

          {/* Assign Manager Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Manager Selection */}
              <div className="relative">
                <label
                  htmlFor="managerSearch"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Manager *
                </label>
                <div className="relative">
                  <input
                    id="managerSearch"
                    type="text"
                    placeholder="Search managers by name, ID, or email..."
                    value={managerSearch}
                    onChange={(e) => {
                      setManagerSearch(e.target.value);
                      setShowManagerDropdown(true);
                      if (!e.target.value) {
                        clearManager();
                      }
                    }}
                    onFocus={() => setShowManagerDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowManagerDropdown(false), 200)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {values.managerID && (
                    <button
                      type="button"
                      onClick={clearManager}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {showManagerDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredManagers.length > 0 ? (
                      filteredManagers.map((manager) => (
                        <div
                          key={manager.id}
                          onClick={() => selectManager(manager)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">
                            {manager.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            ID: {manager.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {manager.email}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No managers found
                      </div>
                    )}
                  </div>
                )}
                {errors.managerID && touched.managerID && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.managerID}
                  </div>
                )}
              </div>

              {/* Branch Selection */}
              <div className="relative">
                <label
                  htmlFor="branchSearch"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Branch *
                </label>
                <div className="relative">
                  <input
                    id="branchSearch"
                    type="text"
                    placeholder="Search branches by name, ID, or location..."
                    value={branchSearch}
                    onChange={(e) => {
                      setBranchSearch(e.target.value);
                      setShowBranchDropdown(true);
                      if (!e.target.value) {
                        clearBranch();
                      }
                    }}
                    onFocus={() => setShowBranchDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowBranchDropdown(false), 200)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {values.branchID && (
                    <button
                      type="button"
                      onClick={clearBranch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {showBranchDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredBranches.length > 0 ? (
                      filteredBranches.map((branch) => (
                        <div
                          key={branch.id}
                          onClick={() => selectBranch(branch)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">
                            {branch.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            ID: {branch.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {branch.location}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No branches found
                      </div>
                    )}
                  </div>
                )}
                {errors.branchID && touched.branchID && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.branchID}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Info */}
            {(values.managerName || values.branchName) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Assignment Summary:
                </h3>
                {values.managerName && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Manager:</span>{" "}
                    {values.managerName} ({values.managerID})
                  </p>
                )}
                {values.branchName && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Branch:</span>{" "}
                    {values.branchName} ({values.branchID})
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={
                status === "submitting" || !values.managerID || !values.branchID
              }
              className={`flex justify-center w-full ${
                status === "submitting" || !values.managerID || !values.branchID
                  ? "disabled:opacity-70 disabled:cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <Loading />
                  <span>Assigning...</span>
                </span>
              ) : (
                "Assign Manager"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignManager;
