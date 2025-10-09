import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { Permission, hasPermission } from "@/config/rolePermissions";
import NoPermission from "./NoPermission";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: Permission;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const { role, isAuthenticated } = useAuthState();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required permission
  const hasAccess = hasPermission(role?.name, requiredPermission);

  if (!hasAccess) {
    return <NoPermission />;
  }

  return <>{children}</>;
}
