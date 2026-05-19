import { useState } from 'react';

import { Bell } from 'lucide-react';

import { MOCK_NOTIFICATION_SETTINGS } from '@/features/account/data/account.mock';
import type { NotificationSettings } from '@/features/account/types/account.types';
import { Separator } from '@/shadcn/ui/separator';
import { Switch } from '@/shadcn/ui/switch';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const NotificationSection = () => {
  const [settings, setSettings] = useState<NotificationSettings>(MOCK_NOTIFICATION_SETTINGS);

  const toggleAlert = (key: keyof Omit<NotificationSettings, 'channels'>) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <SettingsSection
      title="알림"
      description="받고 싶은 알림 유형을 설정합니다."
      icon={<Bell className="h-4 w-4" />}
    >
      <SettingRow
        label="재고 부족 알림"
        description="설정한 기준치 이하로 재고가 줄면 알려드립니다."
        action={
          <Switch
            checked={settings.lowStockAlert}
            onCheckedChange={() => toggleAlert('lowStockAlert')}
          />
        }
      />
      <Separator />
      <SettingRow
        label="유통기한 임박 알림"
        description="유통기한 3일 이내 재료가 있을 때 알려드립니다."
        action={
          <Switch
            checked={settings.expiryAlert}
            onCheckedChange={() => toggleAlert('expiryAlert')}
          />
        }
      />
      <Separator />
      <SettingRow
        label="AI 발주 추천 알림"
        description="AI가 발주를 권장할 때 알려드립니다."
        action={
          <Switch
            checked={settings.orderRecommendationAlert}
            onCheckedChange={() => toggleAlert('orderRecommendationAlert')}
          />
        }
      />
      <Separator />
      <SettingRow
        label="가격 변동 알림"
        description="주요 재료 시세가 크게 변동되면 알려드립니다."
        action={
          <Switch
            checked={settings.priceChangeAlert}
            onCheckedChange={() => toggleAlert('priceChangeAlert')}
          />
        }
      />
    </SettingsSection>
  );
};

export default NotificationSection;
