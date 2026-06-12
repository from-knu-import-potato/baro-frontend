import { Store } from 'lucide-react';

import { useOrders } from '@/features/dashboard/hooks/useOrders';
import type { DashboardStats } from '@/features/dashboard/types/dashboard.types';

interface StoreStatusCardProps {
  stats: DashboardStats;
  storeId: string | null;
}

interface StatTileProps {
  label: string;
  value: string;
  comment: string;
  commentColor: string;
}

const StatTile = ({ label, value, comment, commentColor }: StatTileProps) => (
  <div className="flex-1 min-w-0 rounded-xl border bg-card p-3 space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold tracking-tight">{value}</p>
    <p className={`text-xs font-medium ${commentColor}`}>{comment}</p>
  </div>
);

const StoreStatusCard = ({ stats, storeId }: StoreStatusCardProps) => {
  const { data: orders = [] } = useOrders(storeId);

  const today = new Date().toDateString();
  const todayRevenue = orders
    .filter((o) => o.status === 'completed' && new Date(o.createdAt).toDateString() === today)
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const todayOrderCount = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  ).length;

  return (
    <div className="rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      <div className="border-b px-4 py-2.5">
        <p className="text-sm font-medium flex items-center gap-2">
          <Store className="w-4 h-4 text-muted-foreground" />
          오늘의 가게 현황
        </p>
      </div>

      <div className="flex gap-3 px-4 py-3">
        <StatTile
          label="전체 재고"
          value={`${stats.totalInventory}개`}
          comment={
            stats.aiOrderRecommendations > 0
              ? `발주 추천 ${stats.aiOrderRecommendations}개 있어요`
              : '발주 추천 없어요'
          }
          commentColor={stats.aiOrderRecommendations > 0 ? 'text-amber-500' : 'text-baro-green'}
        />
        <StatTile
          label="유통기한 임박"
          value={`${stats.expiringItems}개`}
          comment={stats.expiringItems > 0 ? '빠른 소진 및 발주 필요' : '임박 상품이 없어요'}
          commentColor={stats.expiringItems > 0 ? 'text-red-500' : 'text-baro-green'}
        />
        <StatTile
          label="오늘 매출"
          value={todayRevenue > 0 ? `${(todayRevenue / 10000).toFixed(1)}만원` : '0원'}
          comment={`주문 ${todayOrderCount}건 처리`}
          commentColor="text-green-600"
        />
      </div>
    </div>
  );
};

export default StoreStatusCard;
