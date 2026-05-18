import { useState } from 'react';

import { Bell } from 'lucide-react';

import SettingRow from '@/features/settings/components/SettingRow';
import SettingsSection from '@/features/settings/components/SettingsSection';
import { MOCK_NOTIFICATION_SETTINGS } from '@/features/settings/data/settings.mock';
import type { NotificationSettings } from '@/features/settings/types/settings.types';
import { Separator } from '@/shadcn/ui/separator';
import { Switch } from '@/shadcn/ui/switch';

const NotificationSection = () => {
  const [settings, setSettings] = useState<NotificationSettings>(MOCK_NOTIFICATION_SETTINGS);

  const toggleAlert = (key: keyof Omit<NotificationSettings, 'channels'>) => {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  };

  // const toggleChannel = (key: keyof NotificationSettings['channels']) => {
  //   setSettings((s) => ({
  //     ...s,
  //     channels: { ...s.channels, [key]: !s.channels[key] },
  //   }));
  // };

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

      {/* <div className="flex flex-col gap-4 pt-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          수신 채널
        </p>
        <div className="space-y-4">
          <SettingRow
            label="푸시 알림"
            action={
              <Switch
                checked={settings.channels.push}
                onCheckedChange={() => toggleChannel('push')}
              />
            }
          />
          <Separator />
          <SettingRow
            label="이메일"
            action={
              <Switch
                checked={settings.channels.email}
                onCheckedChange={() => toggleChannel('email')}
              />
            }
          />
          <Separator />
          <SettingRow
            label="카카오톡"
            action={
              <Switch
                checked={settings.channels.kakao}
                onCheckedChange={() => toggleChannel('kakao')}
              />
            }
          />
        </div>
      </div> */}
    </SettingsSection>
  );
};

export default NotificationSection;
