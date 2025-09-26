import { useState } from "react";
import { useFormik } from "formik";
import { LoginSchema } from "../schemas/LoginSchema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Loading from "../../../components/common/Loading";
import api from "../../../api/api";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [popup, setPopup] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        setStatus("submitting");
        setMessage(null);

        const response = await api.post("/auth/login", values);
        const { success, message, data } = response.data;

        if (success) {
          setStatus("success");
          setPopup("success");
          setMessage(message);

          // Save tokens
          localStorage.setItem("accessToken", data.tokens.accessToken);
          localStorage.setItem("refreshToken", data.tokens.refreshToken);

          // Save user info
          localStorage.setItem("user", JSON.stringify(data.user));

          // Redirect (if needed)
          // navigate("/dashboard");
        } else {
          setStatus("error");
          setPopup("error");
          setMessage(message || "Invalid email or password");
        }
      } catch (error) {
        setStatus("error");
        setPopup("error");
        setMessage("Something went wrong. Please try again.");
        console.error("Login error:", error);
      } finally {
        setTimeout(() => setStatus("idle"), 2500);
      }
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  return (
    <div className="min-h-screen bg-gray flex flex-col p-4 font-text">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-lg bg-lightgray rounded-2xl shadow-xl overflow-hidden z-10">
          <div className="p-8">
            <div className="flex justify-center mt-2 mb-6">
              <h1 className="text-3xl font-bold text-black text-center">
                Welcome Back
              </h1>
            </div>
            {/* Message box */}
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
            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
            >
              {/* Email Input */}
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                label="Email Address"
              />

              {/* Password Input */}
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

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between pt-4 pb-3">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-darkblue border-gray rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-1 block text-sm text-black"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-darkblue">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={status === "submitting"}
                className={`flex justify-center ${
                  status === "submitting"
                    ? "disabled:opacity-70 disabled:cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {status === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <Loading />
                    <span>Logging in...</span>
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
