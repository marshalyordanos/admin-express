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
  role: Role | null;
}


export interface Role{
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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

