import DataSection from '@/features/store-settings/components/sections/DataSection';
import OperatingHoursSection from '@/features/store-settings/components/sections/OperatingHoursSection';
import StoreInfoSection from '@/features/store-settings/components/sections/StoreInfoSection';
import StoreOperationSection from '@/features/store-settings/components/sections/StoreOperationSection';

const StoreSettingsContent = () => {
  return (
    <div className="space-y-5 p-6">
      <div>
        <p className="text-sm font-semibold leading-tight">가게 설정</p>
        <p className="text-xs text-muted-foreground">가게 정보 및 운영 데이터를 관리합니다.</p>
      </div>
      <StoreInfoSection />
      <OperatingHoursSection />
      <StoreOperationSection />
      <DataSection />
    </div>
  );
};

export default StoreSettingsContent;
