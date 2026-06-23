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
      const currentPath = window.location.pathname + window.location.search;
      const AUTH_PAGE_PREFIXES = ['/login', '/auth/', '/register'];
      const isAuthPage = AUTH_PAGE_PREFIXES.some((p) => currentPath.startsWith(p));
      if (!isAuthPage && currentPath !== '/') {
        sessionStorage.setItem('baro-redirect-after-login', currentPath);
      }
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
