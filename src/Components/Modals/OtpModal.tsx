import React, { useEffect, useState } from "react";
import { useOtp, useVerifyOtp } from "../../hooks/useOtp";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface OtpModalProps {
  email: string;
  name: string;
  password: string;
  onClose: () => void;
}

const OtpModal = ({ email, name, password, onClose }: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const {
    mutate: verifyOtp,
    isPending: isOtpPending,
    error,
    isError,
  } = useVerifyOtp();
  const {
    mutate: sendOtp,
    isPending: isResendOtpPending,
    error: ResendOtpError,
  } = useOtp();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp(
      {
        name,
        email,
        password,
        otp,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => {
            onClose();
            navigate("/");
          }, 2000);
        },
      }
    );
  };

  const getErrorMessage = () => {
    if (!error) return null;

    if (error instanceof AxiosError) {
      const responseData = error.response?.data;
      if (responseData) {
        return responseData.message || "An error occurred";
      }
    }

    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred. Please try again.";
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

  const handleResendOtp = () => {
    if (resendCount >= 2) {
      return; // Maximum attempts reached
    }

    setResendCount((prev) => prev + 1);
    setCountdown(60); // Start 60 seconds countdown
    setIsResendDisabled(true);


    sendOtp(
      { email: email, purpose: "registration" },
      {
        onSuccess: () => {
          // You might want to show a success message
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Enter OTP
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Please enter the OTP sent to {email}
              </p>
              {isError && (
                <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {getErrorMessage()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {showSuccess && (
                <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Registered successfully, Redirecting to the login page
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isError ? "border-red-500" : "border-gray-300"
                } ${isOtpPending ? "bg-gray-50" : "bg-white"}`}
                maxLength={6}
                disabled={isOtpPending || showSuccess}
              />
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
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
