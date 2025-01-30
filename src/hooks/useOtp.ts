import { useMutation } from '@tanstack/react-query';
import {  OtpRequest, sendOtp, SendOtpResponse } from '../api/auth';
import { AxiosError } from 'axios';


interface LoginErrorResponse {
    message: string;
}

export const useOtp = () => {
    return useMutation<SendOtpResponse, AxiosError<LoginErrorResponse>, OtpRequest>({
        mutationFn: sendOtp,
       
    });
};