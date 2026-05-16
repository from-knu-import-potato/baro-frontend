import { Bell } from 'lucide-react';

import { NOTIFICATION_CHANNELS } from '@/features/initial-setup/constants/initialSetup.constants';
import { ALERT_TYPE_CONFIG } from '@/features/initial-setup/constants/initialSetup.constants.ui';
import type {
  AlertKey,
  ChannelKey,
  NotificationSettings,
} from '@/features/initial-setup/types/initialSetup.types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/shadcn/ui/checkbox';
import { Separator } from '@/shadcn/ui/separator';
import { Switch } from '@/shadcn/ui/switch';

interface StepNotificationsProps {
  data: NotificationSettings;
  onChange: (data: NotificationSettings) => void;
}

const StepNotifications = ({ data, onChange }: StepNotificationsProps) => {
  const updateAlert = (key: AlertKey, value: boolean) => {
    onChange({ ...data, [key]: value });
  };

  const updateChannel = (key: ChannelKey, value: boolean) => {
    onChange({ ...data, alertChannels: { ...data.alertChannels, [key]: value } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Bell className="size-4 text-baro-blue" />
          알림 유형
        </h3>
        <div className="space-y-2.5">
          {ALERT_TYPE_CONFIG.map(({ key, icon: Icon, title, description }) => (
            <div
              key={key}
              className={cn(
                'flex items-start justify-between gap-4 rounded-lg border p-3.5 transition-colors',
                data[key]
                  ? 'border-(--baro-blue)/25 bg-(--baro-blue)/5'
                  : 'border-gray-100 bg-gray-50',
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                    data[key] ? 'bg-baro-blue text-white' : 'bg-gray-200 text-gray-400',
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
              <Switch
                checked={data[key]}
                onCheckedChange={(checked) => updateAlert(key, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">알림 수단</h3>
        <div className="flex flex-wrap gap-5">
          {NOTIFICATION_CHANNELS.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={data.alertChannels[key]}
                onCheckedChange={(checked) => updateChannel(key, !!checked)}
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepNotifications;
