import { useEffect, useRef } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { useUserInfo } from '@/features/account-settings/hooks/useUserInfo';
import useAuthStore from '@/features/auth/store/authStore';
import { useClosingHistory } from '@/features/closing/hooks/useClosingHistory';
import useClosingStore from '@/features/closing/store/closingStore';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { useStoreSettings } from '@/features/store-settings/hooks/useStoreSettings';
import { SidebarInset, SidebarProvider } from '@/shadcn/ui/sidebar';
import AppHeader from '@/widgets/AppHeader';
import AppSidebar from '@/widgets/AppSidebar';

const ROLE_LABEL: Record<string, string> = {
  owner: '사장',
  staff: '직원',
};

const STORE_SETTINGS_PATH = routePaths.storeSettings;
const STORE_SETTINGS_SUB_PATHS = [
  routePaths.storeSettingsMenus,
  routePaths.storeSettingsMenuBoard,
  routePaths.storeSettingsTable,
  routePaths.storeSettingsRecipes,
  routePaths.storeSettingsIngredients,
];
const SCROLL_STORAGE_KEY = 'baro-store-settings-scroll';

const isStoreSettingsSubPath = (path: string) =>
  STORE_SETTINGS_SUB_PATHS.some((p) => path.startsWith(p));

// 모듈 레벨: React 생명주기와 무관하게 스크롤 위치를 동기적으로 보존
let settingsScrollTop = 0;

const AppLayout = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const prevPathnameRef = useRef<string>(pathname);
  const navigate = useNavigate();

  const { isOpen } = useClosingStore((s) => s.businessSession);

  // 대시보드만 영업 세션 필수 — 재고·발주·설정 등은 세션 없이 접근 가능
  useEffect(() => {
    if (!isOpen && pathname === routePaths.dashboard) {
      navigate('/store-home', { replace: true });
    }
  }, [isOpen, pathname, navigate]);

  const storeId = useAuthStore((s) => s.storeId);
  const { data: storeData, isLoading: isStoreLoading } = useStoreSettings();
  const { data: userData, isLoading: isUserLoading } = useUserInfo();
  const { data: dashboardStats } = useDashboardStats(isOpen ? storeId : null);
  const { data: closingHistory } = useClosingHistory(isOpen ? storeId : null);

  // 가게 설정 페이지에 있는 동안 스크롤 위치를 동기적으로 추적
  useEffect(() => {
    if (pathname !== STORE_SETTINGS_PATH) return;
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      settingsScrollTop = el.scrollTop;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    const comingBackToSettings = pathname === STORE_SETTINGS_PATH && isStoreSettingsSubPath(prev);
    const goingToSubPage = prev === STORE_SETTINGS_PATH && isStoreSettingsSubPath(pathname);
    const movingBetweenSubPages = isStoreSettingsSubPath(prev) && isStoreSettingsSubPath(pathname);

    if (goingToSubPage) {
      // 가게 설정 → 하위 페이지: 리스너로 수집한 위치 저장 후 최상단 이동
      sessionStorage.setItem(SCROLL_STORAGE_KEY, String(settingsScrollTop));
      scrollRef.current?.scrollTo(0, 0);
    } else if (comingBackToSettings) {
      // 하위 페이지 → 가게 설정: 복원할 위치를 미리 동기적으로 반영 후 레이아웃 완료 시 스크롤
      const saved = Number(sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? 0);
      settingsScrollTop = saved;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: saved, behavior: 'instant' });
      });
    } else if (movingBetweenSubPages) {
      // 하위 페이지 간 이동: 저장된 위치는 유지하고 최상단으로만 이동
      scrollRef.current?.scrollTo(0, 0);
    } else {
      // 설정 영역을 완전히 벗어남: 저장 위치 제거 후 최상단 이동
      sessionStorage.removeItem(SCROLL_STORAGE_KEY);
      settingsScrollTop = 0;
      scrollRef.current?.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <SidebarProvider defaultOpen={false} className="h-svh overflow-hidden">
      <AppSidebar
        storeName={storeData?.storeName ?? ''}
        storeCategory={storeData?.category ?? ''}
        businessType={storeData?.businessType}
        isLoading={isStoreLoading}
      />
      <SidebarInset className="overflow-hidden">
        <AppHeader
          userName={userData?.name ?? ''}
          userRole={ROLE_LABEL[storeData?.myRole ?? ''] ?? ''}
          isLoading={isUserLoading || isStoreLoading}
          onClosingClick={() => navigate('/closing')}
          missedClosing={
            (dashboardStats?.missedClosing ?? false) && (closingHistory?.closings.length ?? 0) > 0
          }
        />
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          <div key={pathname} className="animate-page-fade-in flex-1 flex flex-col min-h-0">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
