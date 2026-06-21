import axios from 'axios';

import useAuthStore from '@/features/auth/store/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_REQUEST_URLS = ['/auth/login', '/auth/register'];

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl: string = error.config?.url ?? '';
    const isRefreshRequest = requestUrl.includes('/auth/refresh');
    const isAuthRequest = AUTH_REQUEST_URLS.some((url) => requestUrl.includes(url));
    if (error.response?.status === 401 && !isRefreshRequest && !isAuthRequest) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
