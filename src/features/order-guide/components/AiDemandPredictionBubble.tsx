import { BotMessageSquare, RefreshCw, Sparkles } from 'lucide-react';

import type { AiDemandPrediction } from '@/features/order-guide/types/orderGuide.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface AiDemandPredictionBubbleProps {
  prediction: AiDemandPrediction;
}

const AiDemandPredictionBubble = ({ prediction }: AiDemandPredictionBubbleProps) => {
  return (
    <Card className="border-baro-blue/30 bg-linear-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-baro-blue" />
            AI 수요 예측
          </CardTitle>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            {prediction.generatedAt} 기준
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* 말풍선 영역 */}
        <div className="flex items-start gap-3">
          {/* AI 아바타 */}
          <div className="shrink-0 w-9 h-9 rounded-full bg-baro-blue flex items-center justify-center shadow-sm">
            <BotMessageSquare className="w-5 h-5 text-white" />
          </div>

          {/* 말풍선 */}
          <div className="relative flex-1">
            {/* 꼬리 */}
            <div className="absolute -left-2 top-3 w-0 h-0 border-t-[6px] border-t-transparent border-r-8 border-r-baro-blue/20 border-b-[6px] border-b-transparent" />

            <div className="bg-baro-blue/10 dark:bg-baro-blue/20 border border-baro-blue/20 rounded-2xl rounded-tl-sm px-4 py-3 flex flex-col gap-2">
              {/* 한 줄 요약 */}
              <p className="text-sm font-semibold text-baro-blue-dark leading-relaxed">
                {prediction.summary}
              </p>
              {/* 상세 설명 */}
              <p className="text-sm text-muted-foreground leading-relaxed">{prediction.detail}</p>
            </div>
          </div>
        </div>

        {/* 분석 근거 태그 */}
        <div className="flex flex-wrap gap-2 pl-12">
          <span className="text-xs text-muted-foreground font-medium self-center">분석 근거</span>
          {prediction.factors.map((factor, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-xs bg-white dark:bg-muted border border-border rounded-full px-3 py-1 text-muted-foreground shadow-sm"
            >
              <span>{factor.icon}</span>
              <span>{factor.label}</span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiDemandPredictionBubble;
