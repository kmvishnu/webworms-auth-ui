import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { AxiosError } from "axios";

interface LoginCredentials {
  email: string;
  password: string;
  client_id: string;
  redirect_uri: string;
}

interface LoginErrorResponse {
  message: string;
}

export const useLogin = () => {
  return useMutation<void, AxiosError<LoginErrorResponse>, LoginCredentials>({
    mutationFn: async (data) => {
      try {
        await login(data);
      } catch (error: any) {
        if (error.response && error.response.status === 302) {
          const redirectUrl = error.response.headers.location;
          console.log("Redirect detected, navigating to:", redirectUrl);
          window.location.href = redirectUrl; // Full page navigation
          return; // Prevent further execution
        }
        throw error; // Re-throw other errors
      }
    },
    onSuccess: () => {
      console.log("Login request sent; redirect should occur...");
    },
    onError: (error) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};
