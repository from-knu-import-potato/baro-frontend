import { PieChart } from 'lucide-react';

import type { MonthlySalesData } from '@/features/dashboard/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface SalesConsumptionCardProps {
  data: MonthlySalesData[];
}

/* ── SVG 도넛 차트 ── */
interface DonutChartProps {
  salesRatio: number; // 매출 / (매출 + 소비), 0 ~ 1
  hasData: boolean;
}

const DonutChart = ({ salesRatio, hasData }: DonutChartProps) => {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const sw = 18;
  const C = 2 * Math.PI * r;
  const GAP = C * 0.015;

  // 데이터 없으면 회색 원만 표시
  if (!hasData) {
    return (
      <svg viewBox="0 0 140 140" className="w-full h-full">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
      </svg>
    );
  }

  const ratio = Math.min(1, Math.max(0, salesRatio));
  const hasBoth = ratio > 0 && ratio < 1;
  // 초록 = 매출 아크
  const salesArc = hasBoth ? C * ratio - GAP : C * ratio;
  // 파랑 = 소비 아크
  const consumptionArc = hasBoth ? C * (1 - ratio) - GAP : C * (1 - ratio);

  return (
    <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-md">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />

      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {salesArc > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#679436"
            strokeWidth={sw}
            strokeLinecap="butt"
            strokeDasharray={`${salesArc} ${C}`}
            strokeDashoffset={0}
          />
        )}
        {consumptionArc > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#449CD4"
            strokeWidth={sw}
            strokeLinecap="butt"
            strokeDasharray={`${consumptionArc} ${C}`}
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
  const total = latest.sales + latest.consumption;
  const rawSalesRatio = total > 0 ? latest.sales / total : 0;
  // 둘 다 값이 있을 때 최소 5% 아크 보장 (비율이 극단적이어도 양쪽 다 보이게)
  const MIN_VISIBLE = 0.05;
  const salesRatio =
    rawSalesRatio === 0
      ? 0
      : rawSalesRatio === 1
        ? 1
        : Math.max(MIN_VISIBLE, Math.min(1 - MIN_VISIBLE, rawSalesRatio));
  // 소비 비율은 (매출+소비) 합계 대비로 계산 (매출보다 소비가 크면 /매출 기준은 100% 초과)
  const consumptionRatio = total > 0 ? latest.consumption / total : 0;

  return (
    <Card size="sm" className="md:h-full">
      <CardHeader className="border-b px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-muted-foreground" />
          이번 달 현황
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex items-center gap-5 px-4 py-3">
        {/* 도넛 차트 */}
        <div className="relative w-28 h-28 shrink-0">
          <DonutChart salesRatio={salesRatio} hasData={total > 0} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">{latest.month}</p>
          </div>
        </div>

        {/* 수치 목록 */}
        <div className="flex-1 flex flex-col justify-center gap-3">
          {/* 매출 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-baro-green shrink-0" />
              <span className="text-xs text-muted-foreground">매출</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                {(total > 0 ? (1 - consumptionRatio) * 100 : 0).toFixed(1)}%
              </span>
              <span className="text-sm font-bold">{(latest.sales / 10000).toFixed(0)}만원</span>
            </div>
          </div>

          {/* 소비 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-baro-blue shrink-0" />
              <span className="text-xs text-muted-foreground">소비</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                {(consumptionRatio * 100).toFixed(1)}%
              </span>
              <span className="text-sm font-bold">
                {(latest.consumption / 10000).toFixed(0)}만원
              </span>
            </div>
          </div>

          {/* 구분선 + 순이익 */}
          <div className="border-t pt-2.5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">순이익</span>
            <div className="flex items-center gap-1.5">
              {isDeficit && (
                <span className="text-[10px] text-baro-red bg-red-50 border border-red-200/60 px-1.5 py-0.5 rounded-full leading-none dark:bg-red-950/40 dark:border-red-800/40">
                  적자
                </span>
              )}
              <span className={`text-sm font-bold ${isDeficit ? 'text-baro-red' : ''}`}>
                {(rawProfit / 10000).toFixed(0)}만원
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesConsumptionCard;
