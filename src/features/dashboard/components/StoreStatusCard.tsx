import { Store } from 'lucide-react';

import type { DashboardStats } from '@/features/dashboard/types/dashboard.types';
import { useOrderStore } from '@/features/orders/store/orderStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface StoreStatusCardProps {
  stats: DashboardStats;
}

/* ── 개별 스탯 타일 ── */
interface StatTileProps {
  label: string;
  value: string;
  comment: string;
  commentColor: string;
}

const StatTile = ({ label, value, comment, commentColor }: StatTileProps) => (
  <div className="flex-1 min-w-0 rounded-xl border bg-card p-4 space-y-1.5">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
    <p className={`text-xs font-medium ${commentColor}`}>{comment}</p>
  </div>
);

const StoreStatusCard = ({ stats }: StoreStatusCardProps) => {
  const orders = useOrderStore((s) => s.orders);

  const today = new Date().toDateString();
  const todayRevenue = orders
    .filter((o) => o.status === 'completed' && new Date(o.createdAt).toDateString() === today)
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const todayOrderCount = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  ).length;

  const isDecreased = stats.monthlyConsumptionChange < 0;
  const changeAbs = Math.abs(stats.monthlyConsumptionChange);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-sm flex items-center gap-2">
          <Store className="w-4 h-4 text-muted-foreground" />
          오늘의 가게 현황
        </CardTitle>
      </CardHeader>

      <CardContent className="flex gap-3">
        <StatTile
          label="전체 재고"
          value={`${stats.totalInventory}개`}
          comment={
            stats.aiOrderRecommendations > 0
              ? `발주 추천 ${stats.aiOrderRecommendations}개 있어요`
              : '발주 추천 없어요'
          }
          commentColor={stats.aiOrderRecommendations > 0 ? 'text-amber-500' : 'text-green-500'}
        />
        <StatTile
          label="이번 달 소비"
          value={`${(stats.monthlyConsumption / 10000).toFixed(0)}만원`}
          comment={`${isDecreased ? '↘' : '↗'} 지난 달 대비 ${changeAbs}% ${isDecreased ? '감소' : '증가'}`}
          commentColor={isDecreased ? 'text-blue-500' : 'text-red-500'}
        />
        <StatTile
          label="오늘 매출"
          value={todayRevenue > 0 ? `${(todayRevenue / 10000).toFixed(1)}만원` : '0원'}
          comment={`주문 ${todayOrderCount}건 처리`}
          commentColor="text-green-600"
        />
      </CardContent>
    </Card>
  );
};

export default StoreStatusCard;
