import { useMutation } from "@tanstack/react-query";
import { authApi, type LoginPayload } from "./api";

export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
  });
