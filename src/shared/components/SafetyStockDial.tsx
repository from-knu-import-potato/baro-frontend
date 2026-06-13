import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SafetyStockDialProps {
  value: number; // 0-100 (%)
  onChange: (value: number) => void;
  currentStock?: number;
  unit?: string;
  disabled?: boolean;
  step?: number; // default 1
  compact?: boolean; // default false — 5항목 소형, 설명 텍스트 숨김
}

const NORMAL_SIZES = [
  { width: 'w-8', height: 'h-6', text: 'text-[10px]', opacity: 'opacity-20' },
  { width: 'w-10', height: 'h-7', text: 'text-xs', opacity: 'opacity-40' },
  { width: 'w-12', height: 'h-9', text: 'text-sm', opacity: 'opacity-65' },
  { width: 'w-16', height: 'h-12', text: 'text-xl', opacity: 'opacity-100' },
  { width: 'w-12', height: 'h-9', text: 'text-sm', opacity: 'opacity-65' },
  { width: 'w-10', height: 'h-7', text: 'text-xs', opacity: 'opacity-40' },
  { width: 'w-8', height: 'h-6', text: 'text-[10px]', opacity: 'opacity-20' },
] as const;

const COMPACT_SIZES = [
  { width: 'w-7', height: 'h-5', text: 'text-[10px]', opacity: 'opacity-25' },
  { width: 'w-9', height: 'h-6', text: 'text-xs', opacity: 'opacity-55' },
  { width: 'w-12', height: 'h-8', text: 'text-sm', opacity: 'opacity-100' },
  { width: 'w-9', height: 'h-6', text: 'text-xs', opacity: 'opacity-55' },
  { width: 'w-7', height: 'h-5', text: 'text-[10px]', opacity: 'opacity-25' },
] as const;

const clampStep = (v: number, step: number) => {
  const clamped = Math.min(100, Math.max(0, v));
  return Math.round(clamped / step) * step;
};

const SafetyStockDial = ({
  value,
  onChange,
  currentStock,
  unit,
  disabled,
  step = 1,
  compact = false,
}: SafetyStockDialProps) => {
  const sizes = compact ? COMPACT_SIZES : NORMAL_SIZES;
  const half = Math.floor(sizes.length / 2);
  const visible = Array.from({ length: sizes.length }, (_, i) => value + (i - half) * step);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    onChange(clampStep(value + (e.deltaY > 0 ? step : -step), step));
  };

  const calcSafetyStock =
    currentStock !== undefined ? Math.round(currentStock * (value / 100)) : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <div className="flex items-center gap-0.5" onWheel={handleWheel}>
        <button
          type="button"
          onClick={() => onChange(clampStep(value - step, step))}
          disabled={value <= 0 || disabled}
          className="flex size-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-30"
        >
          <ChevronLeft className="size-3" />
        </button>

        <div className="flex items-center gap-0.5">
          {visible.map((v, i) => {
            const isCenter = i === half;
            const isValid = v >= 0 && v <= 100;
            const s = sizes[i];

            return (
              <button
                key={i}
                type="button"
                disabled={!isValid || isCenter || disabled}
                onClick={() => isValid && !isCenter && onChange(v)}
                className={cn(
                  'flex items-center justify-center rounded-md font-medium transition-all select-none',
                  s.width,
                  s.height,
                  s.text,
                  s.opacity,
                  isCenter
                    ? 'bg-baro-blue text-white font-bold shadow-xs cursor-default rounded-full'
                    : 'text-foreground cursor-pointer hover:opacity-90 disabled:cursor-default',
                  !isValid && 'invisible pointer-events-none',
                )}
              >
                {isValid ? `${v}%` : ''}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onChange(clampStep(value + step, step))}
          disabled={value >= 100 || disabled}
          className="flex size-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-30"
        >
          <ChevronRight className="size-3" />
        </button>
      </div>

      {!compact && (
        <p className="text-center text-xs text-muted-foreground leading-tight">
          전체 재고의 <span className="font-semibold text-foreground">{value}%</span>를 안전 재고
          기준으로 설정
          {calcSafetyStock !== null && (
            <span className="ml-1 text-muted-foreground">
              ({calcSafetyStock.toLocaleString()}
              {unit ? ` ${unit}` : ''})
            </span>
          )}
        </p>
      )}

      {compact && calcSafetyStock !== null && (
        <p className="text-center text-[10px] text-muted-foreground">
          {calcSafetyStock.toLocaleString()}
          {unit ? ` ${unit}` : ''}
        </p>
      )}
    </div>
  );
};

export default SafetyStockDial;
