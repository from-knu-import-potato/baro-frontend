import { Outlet } from 'react-router-dom';

import { MOCK_STORE, MOCK_USER } from '@/features/dashboard/data/dashboard.mock';
import { SidebarInset, SidebarProvider } from '@/shadcn/ui/sidebar';
import AppHeader from '@/widgets/AppHeader';
import AppSidebar from '@/widgets/AppSidebar';

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar storeName={MOCK_STORE.name} storeCategory={MOCK_STORE.category} />
      <SidebarInset>
        <AppHeader userName={MOCK_USER.name} userRole={MOCK_USER.role} />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
