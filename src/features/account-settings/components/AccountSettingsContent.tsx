import AccountSection from '@/features/account-settings/components/sections/AccountSection';
import AppInfoSection from '@/features/account-settings/components/sections/AppInfoSection';
import ThemeSection from '@/features/account-settings/components/sections/ThemeSection';

const AccountSettingsContent = () => {
  return (
    <div className="space-y-5 p-6">
      <div>
        <p className="text-sm font-semibold leading-tight">회원 설정</p>
        <p className="text-xs text-muted-foreground">계정 및 앱 환경을 관리합니다.</p>
      </div>
      <AccountSection />
      <ThemeSection />
      <AppInfoSection />
    </div>
  );
};

export default AccountSettingsContent;
