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
  <input
    type="time"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-5 min-w-0 flex-1 rounded border border-input px-1 text-xs outline-none transition-colors focus:border-baro-blue focus:ring-1 focus:ring-baro-blue/20"
  />
);

const StepOperatingHours = ({ data, onChange }: StepOperatingHoursProps) => {
  const handleUpdate = (index: number, updated: Partial<OperatingHour>) => {
    onChange(data.map((hour, i) => (i === index ? { ...hour, ...updated } : hour)));
  };

  const allOpen = data.every((h) => h.isOpen);
  const handleToggleAll = () => {
    onChange(data.map((h) => ({ ...h, isOpen: !allOpen })));
  };

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {DAY_OF_WEEK_CONFIG.map((day, index) => {
        const hour = data[index];
        const isSat = day.value === 'saturday';
        const isSun = day.value === 'sunday';
        const shortLabel = day.label.slice(0, 1);

        const dayTextColor = hour.isOpen
          ? isSun
            ? 'text-red-500'
            : isSat
              ? 'text-blue-500'
              : 'text-baro-blue'
          : 'text-gray-300';

        return (
          <div
            key={day.value}
            className={cn(
              'flex flex-col gap-1.5 rounded-xl p-2.5 transition-all duration-150',
              hour.isOpen
                ? 'border border-transparent bg-white shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08)]'
                : 'border border-gray-100 bg-gray-50',
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn('text-sm font-bold transition-colors', dayTextColor)}>
                {shortLabel}
              </span>
              <Switch
                checked={hour.isOpen}
                onCheckedChange={(checked) => handleUpdate(index, { isOpen: checked })}
              />
            </div>

            <div className="flex h-5 items-center gap-1">
              {hour.isOpen ? (
                <>
                  <TimeInput
                    value={hour.openTime}
                    onChange={(v) => handleUpdate(index, { openTime: v })}
                  />
                  <span className="shrink-0 text-[10px] text-muted-foreground">~</span>
                  <TimeInput
                    value={hour.closeTime}
                    onChange={(v) => handleUpdate(index, { closeTime: v })}
                  />
                </>
              ) : (
                <span className="text-xs font-medium text-gray-300">휴무</span>
              )}
            </div>
          </div>
        );
      })}

      {/* 전체 토글 카드 */}
      <button
        type="button"
        onClick={handleToggleAll}
        className={cn(
          'flex flex-col justify-between gap-1.5 rounded-xl p-2.5 text-left transition-all duration-150',
          allOpen
            ? 'bg-white shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08)]'
            : 'border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50/60',
        )}
      >
        <span className={cn('text-sm font-bold', allOpen ? 'text-baro-blue' : 'text-gray-300')}>
          전체
        </span>
        <span className={cn('text-xs font-medium', allOpen ? 'text-gray-400' : 'text-gray-300')}>
          {allOpen ? '전체 닫기' : '모두 열기'}
        </span>
      </button>
    </div>
  );
};

export default StepOperatingHours;
