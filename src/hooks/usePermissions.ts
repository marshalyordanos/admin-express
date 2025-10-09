import { useAuthState } from "./useAuthState";
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  getRolePermissions,
} from "@/config/rolePermissions";

export const usePermissions = () => {
  const { role } = useAuthState();
  const roleName = role?.name;

  return {
    hasPermission: (permission: Permission) =>
      hasPermission(roleName, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(roleName, permissions),
    permissions: getRolePermissions(roleName),
    canAccessDashboard: hasPermission(roleName, Permission.DASHBOARD),
    canAccessOrders: hasPermission(roleName, Permission.ORDERS),
    canAccessFleet: hasPermission(roleName, Permission.FLEET),
    canAccessStaff: hasPermission(roleName, Permission.STAFF),
    canAccessBranch: hasPermission(roleName, Permission.BRANCH),
    canAccessCustomer: hasPermission(roleName, Permission.CUSTOMER),
    canAccessDispatch: hasPermission(roleName, Permission.DISPATCH),
    canAccessPricing: hasPermission(roleName, Permission.PRICING),
  };
};
