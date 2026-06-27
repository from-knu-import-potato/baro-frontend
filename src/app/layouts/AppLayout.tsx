import { useEffect, useRef, useState } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { useUserInfo } from '@/features/account-settings/hooks/useUserInfo';
import useAuthStore from '@/features/auth/store/authStore';
import { useClosingHistory } from '@/features/closing/hooks/useClosingHistory';
import useClosingStore from '@/features/closing/store/closingStore';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { useOrders } from '@/features/dashboard/hooks/useOrders';
import { useStoreSettings } from '@/features/store-settings/hooks/useStoreSettings';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shadcn/ui/alert-dialog';
import { Button } from '@/shadcn/ui/button';
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

  const [showActiveOrdersWarning, setShowActiveOrdersWarning] = useState(false);

  const storeId = useAuthStore((s) => s.storeId);
  const { data: storeData, isLoading: isStoreLoading } = useStoreSettings();
  const { data: userData, isLoading: isUserLoading } = useUserInfo();
  const { data: dashboardStats } = useDashboardStats(isOpen ? storeId : null);
  const { data: closingHistory } = useClosingHistory(isOpen ? storeId : null);
  const { data: orders = [] } = useOrders(isOpen ? storeId : null);
  const businessDate = useClosingStore((s) => s.businessSession.businessDate);

  const toKSTDate = (isoString: string) =>
    new Date(new Date(isoString).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const todayOrders = businessDate
    ? orders.filter((o) => toKSTDate(o.createdAt) === businessDate)
    : orders;

  const activeOrders = todayOrders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing',
  );

  const handleClosingClick = () => {
    if (activeOrders.length > 0) {
      setShowActiveOrdersWarning(true);
    } else {
      navigate('/closing');
    }
  };

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
      // 하위 페이지 → 가게 설정: 컨텐츠 높이가 충분해질 때까지 rAF retry loop로 복원
      const saved = Number(sessionStorage.getItem(SCROLL_STORAGE_KEY) ?? 0);
      settingsScrollTop = saved;
      if (saved === 0) return;
      const el = scrollRef.current;
      if (!el) return;
      const deadline = performance.now() + 1000;
      const tryRestore = () => {
        el.scrollTo({ top: saved, behavior: 'instant' });
        if (el.scrollTop < saved - 1 && performance.now() < deadline) {
          requestAnimationFrame(tryRestore);
        }
      };
      requestAnimationFrame(tryRestore);
    } else if (movingBetweenSubPages) {
      // 하위 페이지 간 이동: 저장된 위치는 유지하고 최상단으로만 이동
      scrollRef.current?.scrollTo(0, 0);
    } else if (prev !== pathname) {
      // 설정 영역을 완전히 벗어남: 저장 위치 제거 후 최상단 이동
      // prev === pathname인 경우(초기 마운트 or StrictMode 이중 실행)는 무시해서
      // StrictMode 2번째 실행이 sessionStorage를 지우는 버그 방지
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
          onClosingClick={handleClosingClick}
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
      <AlertDialog open={showActiveOrdersWarning} onOpenChange={setShowActiveOrdersWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>아직 완료되지 않은 주문이 있어요</AlertDialogTitle>
            <AlertDialogDescription>
              {activeOrders.filter((o) => o.status === 'pending').length > 0 && (
                <>
                  신규 주문{' '}
                  <strong>{activeOrders.filter((o) => o.status === 'pending').length}건</strong>
                  {activeOrders.filter((o) => o.status === 'preparing').length > 0 && ', '}
                </>
              )}
              {activeOrders.filter((o) => o.status === 'preparing').length > 0 && (
                <>
                  준비 중{' '}
                  <strong>{activeOrders.filter((o) => o.status === 'preparing').length}건</strong>
                </>
              )}
              이 남아있어요. 마감 전에 주문을 모두 처리해 주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowActiveOrdersWarning(false)}>
              돌아가기
            </Button>
            <Button
              className="bg-baro-blue text-white hover:bg-baro-blue/80"
              onClick={() => {
                setShowActiveOrdersWarning(false);
                navigate('/closing');
              }}
            >
              그래도 마감하기
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default AppLayout;
