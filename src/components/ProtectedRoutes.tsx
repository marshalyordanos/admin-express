import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoutes() {
  const accessToken = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (accessToken && user && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    } else if (!accessToken && !user) {
      navigate("/", { replace: true });
    }
    setMounted(true);
  }, [navigate, accessToken, user, location.pathname]);

  if (!mounted) return null;

  return <Outlet />;
}
