import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputField from "../Common/InputField";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { COPYRIGHT, COPYRIGHT_URL } from "../../../config";
import { useOtp } from "../../hooks/useOtp";
import { registerUser } from "../../redux/userSlice";
import OtpModal from "../Modals/OtpModal";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOtpModal, setShowOtpModal] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { mutate: sendOtp, isPending, error } = useOtp();

  const onSubmit = (data: RegisterFormInputs) => {
    dispatch(registerUser(data));
    sendOtp(
      { email: data.email, purpose: "registration" },
      {
        onSuccess: () => {
          setShowOtpModal(true);
        }
      }
    );
  };


  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            id="name"
            label="Name"
            type="name"
            placeholder="Name *"
            register={register("name")}
            error={errors.name}
          />

          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Email Address *"
            register={register("email")}
            error={errors.email}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Password *"
            register={register("password")}
            error={errors.password}
          />
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 font-semibold rounded-md focus:outline-none ${
              isPending
                ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            }`}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center my-4">
            {error.response?.data?.message ||
              error.message ||
              "An error occurred during sign up"}
          </p>
        )}

        <div className="mt-4 text-center flex justify-between">
          <p className="text-sm text-gray-600">
            <span>Already have an account? </span>
            <button
              onClick={() => navigate("/")}
              className="text-blue-500 hover:underline"
            >
              Log In
            </button>
          </p>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            <a
              href={`${COPYRIGHT_URL}`}
              className="text-grey-600 hover:underline"
            >
              {`${COPYRIGHT}`}
            </a>
          </p>
        </div>
      </div>

      {showOtpModal && (
        <OtpModal
          email={watch('email')}
          name={watch('name')}
          password={watch('password')}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </div>
  );
};

export default RegisterComponent;