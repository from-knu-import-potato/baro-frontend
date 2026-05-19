import DataSection from '@/features/settings/components/sections/DataSection';
import StoreInfoSection from '@/features/settings/components/sections/StoreInfoSection';
import StoreOperationSection from '@/features/settings/components/sections/StoreOperationSection';

const SettingsContent = () => {
  return (
    <div className="space-y-5 p-6">
      <div>
        <p className="text-sm font-semibold leading-tight">가게 설정</p>
        <p className="text-xs text-muted-foreground">가게 정보와 운영 정보를 관리합니다.</p>
      </div>
      <StoreInfoSection />
      <StoreOperationSection />
      <DataSection />
    </div>
  );
};

export default SettingsContent;
