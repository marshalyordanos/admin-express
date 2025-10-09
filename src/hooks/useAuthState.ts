import { useAppSelector } from "@/store/hooks";

export const useAuthState = () => {
  const auth = useAppSelector((state) => state.auth);

  return {
    user: auth.user,
    role: auth.role,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    isAuthenticated: auth.isAuthenticated,
    roleName: auth.role?.name || null,
    isStaff: auth.user?.isStaff || false,
    isSuperAdmin: auth.user?.isSuperAdmin || false,
  };
};
