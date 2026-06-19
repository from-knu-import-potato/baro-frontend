import { useState } from 'react';

import { Clock } from 'lucide-react';

import StepOperatingHours from '@/features/initial-setup/components/steps/StepOperatingHours';
import { DAY_OF_WEEK_CONFIG } from '@/features/initial-setup/constants/initialSetup.constants';
import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';
import {
  useStoreSettings,
  useUpdateStoreSettings,
} from '@/features/store-settings/hooks/useStoreSettings';
import { Button } from '@/shadcn/ui/button';
import { Skeleton } from '@/shadcn/ui/skeleton';
import SettingsSection from '@/shared/components/SettingsSection';

const HoursRow = ({ day, hour }: { day: string; hour: OperatingHour | undefined }) => (
  <div className="flex items-center gap-4 py-1">
    <span className="w-16 shrink-0 text-sm text-muted-foreground">{day}</span>
    {hour?.isOpen ? (
      <span className="text-sm font-medium">
        {hour.openTime} ~ {hour.closeTime}
      </span>
    ) : (
      <span className="text-sm text-muted-foreground">휴무</span>
    )}
  </div>
);

const OperatingHoursSection = () => {
  const { data, isLoading } = useStoreSettings();
  const { mutate: updateStore, isPending } = useUpdateStoreSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<OperatingHour[]>([]);

  const handleEdit = () => {
    if (data) {
      const sorted = DAY_OF_WEEK_CONFIG.map(
        (day) =>
          data.operatingHours.find((h) => h.dayOfWeek === day.value) ?? {
            dayOfWeek: day.value,
            isOpen: false,
            openTime: null,
            closeTime: null,
          },
      );
      setForm(sorted);
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    updateStore({ operatingHours: form }, { onSuccess: () => setIsEditing(false) });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const headerAction = isEditing ? (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCancel}>
        취소
      </Button>
      <Button
        size="sm"
        className="bg-baro-blue hover:bg-baro-blue/80"
        onClick={handleSave}
        disabled={isPending}
      >
        저장
      </Button>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={handleEdit}>
      수정
    </Button>
  );

  return (
    <SettingsSection
      title="영업 시간"
      description="영업 요일과 운영 시간을 관리합니다."
      icon={<Clock className="h-4 w-4" />}
      headerAction={headerAction}
    >
      {isLoading || !data ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-44" />
        </div>
      ) : isEditing ? (
        <StepOperatingHours data={form} onChange={setForm} />
      ) : (
        <div className="space-y-1">
          {DAY_OF_WEEK_CONFIG.map((day) => {
            const hour = data.operatingHours.find((h) => h.dayOfWeek === day.value);
            return <HoursRow key={day.value} day={day.label} hour={hour} />;
          })}
        </div>
      )}
    </SettingsSection>
  );
};

export default OperatingHoursSection;
