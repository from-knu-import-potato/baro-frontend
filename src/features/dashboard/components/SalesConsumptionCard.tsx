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

  const consumptionArc = C * consumptionRatio - GAP;
  const profitArc = C * (1 - consumptionRatio) - GAP;

  return (
    <svg viewBox="0 0 140 140" className="w-full h-full">
      {/* 배경 트랙 */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />

      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {/* 소비 (amber) */}
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
        {/* 순이익 (blue) */}
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
            strokeDashoffset={-(C * consumptionRatio)}
          />
        )}
      </g>
    </svg>
  );
};

/* ── 메인 카드 ── */
const SalesConsumptionCard = ({ data }: SalesConsumptionCardProps) => {
  const latest = data[data.length - 1];
  const profit = Math.max(0, latest.sales - latest.consumption);
  const consumptionRatio = latest.consumption / latest.sales;
  const profitRatio = profit / latest.sales;

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b shrink-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-muted-foreground" />
          이번 달 현황
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 px-5 pt-3 pb-5 gap-3">
        {/* 도넛 */}
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-45 max-h-45">
              <DonutChart consumptionRatio={consumptionRatio} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                <p className="text-xs text-muted-foreground">{latest.month} 매출</p>
                <p className="text-base font-bold leading-none">
                  {(latest.sales / 10000).toFixed(0)}만
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex gap-3 shrink-0">
          <div className="flex-1 rounded-xl bg-muted/40 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="size-2 rounded-full bg-baro-green shrink-0" />
              <span className="text-xs text-muted-foreground">소비</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {(latest.consumption / 10000).toFixed(0)}만원
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(consumptionRatio * 100).toFixed(1)}%
            </p>
          </div>
          <div className="flex-1 rounded-xl bg-muted/40 px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="size-2 rounded-full bg-baro-blue shrink-0" />
              <span className="text-xs text-muted-foreground">순이익</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{(profit / 10000).toFixed(0)}만원</p>
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
