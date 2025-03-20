import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import InputField from "../Common/InputField";
import { loginUrl } from "../../api/auth";
import { COPYRIGHT, COPYRIGHT_URL } from "../../../config";

interface LoginFormInputs {
  email: string;
  password: string;
  client_id: string;
  redirect_uri: string;
}

interface LoginComponentProps {
  clientId: string;
  redirectUri: string;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  clientId,
  redirectUri,
}) => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    client_id: Yup.string().required("Client ID is required"),
    redirect_uri: Yup.string()
      .matches(
        // Allow localhost with port OR any valid HTTPS/HTTP URL ending with /callback (optional)
        /^(https?:\/\/localhost:\d{4,5}(\/callback)?$|https?:\/\/[\w.-]+(:\d+)?\/?([\w\/]*\/)?callback$)/,
        "Redirect URI must be a valid URL (e.g., http://localhost:3000/callback or https://example.com/callback)"
      )
      .required("Redirect URI is required"),
  });

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    setValue,
    trigger,
    getValues,
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      client_id: clientId,
      redirect_uri: redirectUri.endsWith("/callback")
        ? redirectUri
        : `${redirectUri.replace(/\/$/, "")}/callback`,
    },
  });

  React.useEffect(() => {
    const finalRedirectUri = redirectUri.endsWith("/callback")
      ? redirectUri
      : `${redirectUri.replace(/\/$/, "")}/callback`;
    setValue("client_id", clientId);
    setValue("redirect_uri", finalRedirectUri);
    console.log("LoginComponent - Props:", { clientId, redirectUri });
    console.log("LoginComponent - Set redirect_uri:", finalRedirectUri);
    trigger();
  }, [clientId, redirectUri, setValue, trigger]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formValues = getValues();
    console.log("Form submitting natively - Values:", formValues);
    console.log(
      "Form submitting natively - redirect_uri from input:",
      e.currentTarget.redirect_uri.value
    );
  };

  console.log("Form State:", { errors, isValid, isSubmitting });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Login
        </h2>

        <form
          action={loginUrl}
          method="POST"
          onSubmit={onSubmit}
          className="space-y-4"
          noValidate
        >
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
          <input type="hidden" {...register("client_id")} />
          <input type="hidden" {...register("redirect_uri")} />
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`w-full py-3 font-semibold rounded-md focus:outline-none ${
              isSubmitting || !isValid
                ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4 text-center flex justify-between">
          <p className="text-sm text-gray-600">
            <span className="sm:block hidden">Don't have an account? </span>
            <button
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </button>
          </p>
          <p className="text-sm text-gray-600">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            <a href={COPYRIGHT_URL} className="text-grey-600 hover:underline">
              {COPYRIGHT}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
