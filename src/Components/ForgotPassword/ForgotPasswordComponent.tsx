import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useOtp, useVerifyResetPasswordOtp } from "../../hooks/useOtp";

interface EmailFormInputs {
  email: string;
}

interface PasswordFormInputs {
  password: string;
  confirmPassword: string;
}

interface OtpFormInputs {
  otp: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be 6 characters")
      .required("OTP is required"),
  });

  // Stage 1: Send Reset Email
  const {
    mutate: sendResetEmail,
    isPending: isEmailPending,
    error: emailError,
    isError: isEmailError,
  } = useOtp();

  // Email form hook
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormInputs>({
    resolver: yupResolver(emailValidationSchema),
    mode: "onChange",
  });

  // Stage 2: Collect New Password
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormInputs>({
    resolver: yupResolver(passwordValidationSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Stage 3: Verify OTP
  const {
    mutate: verifyOtp,
    isPending: isOtpPending,
    error: otpError,
    isError: isOtpError,
  } = useVerifyResetPasswordOtp();

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormInputs>({
    resolver: yupResolver(otpValidationSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  // Stage 1: Send Reset Email
  const onSendEmail = (data: EmailFormInputs) => {
    const submittedEmail = data.email;
    setEmail(submittedEmail);
    sendResetEmail(
      { email: submittedEmail, purpose: "forgotPassword" },
      {
        onSuccess: () => {
          setStage(2);
        },
      }
    );
  };

  // Stage 2: Collect New Password
  const onNewPassword = (data: PasswordFormInputs) => {
    setPassword(data.password);
    setStage(3);
    setCountdown(60);
  };

  // Stage 3: Verify OTP
  const onVerifyOtp = (data: OtpFormInputs) => {
    verifyOtp(
      { email, otp: data.otp, newPassword: password },
      {
        onSuccess: () => {
          alert("Password changed successfully. Redirecting to login.");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        },
      }
    );
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || "An error occurred";
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  useEffect(() => {
    if (countdown <= 0) {
      setIsResendDisabled(false);
      return;
    }
  
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [countdown]);

  // Add this function to handle resend OTP
  const handleResendOtp = () => {
    if (resendCount >= 2) {
      return; // Maximum attempts reached
    }

    setResendCount((prev) => prev + 1);
    setCountdown(60); // Start 60 seconds countdown
    setIsResendDisabled(true);

    // Call the same API used for sending OTP
    sendResetEmail(
      { email, purpose: "forgotPassword" },
      {
        onSuccess: () => {
          // You might want to show a success message
        },
      }
    );
  };

  const renderStage = () => {
    switch (stage) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit(onSendEmail)} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600">
              Enter your email to reset your password
            </p>

            {isEmailError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {getErrorMessage(emailError)}
              </div>
            )}

            <div>
              <input
                type="email"
                autoComplete="username"
                {...registerEmail("email")}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  emailErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={isEmailPending}
              />
              {emailErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isEmailPending}
                className={`w-full py-2 text-white rounded-md ${
                  isEmailPending || emailErrors.email
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isEmailPending ? "Loading..." : "Reset Password"}
              </button>
            </div>
          </form>
        );

      case 2:
        return (
          <form
            onSubmit={handlePasswordSubmit(onNewPassword)}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Reset Password
            </h2>
            <p className="text-sm text-gray-600">Enter your new password</p>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...registerPassword("password")}
                placeholder="New Password"
                className={`w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 ${
                  passwordErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div className="w-5 h-5 text-gray-500">
                  {showPassword ? (
                    // Eye off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </div>
              </button>
              {passwordErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="off"
                {...registerPassword("confirmPassword")}
                placeholder="Confirm New Password"
                className={`w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 ${
                  passwordErrors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div className="w-5 h-5 text-gray-500">
                  {showConfirmPassword ? (
                    // Eye off icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </div>
              </button>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Continue
            </button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Verify OTP</h2>
            <p className="text-sm text-gray-600">
              Enter the OTP sent to {email}
            </p>

            {isOtpError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                {getErrorMessage(otpError)}
              </div>
            )}

            <div>
              <input
                type="text"
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]*"
                {...registerOtp("otp")}
                placeholder="Enter OTP"
                maxLength={6}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  otpErrors.otp || isOtpError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                disabled={isOtpPending}
              />
              {otpErrors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isOtpPending}
                className={`w-full py-2 text-white rounded-md ${
                  isOtpPending
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isOtpPending ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled || resendCount >= 2}
                className={`text-blue-600 hover:text-blue-800 text-sm font-medium ${
                  isResendDisabled || resendCount >= 2
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {resendCount >= 2
                  ? "Maximum resend attempts reached"
                  : isResendDisabled
                  ? `Resend OTP in ${countdown}s`
                  : "Resend OTP"}
              </button>
              {resendCount > 0 && resendCount < 2 && !isResendDisabled && (
                <p className="text-gray-500 text-xs mt-1">
                  {2 - resendCount} attempt{2 - resendCount !== 1 ? "s" : ""}{" "}
                  remaining
                </p>
              )}
            </div>
          </form>
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-md rounded-lg p-8">{renderStage()}</div>
      </div>
    </div>
  );
};

export default ForgotPassword;
