import React from 'react';
import { FieldError } from 'react-hook-form';

interface InputFieldProps {
  id: string;
  label?: string;
  type: string;
  placeholder: string;
  register: any;
  error?: FieldError;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    type,
    placeholder,
    register,
    error,
  }) => {
    return (
      <div>
        {/* <label htmlFor={id} className="block text-gray-700">
          {label}
        </label> */}
        <input
          id={id}
          type={type}
          {...register}
          className={`w-full p-3 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
          }`}
          placeholder={placeholder}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      </div>
    );
  };
  

export default InputField;
