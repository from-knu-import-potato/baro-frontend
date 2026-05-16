import { Truck, Sparkles } from 'lucide-react';

import { REASON_CONFIG } from '@/features/dashboard/constants/dashboard.constants.ui';
import type { OrderRecommendationItem } from '@/features/dashboard/types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface OrderPredictionCardProps {
  demandPrediction: string;
  recommendations: OrderRecommendationItem[];
}

const OrderPredictionCard = ({ demandPrediction, recommendations }: OrderPredictionCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <Truck className="w-4 h-4 text-muted-foreground" />
          발주 및 수요 예측
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 flex-1">
        {/* 수요 예측 섹션 */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            수요 예측
          </span>
          <div className="flex items-start gap-2.5 text-muted-foreground bg-blue-50 dark:bg-baro-blue-dark/30 rounded-xl p-3.5 border border-blue-100 dark:border-baro-blue-dark/20">
            <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed">{demandPrediction}</p>
          </div>
        </div>

        <div className="border-t " />

        {/* 발주 추천 리스트 섹션 */}
        <div className="flex flex-col gap-2 flex-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            발주 추천
          </span>
          <div className="flex flex-col">
            {recommendations.map((item) => {
              const config = REASON_CONFIG[item.reason];
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-baro-black/50 transition-colors"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.detail}</span>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${config.className}`}
                  >
                    {config.icon}
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderPredictionCard;
