import { LayoutDashboard, Package, Truck, Store, Settings, Home, Globe, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { useClosingStatus } from '@/features/closing/hooks/useClosingStatus';
import useClosingStore from '@/features/closing/store/closingStore';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/shadcn/ui/sidebar';
import { Skeleton } from '@/shadcn/ui/skeleton';
import BaroLogo from '@/shared/assets/images/baro-logo.png';

const BOTTOM_NAV_ITEMS = [
  { label: '회원 설정', icon: Settings, to: routePaths.settings },
  { label: '계정 홈', icon: User, to: routePaths.myStores },
  { label: '가게 홈', icon: Home, to: routePaths.storeHome },
  { label: '서비스 소개', icon: Globe, to: routePaths.landing },
];

const BUSINESS_TYPE_LABEL: Record<string, string> = {
  franchise: '프랜차이즈',
  'directly-operated': '직영',
  individual: '개인',
};

interface AppSidebarProps {
  storeName: string;
  storeCategory: string;
  businessType?: string;
  isLoading?: boolean;
}

const AppSidebar = ({
  storeName,
  storeCategory,
  businessType,
  isLoading = false,
}: AppSidebarProps) => {
  const location = useLocation();
  const storeId = useAuthStore((s) => s.storeId);
  const { isCompleted } = useClosingStatus(storeId);
  const { isOpen: isBusinessOpen } = useClosingStore((s) => s.businessSession);

  // 영업 중이 아니거나 오늘 마감이 완료된 경우 대시보드 비활성화
  const isDashboardDisabled = !isBusinessOpen || isCompleted;

  return (
    <Sidebar collapsible="icon">
      {/* 로고 + 토글 */}
      <SidebarHeader className="flex flex-row items-center justify-between px-3 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <img src={BaroLogo} className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight">
            BA<span className="text-[#449CD4]">RO</span>
          </span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      {/* 메인 네비게이션 */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {/* 대시보드 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === routePaths.dashboard}
                  tooltip={
                    !isBusinessOpen
                      ? '영업을 시작하면 접근할 수 있습니다'
                      : isCompleted
                        ? '오늘 마감이 완료되었습니다'
                        : '대시보드'
                  }
                  disabled={isDashboardDisabled}
                  render={isDashboardDisabled ? undefined : <NavLink to={routePaths.dashboard} />}
                  className={isDashboardDisabled ? 'opacity-40 cursor-not-allowed' : undefined}
                >
                  <LayoutDashboard />
                  <span>대시보드</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 전체 재고 현황 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === routePaths.inventory}
                  tooltip="전체 재고 현황"
                  render={<NavLink to={routePaths.inventory} />}
                >
                  <Package />
                  <span>전체 재고 현황</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 발주 가이드 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === routePaths.orderGuide}
                  tooltip="발주 가이드"
                  render={<NavLink to={routePaths.orderGuide} />}
                >
                  <Truck />
                  <span>발주 가이드</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 가게 설정 */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.startsWith(routePaths.storeSettings)}
                  tooltip="가게 설정"
                  render={<NavLink to={routePaths.storeSettings} />}
                >
                  <Store />
                  <span>가게 설정</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 하단 */}
      <SidebarFooter className="pb-2">
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          {BOTTOM_NAV_ITEMS.map(({ label, icon: Icon, to }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton
                isActive={location.pathname === to}
                tooltip={label}
                render={<NavLink to={to} />}
              >
                <Icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarSeparator className="mx-0" />

        {/* 가게 정보 */}
        {isLoading ? (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex flex-col gap-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>
        ) : (
          <SidebarMenuButton size="lg" tooltip={storeName}>
            <div className="w-8 h-8 rounded-full bg-[#449CD4] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{storeName.charAt(0)}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground truncate">
                {[storeCategory, businessType ? BUSINESS_TYPE_LABEL[businessType] : undefined]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
              <span className="text-sm font-semibold text-foreground truncate">{storeName}</span>
            </div>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
