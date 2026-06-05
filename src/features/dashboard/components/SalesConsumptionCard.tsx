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
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />

      <g transform={`rotate(-90 ${cx} ${cy})`}>
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
            <p className="text-sm font-bold leading-none">{(latest.sales / 10000).toFixed(0)}만</p>
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
