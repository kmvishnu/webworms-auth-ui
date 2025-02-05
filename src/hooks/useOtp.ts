import { useMutation } from "@tanstack/react-query";
import {
  OtpRequest,
  RegisterRequest,
  sendOtp,
  SendOtpResponse,
  verifyOtp,
} from "../api/auth";
import { AxiosError } from "axios";

interface LoginErrorResponse {
  message: string;
}

interface otpErrorResponse {
  status: string;
  message?: string;
  errors?: [
    {
      field: string;
      message: string;
    }
  ];
}

export const useOtp = () => {
  return useMutation<
    SendOtpResponse,
    AxiosError<LoginErrorResponse>,
    OtpRequest
  >({
    mutationFn: sendOtp,
  });
};

export const useVerifyOtp = () => {
  return useMutation<
    SendOtpResponse,
    AxiosError<otpErrorResponse>,
    RegisterRequest
  >({
    mutationFn: verifyOtp,
  });
};
