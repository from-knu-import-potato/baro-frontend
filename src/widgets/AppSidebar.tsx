import { LayoutDashboard, Package, Truck, Store, Settings, Home } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
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
import BaroLogo from '@/shared/assets/images/baro-logo.png';

const BOTTOM_NAV_ITEMS = [
  { label: '회원 설정', icon: Settings, to: routePaths.settings },
  // { label: '지원', icon: HelpCircle, to: routePaths.support },
  { label: '랜딩 페이지', icon: Home, to: routePaths.landing },
];

interface AppSidebarProps {
  storeName: string;
  storeCategory: string;
}

const AppSidebar = ({ storeName, storeCategory }: AppSidebarProps) => {
  const location = useLocation();

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
                  tooltip="대시보드"
                  render={<NavLink to={routePaths.dashboard} />}
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
        <SidebarMenuButton size="lg" tooltip={storeName}>
          <div className="w-8 h-8 rounded-full bg-[#449CD4] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{storeName.charAt(0)}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-muted-foreground truncate">{storeCategory}</span>
            <span className="text-sm font-semibold text-foreground truncate">{storeName}</span>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
