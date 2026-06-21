import { useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { fetchMyStores } from '@/features/store-registration/api/storeRegistration.api';

/* TODO: 백엔드와 협의 후 URL 쿼리로 토큰 전달 방식 개선 필요
   - 현재: accessToken/refreshToken이 URL에 노출 → 브라우저 히스토리, 서버 로그에 잔류
   - 개선: httpOnly 쿠키 전환 시 이 파싱 로직 전체 제거 가능 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setStoreId = useAuthStore((s) => s.setStoreId);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const registered = params.get('registered');

    if (!accessToken || !refreshToken || registered === null) {
      navigate(routePaths.login, { replace: true });
      return;
    }

    setTokens(accessToken, refreshToken);

    fetchMyStores()
      .then((stores) => {
        if (stores.length === 0) {
          navigate(routePaths.storeSelection, { replace: true });
        } else {
          const saved = useAuthStore.getState().storeId;
          const match = stores.find((s) => s.storeId === saved);
          const target = match ?? stores[0];
          setStoreId(target.storeId);
          navigate(routePaths.myStores, { replace: true });
        }
      })
      .catch(() => navigate(routePaths.storeSelection, { replace: true }));
  }, [navigate, setTokens, setStoreId]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-baro-blue border-t-transparent" />
    </div>
  );
};

export default AuthCallbackPage;
