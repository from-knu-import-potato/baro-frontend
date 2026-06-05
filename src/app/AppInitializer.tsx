import { useEffect, useState } from 'react';

import useAuthStore from '@/features/auth/store/authStore';
import axiosInstance from '@/shared/api/axiosInstance';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setStoreId = useAuthStore((s) => s.setStoreId);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const { refreshToken } = useAuthStore.getState();

    const tokenInit = refreshToken
      ? axiosInstance
          .post('/auth/refresh', { refreshToken })
          .then((res) => setAccessToken(res.data.data.accessToken))
          .catch(() => clearAuth())
      : Promise.resolve();

    const init = tokenInit.then(() => {
      const { accessToken, storeId } = useAuthStore.getState();
      if (accessToken && !storeId) {
        return axiosInstance
          .get('/users/me/store')
          .then((res) => {
            if (res.data.data?.storeId) {
              setStoreId(res.data.data.storeId);
            }
          })
          .catch(() => {});
      }
    });

    init.finally(() => setReady(true));
  }, [setAccessToken, setStoreId, clearAuth]);

  if (!ready) return null;

  return <>{children}</>;
};

export default AppInitializer;
