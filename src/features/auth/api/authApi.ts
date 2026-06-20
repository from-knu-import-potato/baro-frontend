import type {
  CredentialAuthResponse,
  CredentialLoginRequest,
  RegisterRequest,
} from '@/features/auth/types/auth.api.types';
import axiosInstance from '@/shared/api/axiosInstance';

export const getKakaoLoginUrl = (callbackUrl: string): string => {
  const base = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao`;
  return `${base}?returnUrl=${encodeURIComponent(callbackUrl)}`;
};

export const credentialLogin = (data: CredentialLoginRequest): Promise<CredentialAuthResponse> => {
  return axiosInstance.post('/auth/login', data).then((res) => res.data.data);
};

export const register = (data: RegisterRequest): Promise<CredentialAuthResponse> => {
  return axiosInstance.post('/auth/register', data).then((res) => res.data.data);
};

export const logout = (): Promise<void> => {
  return axiosInstance.post('/auth/logout').then(() => undefined);
};
