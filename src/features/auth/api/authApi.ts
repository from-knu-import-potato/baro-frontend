import axiosInstance from '@/shared/api/axiosInstance';

export const getKakaoLoginUrl = (callbackUrl: string): string => {
  const base = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao`;
  return `${base}?returnUrl=${encodeURIComponent(callbackUrl)}`;
};

export const logout = (): Promise<void> => {
  return axiosInstance.post('/auth/logout').then(() => undefined);
};
