import { Truck, TrendingUpDown, BotMessageSquare } from 'lucide-react';

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

      <CardContent className="flex flex-col gap-5 flex-1 min-h-0 overflow-hidden">
        {/* 수요 예측 섹션 */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            수요 예측
          </span>
          <div className="flex items-start gap-2.5 text-baro-blue-dark bg-baro-blue/10 dark:bg-baro-blue-dark/20 rounded-xl p-3.5 border border-blue-100 dark:border-baro-blue-dark/20">
            <TrendingUpDown className="w-4 h-4 text-baro-blue-dark mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed">{demandPrediction}</p>
          </div>
        </div>

        <div className="border-t shrink-0" />

        {/* 발주 추천 섹션 */}
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
            발주 추천
          </span>
          <div className="flex flex-col gap-3 overflow-y-auto">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1.5 bg-baro-green/10 rounded-xl p-3.5 border border-baro-green/40"
              >
                <div className="flex items-center gap-1.5">
                  <BotMessageSquare className="w-3.5 h-3.5 text-baro-green-dark shrink-0" />
                  <span className="text-sm font-semibold text-baro-green-dark">{item.name}</span>
                </div>
                <p className="text-sm leading-relaxed text-baro-green pl-5">{item.aiReason}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderPredictionCard;
