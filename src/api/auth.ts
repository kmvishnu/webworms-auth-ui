import axios from "axios";
import { API_URL } from "../../config";

export interface LoginRequest {
  email: string;
  password: string;
  client_id: string;
  redirect_uri: string;
}

export interface OtpRequest {
  email: string;
  purpose: "registration" | "forgotPassword";
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  otp: string;
}

export interface VerifyForgotPasswordOtpRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface SendOtpResponse {
  status: string;
  message: string;
}

const api = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 0, // Prevent Axios from following redirects
  validateStatus: (status) => status >= 200 && status < 400,
});

export const login = async (data: LoginRequest): Promise<any> => {
  return await api.post("/login", data);
};

export const loginUrl = `${API_URL}/login`;

export const sendOtp = async (data: OtpRequest): Promise<SendOtpResponse> => {
  const response = await api.post<SendOtpResponse>("/sendOtp", data);
  return response.data;
};

export const verifyOtp = async (
  data: RegisterRequest
): Promise<SendOtpResponse> => {
  const response = await api.post<SendOtpResponse>("/verifyOtp", data);
  return response.data;
};

export const verifyForgotPasswordOtp = async (
  data: VerifyForgotPasswordOtpRequest
): Promise<SendOtpResponse> => {
  const response = await api.post<SendOtpResponse>(
    "/verifyForgotPasswordOtp",
    data
  );
  return response.data;
};
