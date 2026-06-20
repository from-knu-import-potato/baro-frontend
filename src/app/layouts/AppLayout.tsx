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

const AppLayout = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isOpen } = useClosingStore((s) => s.businessSession);

  // 대시보드만 영업 세션 필수 — 재고·발주·설정 등은 세션 없이 접근 가능
  useEffect(() => {
    if (!isOpen && pathname === routePaths.dashboard) {
      navigate('/system-start', { replace: true });
    }
  }, [isOpen, pathname, navigate]);

  const storeId = useAuthStore((s) => s.storeId);
  const { data: storeData, isLoading: isStoreLoading } = useStoreSettings();
  const { data: userData, isLoading: isUserLoading } = useUserInfo();
  const { data: dashboardStats } = useDashboardStats(isOpen ? storeId : null);
  const { data: closingHistory } = useClosingHistory(isOpen ? storeId : null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
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
