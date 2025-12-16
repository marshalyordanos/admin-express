import type { LoginResponse, RegisterResponse } from "@/types/auth";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = "https://test-courier.servehalflife.com";
// const BASE_URL = "http://localhost:10000";
const BASE_URL = "https://courier-app-production.up.railway.app";

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) throw new Error("Failed to register");
  const data = await response.json();
  if (!data.success) throw new Error(data.message);

  return data;
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  console.log(email, password);
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  if (!response.ok) throw new Error("Failed to login");
  const data = await response.json();
  if (!data.success) throw new Error(data.message);

  return data;
};
