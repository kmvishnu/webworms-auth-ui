import axios from "axios";
import { API_URL } from "../../config";

export interface LoginRequest {
  email: string;
  password: string;
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

export interface SendOtpResponse {
  status: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Update your login function to use this instance
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/login", data);
  return response.data;
};

export const sendOtp = async (data: OtpRequest): Promise<SendOtpResponse> => {
  const response = await api.post<SendOtpResponse>("/sendOtp", data);
  return response.data;
};

export const verifyOtp = async (data: RegisterRequest): Promise<SendOtpResponse> => {
  const response = await api.post<SendOtpResponse>("/verifyOtp", data);
  return response.data;
};
