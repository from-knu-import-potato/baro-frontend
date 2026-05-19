import AccountSection from '@/features/account/components/sections/AccountSection';
import AppInfoSection from '@/features/account/components/sections/AppInfoSection';
// import NotificationSection from '@/features/account/components/sections/NotificationSection';
import ThemeSection from '@/features/account/components/sections/ThemeSection';

const AccountSettingsContent = () => {
  return (
    <div className="space-y-5 p-6">
      <div>
        <p className="text-sm font-semibold leading-tight">회원 설정</p>
        <p className="text-xs text-muted-foreground">계정 정보와 앱 환경을 확인 및 설정합니다.</p>
      </div>
      <AccountSection />
      {/* <NotificationSection /> */}
      <ThemeSection />
      <AppInfoSection />
    </div>
  );
};

export default AccountSettingsContent;
