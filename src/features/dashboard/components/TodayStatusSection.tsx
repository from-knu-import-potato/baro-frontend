import { Package, Clock, Bot, TrendingDown, TrendingUp, Store } from 'lucide-react';

import StatItem from '@/features/dashboard/components/StatItem';
import type { DashboardStats } from '@/features/dashboard/types/dashboard.types';
import { Button } from '@/shadcn/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface TodayStatusSectionProps {
  stats: DashboardStats;
  onClosingClick: () => void;
}

const TodayStatusSection = ({ stats, onClosingClick }: TodayStatusSectionProps) => {
  const isDecreased = stats.monthlyConsumptionChange < 0;
  const changeAbs = Math.abs(stats.monthlyConsumptionChange);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-sm flex items-center gap-2">
          <Store className="w-4 h-4 text-muted-foreground" />
          오늘의 가게 현황
        </CardTitle>
        <CardAction>
          <Button
            onClick={onClosingClick}
            className="bg-baro-blue text-xs rounded-full hover:bg-baro-blue/70"
          >
            마감하기
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex gap-3">
        <StatItem
          label="전체 재고 개수"
          value={`${stats.totalInventory.toLocaleString()} 개`}
          iconBg="bg-orange-100"
          icon={<Package className="w-6 h-6 text-orange-400" />}
          subtitle={`마지막 업데이트  ${stats.lastUpdated}`}
        />
        <StatItem
          label="유통기한 임박"
          value={`${stats.expiringItems} 개`}
          iconBg="bg-red-100"
          icon={<Clock className="w-6 h-6 text-red-400" />}
          subtitle={`마지막 업데이트  ${stats.lastUpdated}`}
        />
        <StatItem
          label="AI 발주 추천"
          value={`${stats.aiOrderRecommendations}개`}
          iconBg="bg-purple-100"
          icon={<Bot className="w-6 h-6 text-purple-300" />}
          subtitle={`마지막 업데이트  ${stats.lastUpdated}`}
        />
        <StatItem
          label="이번 달 소비"
          value={stats.monthlyConsumption.toLocaleString()}
          iconBg="bg-blue-100"
          icon={
            isDecreased ? (
              <TrendingDown className="w-6 h-6 text-blue-400" />
            ) : (
              <TrendingUp className="w-6 h-6 text-blue-400" />
            )
          }
          subtitle={
            <span className={isDecreased ? 'text-blue-500' : 'text-red-500'}>
              {isDecreased ? '↘' : '↗'} {changeAbs}% 지난 달에 비해 {isDecreased ? '감소' : '증가'}
            </span>
          }
        />
      </CardContent>
    </Card>
  );
};

export default TodayStatusSection;
