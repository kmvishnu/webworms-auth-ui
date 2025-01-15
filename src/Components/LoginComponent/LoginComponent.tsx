import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InputField from '../Common/InputField';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: LoginFormInputs) => {
    console.log('Logging in with:', data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="Email Address *"
            register={register('email')}
            error={errors.email}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Password *"
            register={register('password')}
            error={errors.password}
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-center flex justify-between">
          <p className="text-sm text-gray-600">
            <span className='sm:block hidden'>Don't have an account?{' '}</span>
            <a href="#" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
          <p className="text-sm text-gray-600">

            <a href="#" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </p>
         
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>

          <a href="https://kmvishnu.netlify.app" className="text-grey-600 hover:underline">
          © Webworms
            </a>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
