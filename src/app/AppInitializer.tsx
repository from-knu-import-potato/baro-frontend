import { useEffect, useState } from 'react';

import useAuthStore from '@/features/auth/store/authStore';
import { fetchBusinessOpenStatus } from '@/features/closing/api/closing.api';
import useClosingStore from '@/features/closing/store/closingStore';
import { fetchStoreSettings } from '@/features/store-settings/api/storeSettings.api';
import axiosInstance from '@/shared/api/axiosInstance';

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setStoreId = useAuthStore((s) => s.setStoreId);
  const setOperatingHours = useAuthStore((s) => s.setOperatingHours);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setBusinessSession = useClosingStore((s) => s.setBusinessSession);

  useEffect(() => {
    const { refreshToken } = useAuthStore.getState();

    const tokenInit = refreshToken
      ? axiosInstance
          .post('/auth/refresh', { refreshToken })
          .then((res) => setAccessToken(res.data.data.accessToken))
          .catch(() => clearAuth())
      : Promise.resolve();

    const init = tokenInit.then(async () => {
      const { accessToken, storeId } = useAuthStore.getState();
      if (!accessToken) return;

      let resolvedStoreId = storeId;

      if (!resolvedStoreId) {
        const res = await axiosInstance.get('/users/me/stores').catch(() => null);
        const stores: { storeId: string }[] = res?.data?.data ?? [];
        resolvedStoreId = stores[0]?.storeId ?? null;
        if (resolvedStoreId) setStoreId(resolvedStoreId);
      }

      if (!resolvedStoreId) return;

      // 가게 영업 시간 + 개점 상태 병렬 fetch
      await Promise.all([
        fetchStoreSettings(resolvedStoreId)
          .then((settings) => setOperatingHours(settings.operatingHours))
          .catch(() => {}),

        fetchBusinessOpenStatus(resolvedStoreId)
          .then((status) =>
            setBusinessSession({
              isOpen: status.isOpen,
              businessDate: status.businessDate,
            }),
          )
          .catch(() => {}),
      ]);
    });

    init.finally(() => setReady(true));
  }, [setAccessToken, setStoreId, setOperatingHours, clearAuth, setBusinessSession]);

  if (!ready) return null;

  return <>{children}</>;
};

export default AppInitializer;
