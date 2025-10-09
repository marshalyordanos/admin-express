import { store } from "@/store/store";
import { logout as logoutAction } from "@/features/auth/authSlice";

export const logout = () => {
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  // Clear Redux state
  store.dispatch(logoutAction());
};
