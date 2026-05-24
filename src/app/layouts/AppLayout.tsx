import { Outlet } from 'react-router-dom';

import { MOCK_STORE, MOCK_USER } from '@/features/dashboard/data/dashboard.mock';
import { SidebarInset, SidebarProvider } from '@/shadcn/ui/sidebar';
import AppHeader from '@/widgets/AppHeader';
import AppSidebar from '@/widgets/AppSidebar';

const AppLayout = () => {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar storeName={MOCK_STORE.name} storeCategory={MOCK_STORE.category} />
      <SidebarInset className="overflow-hidden">
        <AppHeader userName={MOCK_USER.name} userRole={MOCK_USER.role} />
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
