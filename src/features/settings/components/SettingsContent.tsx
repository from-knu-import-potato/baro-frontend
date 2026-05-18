import AccountSection from '@/features/settings/components/sections/AccountSection';
import AppInfoSection from '@/features/settings/components/sections/AppInfoSection';
import DataSection from '@/features/settings/components/sections/DataSection';
import NotificationSection from '@/features/settings/components/sections/NotificationSection';
import StoreInfoSection from '@/features/settings/components/sections/StoreInfoSection';
import StoreOperationSection from '@/features/settings/components/sections/StoreOperationSection';
import ThemeSection from '@/features/settings/components/sections/ThemeSection';

const SettingsContent = () => {
  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center gap-2.5 ">
        <div>
          <p className="text-sm font-semibold leading-tight">설정</p>
          <p className="text-xs text-muted-foreground">가게 및 앱 환경을 관리합니다.</p>
        </div>
      </div>
      <StoreInfoSection />
      <StoreOperationSection />
      <AccountSection />
      <NotificationSection />
      <ThemeSection />
      <DataSection />
      <AppInfoSection />
    </div>
  );
};

export default SettingsContent;
