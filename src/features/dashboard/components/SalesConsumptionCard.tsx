import { BarChart2 } from 'lucide-react';

import type { MonthlySalesData } from '@/features/dashboard/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface SalesConsumptionCardProps {
  data: MonthlySalesData[];
}

const SalesConsumptionCard = ({ data }: SalesConsumptionCardProps) => {
  const allValues = data.flatMap((d) => [d.consumption, d.sales]);
  const maxValue = Math.max(...allValues);
  const avgValue = allValues.reduce((a, b) => a + b, 0) / allValues.length;

  const toPercent = (value: number) => Math.round((value / maxValue) * 100);
  const avgPercent = toPercent(avgValue);

  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-muted-foreground" />
          가게 소비 및 매출 현황
        </CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground ml-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-baro-blue inline-block" />
            매출
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F2A65A] inline-block" />
            소비
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 border-t-2 border-dashed border-gray-400 inline-block" />
            평균
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {/* 차트 영역 */}
        <div className="flex flex-col gap-2">
          <div className="relative h-40">
            {/* 평균선 */}
            <div
              className="absolute inset-x-0 z-10 pointer-events-none flex items-center gap-1"
              style={{ bottom: `${avgPercent}%` }}
            >
              <div className="flex-1 border-t-2 border-dashed border-gray-400/70" />
              <span className="text-[10px] text-gray-400 bg-white px-1 shrink-0">
                평균 {Math.round(avgValue / 10000)}만
              </span>
            </div>

            {/* 막대 그래프 */}
            <div className="flex items-end gap-2.5 h-full">
              {data.map((d) => (
                <div key={d.month} className="flex-1 flex items-end gap-0.5 h-full">
                  <div
                    className="flex-1 rounded-t bg-[#449CD4]/80 transition-all"
                    style={{ height: `${toPercent(d.sales)}%` }}
                  />
                  <div
                    className="flex-1 rounded-t bg-[#F2A65A]/80 transition-all"
                    style={{ height: `${toPercent(d.consumption)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 월 라벨 */}
          <div className="flex gap-2.5">
            {data.map((d) => (
              <div key={d.month} className="flex-1 text-center">
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesConsumptionCard;
