import { Clock } from 'lucide-react';

import { DAY_OF_WEEK_CONFIG } from '@/features/initial-setup/constants/initialSetup.constants';
import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';
import { cn } from '@/lib/utils';
import { Switch } from '@/shadcn/ui/switch';

interface StepOperatingHoursProps {
  data: OperatingHour[];
  onChange: (data: OperatingHour[]) => void;
}

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeInput = ({ value, onChange }: TimeInputProps) => (
  <div className="relative flex items-center">
    <Clock className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-36 rounded-lg border border-input bg-white pl-8 pr-3 text-sm outline-none transition-colors focus:border-baro-blue focus:ring-2 focus:ring-(--baro-blue)/20"
    />
  </div>
);

const StepOperatingHours = ({ data, onChange }: StepOperatingHoursProps) => {
  const handleUpdate = (index: number, updated: Partial<OperatingHour>) => {
    onChange(data.map((hour, i) => (i === index ? { ...hour, ...updated } : hour)));
  };

  return (
    <div className="space-y-2">
      {DAY_OF_WEEK_CONFIG.map((day, index) => {
        const hour = data[index];
        const isSat = day.value === 'saturday';
        const isSun = day.value === 'sunday';

        return (
          <div
            key={day.value}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
              hour.isOpen
                ? 'border-(--baro-blue)/25 bg-(--baro-blue)/5'
                : 'border-gray-100 bg-gray-50/80',
            )}
          >
            <span
              className={cn(
                'w-14 shrink-0 text-sm font-medium',
                isSat ? 'text-blue-500' : isSun ? 'text-red-500' : 'text-foreground',
              )}
            >
              {day.label}
            </span>

            <Switch
              checked={hour.isOpen}
              onCheckedChange={(checked) => handleUpdate(index, { isOpen: checked })}
            />

            {hour.isOpen ? (
              <div className="flex flex-1 items-center gap-2">
                <TimeInput
                  value={hour.openTime}
                  onChange={(v) => handleUpdate(index, { openTime: v })}
                />
                <span className="text-xs text-muted-foreground">~</span>
                <TimeInput
                  value={hour.closeTime}
                  onChange={(v) => handleUpdate(index, { closeTime: v })}
                />
              </div>
            ) : (
              <span className="flex-1 text-sm text-muted-foreground">휴무</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepOperatingHours;
