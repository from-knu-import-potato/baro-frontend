import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';

// TODO: 백엔드와 협의 후 httpOnly 쿠키 방식으로 전환 권장
// - 현재: localStorage에 저장 → XSS 취약점 존재 (BARO 구조상 현실적 위험은 낮음)
// - 개선: 백엔드가 Set-Cookie(HttpOnly, Secure, SameSite=Strict)로 토큰 관리
//         프론트 authStore 불필요해지고 axios credentials: 'include' 방식으로 전환

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  storeId: string | null;
  operatingHours: OperatingHour[];
  setAccessToken: (token: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setStoreId: (storeId: string) => void;
  setOperatingHours: (hours: OperatingHour[]) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      storeId: null,
      operatingHours: [],
      setAccessToken: (token) => set({ accessToken: token }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setStoreId: (storeId) => set({ storeId }),
      setOperatingHours: (hours) => set({ operatingHours: hours }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, storeId: null, operatingHours: [] }),
    }),
    { name: 'baro-auth' },
  ),
);

export default useAuthStore;
