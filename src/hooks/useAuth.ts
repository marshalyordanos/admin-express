import { login, register } from "@/lib/api/auth";
import type { LoginResponse, RegisterResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";

export const useLogin = (
  onSuccess?: (data: LoginResponse) => void,
  onError?: (error: Error) => void
) => {
  const { data, isPending, error, mutate } = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return { data, isPending, error, mutate };
};

export const useRegister = () => {
  const { data, isPending, error, mutate } = useMutation<
    RegisterResponse,
    Error,
    { name: string; email: string; password: string }
  >({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => register(name, email, password),
    onSuccess: () => {},
    onError: () => {},
  });
  return { data, isPending, error, mutate };
};
