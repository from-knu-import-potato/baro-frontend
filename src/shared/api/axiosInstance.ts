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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

const redirectToLogin = () => {
  const currentPath = window.location.pathname + window.location.search;
  const AUTH_PAGE_PREFIXES = ['/login', '/auth/', '/register'];
  const isAuthPage = AUTH_PAGE_PREFIXES.some((p) => currentPath.startsWith(p));
  if (!isAuthPage && currentPath !== '/') {
    sessionStorage.setItem('baro-redirect-after-login', currentPath);
  }
  useAuthStore.getState().clearAuth();
  window.location.href = '/login';
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl: string = originalRequest?.url ?? '';
    const isRefreshRequest = requestUrl.includes('/auth/refresh');
    const isAuthRequest = AUTH_REQUEST_URLS.some((url) => requestUrl.includes(url));

    if (error.response?.status === 401 && !isRefreshRequest && !isAuthRequest) {
      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const newAccessToken: string = res.data.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
