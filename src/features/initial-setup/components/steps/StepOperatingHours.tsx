import { DAY_OF_WEEK_CONFIG } from '@/features/initial-setup/constants/initialSetup.constants';
import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Switch } from '@/shadcn/ui/switch';

interface StepOperatingHoursProps {
  data: OperatingHour[];
  onChange: (data: OperatingHour[]) => void;
}

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '10', '20', '30', '40', '50'];

const TimePicker = ({ value, onChange }: TimeSelectProps) => {
  const [h, m] = value ? value.split(':') : ['', ''];

  return (
    <div className="flex flex-1 items-center gap-0.5">
      <Select value={h || undefined} onValueChange={(v) => onChange(`${v}:${m || '00'}`)}>
        <SelectTrigger size="sm" className="h-6 flex-1 text-xs">
          <SelectValue placeholder="시" />
        </SelectTrigger>
        <SelectContent className="max-h-48">
          {HOURS.map((hour) => (
            <SelectItem key={hour} value={hour} className="text-xs">
              {hour}시
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="shrink-0 text-[10px] text-muted-foreground">:</span>
      <Select value={m || undefined} onValueChange={(v) => onChange(`${h || '00'}:${v}`)}>
        <SelectTrigger size="sm" className="h-6 flex-1 text-xs">
          <SelectValue placeholder="분" />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((min) => (
            <SelectItem key={min} value={min} className="text-xs">
              {min}분
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const StepOperatingHours = ({ data, onChange }: StepOperatingHoursProps) => {
  const handleUpdate = (index: number, updated: Partial<OperatingHour>) => {
    onChange(data.map((hour, i) => (i === index ? { ...hour, ...updated } : hour)));
  };

  const allOpen = data.every((h) => h.isOpen);
  const handleToggleAll = () => {
    onChange(data.map((h) => ({ ...h, isOpen: !allOpen })));
  };

  return (
    <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
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
          : 'text-muted-foreground/30';

        return (
          <div
            key={day.value}
            className={cn(
              'flex flex-col gap-1.5 rounded-xl p-2.5 transition-all duration-150',
              hour.isOpen
                ? 'border border-border bg-card shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08)]'
                : 'border border-border/50 bg-muted/40',
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

            <div className="flex items-center gap-1">
              {hour.isOpen ? (
                <>
                  <TimePicker
                    value={hour.openTime ?? ''}
                    onChange={(v) => handleUpdate(index, { openTime: v })}
                  />
                  <span className="shrink-0 text-[10px] text-muted-foreground">~</span>
                  <TimePicker
                    value={hour.closeTime ?? ''}
                    onChange={(v) => handleUpdate(index, { closeTime: v })}
                  />
                </>
              ) : (
                <span className="text-xs font-medium text-muted-foreground/30">휴무</span>
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
            ? 'bg-card shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08)]'
            : 'border border-dashed border-border hover:border-border/80 hover:bg-muted/30',
        )}
      >
        <span
          className={cn(
            'text-sm font-bold',
            allOpen ? 'text-baro-blue' : 'text-muted-foreground/30',
          )}
        >
          전체
        </span>
        <span
          className={cn(
            'text-xs font-medium',
            allOpen ? 'text-muted-foreground' : 'text-muted-foreground/30',
          )}
        >
          {allOpen ? '전체 닫기' : '모두 열기'}
        </span>
      </button>
    </div>
  );
};

export default StepOperatingHours;
