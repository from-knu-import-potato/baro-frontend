import { useEffect, useState } from 'react';

import useAuthStore from '@/features/auth/store/authStore';
import axiosInstance from '@/shared/api/axiosInstance';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const refreshToken = useAuthStore.getState().refreshToken;

    const init = refreshToken
      ? axiosInstance
          .post('/auth/refresh', { refreshToken })
          .then((res) => setAccessToken(res.data.data.accessToken))
          .catch(() => clearAuth())
      : Promise.resolve();

    init.finally(() => setReady(true));
  }, [setAccessToken, clearAuth]);

  if (!ready) return null;

  return <>{children}</>;
};

export default AppInitializer;
