import { PieChart } from 'lucide-react';

import type { MonthlySalesData } from '@/features/dashboard/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface SalesConsumptionCardProps {
  data: MonthlySalesData[];
}

/* ── SVG 도넛 차트 ── */
interface DonutChartProps {
  consumptionRatio: number; // 0 ~ 1
}

const DonutChart = ({ consumptionRatio }: DonutChartProps) => {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const sw = 18;
  const C = 2 * Math.PI * r;
  const GAP = C * 0.015;

  const ratio = Math.min(1, Math.max(0, consumptionRatio));
  const hasBoth = ratio > 0 && ratio < 1;
  const consumptionArc = hasBoth ? C * ratio - GAP : C * ratio;
  const profitArc = hasBoth ? C * (1 - ratio) - GAP : C * (1 - ratio);

  return (
    <svg viewBox="0 0 140 140" className="w-full h-full">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />

      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {consumptionArc > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#679436"
            strokeWidth={sw}
            strokeLinecap="butt"
            strokeDasharray={`${consumptionArc} ${C}`}
            strokeDashoffset={0}
          />
        )}
        {profitArc > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#449CD4"
            strokeWidth={sw}
            strokeLinecap="butt"
            strokeDasharray={`${profitArc} ${C}`}
            strokeDashoffset={hasBoth ? -(C * ratio) : 0}
          />
        )}
      </g>
    </svg>
  );
};

/* ── 메인 카드 ── */
const SalesConsumptionCard = ({ data }: SalesConsumptionCardProps) => {
  const latest = data[data.length - 1];
  const rawProfit = latest.sales - latest.consumption;
  const isDeficit = rawProfit < 0;
  const profit = Math.max(0, rawProfit);
  const consumptionRatio = latest.sales > 0 ? latest.consumption / latest.sales : 0;
  const profitRatio = latest.sales > 0 ? profit / latest.sales : 0;

  return (
    <Card size="sm" className="h-full">
      <CardHeader className="border-b px-4 ">
        <CardTitle className="text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-muted-foreground" />
          이번 달 현황
        </CardTitle>
      </CardHeader>

      {/* 가로 배치: 도넛 차트 (좌) + 범례 (우) — 세로 중앙 정렬 */}
      <CardContent className="flex-1 flex items-center gap-4 px-4 py-3">
        {/* 도넛 차트 */}
        <div className="relative w-28 h-28 shrink-0">
          <DonutChart consumptionRatio={consumptionRatio} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <p className="text-[10px] text-muted-foreground">{latest.month} 매출</p>
            <p className="text-sm font-bold leading-none">{(latest.sales / 10000).toFixed(1)}만</p>
          </div>
        </div>

        {/* 범례 — 가로 배치 */}
        <div className="flex-1 flex gap-2">
          <div className="flex-1 rounded-lg bg-muted/40 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="size-2 rounded-full bg-baro-green shrink-0" />
              <span className="text-xs text-muted-foreground">소비</span>
            </div>
            <p className="text-sm font-bold ">{(latest.consumption / 10000).toFixed(0)}만원</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(consumptionRatio * 100).toFixed(1)}%
            </p>
          </div>

          <div className="flex-1 rounded-lg bg-muted/40 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="size-2 rounded-full bg-baro-blue shrink-0" />
              <span className="text-xs text-muted-foreground">순이익</span>
              {isDeficit && (
                <span className="text-[10px] text-baro-red bg-red-50 border border-red-200/60 px-1.5 py-0.5 rounded-full leading-none">
                  적자
                </span>
              )}
            </div>
            <p className="text-sm font-bold">{(profit / 10000).toFixed(0)}만원</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(profitRatio * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesConsumptionCard;
