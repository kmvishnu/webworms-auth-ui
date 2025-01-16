import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { AxiosError } from 'axios';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

// Define the error response type
interface LoginErrorResponse {
    message: string;
}

export const useLogin = () => {
    return useMutation<LoginResponse, AxiosError<LoginErrorResponse>, LoginCredentials>({
        mutationFn: login,
        onSuccess: (data) => {
            console.log('Login successful:', data);
            // Handle success (e.g., save token, redirect user)
            // localStorage.setItem('token', data.token);
        },
        onError: (error) => {
            console.error('Login failed:', error.message);
            // Handle error (e.g., show error message)
        },
    });
};