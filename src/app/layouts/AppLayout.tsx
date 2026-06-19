import { useEffect, useRef } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { useUserInfo } from '@/features/account-settings/hooks/useUserInfo';
import useClosingStore from '@/features/closing/store/closingStore';
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

  const { data: storeData, isLoading: isStoreLoading } = useStoreSettings();
  const { data: userData, isLoading: isUserLoading } = useUserInfo();

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
        />
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
