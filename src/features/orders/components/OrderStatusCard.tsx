import { useState } from 'react';

import { Clock, ShoppingBag } from 'lucide-react';

import OrderStatusBadge from '@/features/orders/components/OrderStatusBadge';
import { useOrderStore } from '@/features/orders/store/orderStore';
import type { Order } from '@/features/orders/types/order.types';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

type TabKey = 'pending' | 'preparing' | 'completed';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pending', label: '신규주문' },
  { key: 'preparing', label: '준비중' },
  { key: 'completed', label: '완료' },
];

const EMPTY_MESSAGE: Record<TabKey, string> = {
  pending: '새로운 주문이 없어요',
  preparing: '준비 중인 주문이 없어요',
  completed: '완료된 주문이 없어요',
};

const formatTimeAgo = (isoString: string): string => {
  const diffMin = Math.floor((Date.now() - new Date(isoString).getTime()) / 60_000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  return `${Math.floor(diffMin / 60)}시간 전`;
};

/* ── 개별 주문 카드 ── */
interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  return (
    <div className="rounded-lg border bg-card p-3 space-y-2">
      {/* 헤더: 테이블 + 상태 + 시간 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate">
            {order.tableNumber ?? '테이블 미지정'}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
          <Clock className="size-3" />
          {formatTimeAgo(order.createdAt)}
        </div>
      </div>

      {/* 주문 내역 */}
      <p className="text-xs text-muted-foreground line-clamp-2">
        {order.items.map((i) => `${i.name} x${i.quantity}`).join(' · ')}
      </p>

      {/* 요청사항 */}
      {order.customerNote && (
        <p className="text-xs text-amber-500/80 bg-amber-50/60 rounded px-2 py-1">
          💬 {order.customerNote}
        </p>
      )}

      {/* 금액 + 액션 버튼 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{order.totalAmount.toLocaleString()}원</span>
        <div className="flex gap-1.5">
          {order.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="h-7 px-2.5 text-xs bg-baro-blue text-white hover:bg-baro-blue/80"
                onClick={() => updateOrderStatus(order.id, 'preparing')}
              >
                수락
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-xs"
                onClick={() => updateOrderStatus(order.id, 'cancelled')}
              >
                취소
              </Button>
            </>
          )}
          {order.status === 'preparing' && (
            <Button
              size="sm"
              className="h-7 px-2.5 text-xs bg-slate-600 text-white hover:bg-slate-700"
              onClick={() => updateOrderStatus(order.id, 'completed')}
            >
              완료처리
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── 주문 현황 카드 ── */
const OrderStatusCard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const orders = useOrderStore((s) => s.orders);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const filteredOrders = orders.filter((o) => o.status === activeTab);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="border-b flex-shrink-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShoppingBag className="size-4 text-muted-foreground" />
          오늘 주문 현황
          {pendingCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-amber-400/80 text-xs font-bold text-white">
              {pendingCount}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      {/* 탭 */}
      <div className="flex border-b flex-shrink-0">
        {TABS.map((tab) => {
          const count = orders.filter((o) => o.status === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'border-b-2 border-baro-blue text-baro-blue'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`ml-1 rounded-full px-1.5 py-0.5 text-xs ${
                    isActive ? 'bg-baro-blue/10 text-baro-blue' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 주문 목록 */}
      <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <ShoppingBag className="size-8 mb-2 opacity-25" />
            <p className="text-xs">{EMPTY_MESSAGE[activeTab]}</p>
          </div>
        ) : (
          filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;
