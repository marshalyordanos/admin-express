export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  roleId: string | null;
  isStaff: boolean;
  isSuperAdmin: boolean;
  role: string | null;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: Tokens;
  };
}

