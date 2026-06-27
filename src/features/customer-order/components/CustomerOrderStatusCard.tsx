import { useState } from 'react';

import { AlertTriangle, Clock, ShoppingBag } from 'lucide-react';

import useClosingStore from '@/features/closing/store/closingStore';
import OrderStatusBadge from '@/features/customer-order/components/CustomerOrderStatusBadge';
import type { ApiOrder } from '@/features/customer-order/types/customerOrder.api.types';
import { useOrders, useUpdateOrderStatus } from '@/features/dashboard/hooks/useOrders';
import { useOrderSSE } from '@/features/dashboard/hooks/useOrderSSE';
import useOrderWarningsStore from '@/features/dashboard/store/orderWarningsStore';
import { useUpdateMenu } from '@/features/store-settings/hooks/useMenus';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shadcn/ui/alert-dialog';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';

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

/* ── 완료 주문 취소 모달 ── */
interface CancelCompletedOrderModalProps {
  open: boolean;
  onConfirm: (restoreStock: boolean) => void;
  onClose: () => void;
}

const CancelCompletedOrderModal = ({
  open,
  onConfirm,
  onClose,
}: CancelCompletedOrderModalProps) => (
  <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>완료된 주문을 취소할까요?</AlertDialogTitle>
        <AlertDialogDescription>
          취소 방식을 선택해 주세요. 재고 복원은 수락 시 차감된 재고를 되돌립니다.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
        <Button variant="outline" className="w-full" onClick={() => onConfirm(true)}>
          재고도 복원
        </Button>
        <Button
          variant="outline"
          className="w-full text-muted-foreground"
          onClick={() => onConfirm(false)}
        >
          매출에서만 제외
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          돌아가기
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

/* ── 재고 부족 주문 취소 시 품절 모달 ── */
interface SoldOutConfirmModalProps {
  open: boolean;
  menuNames: string[];
  onSoldOut: () => void;
  onCancelOnly: () => void;
  onClose: () => void;
  isPending: boolean;
}

const SoldOutConfirmModal = ({
  open,
  menuNames,
  onSoldOut,
  onCancelOnly,
  onClose,
  isPending,
}: SoldOutConfirmModalProps) => (
  <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
    <AlertDialogContent className="w-full">
      <AlertDialogHeader className="w-full">
        <AlertDialogTitle className="w-full">주문을 취소할까요?</AlertDialogTitle>
        <AlertDialogDescription className="w-full">
          <div className="w-full space-y-3 text-sm text-muted-foreground">
            <p>재고가 부족한 메뉴가 포함된 주문입니다.</p>
            <div className="w-full rounded-lg border bg-muted/50 p-3 space-y-2.5">
              <p className="font-medium text-foreground">아래 메뉴를 품절 처리할까요?</p>
              <div className="flex flex-wrap gap-1.5">
                {menuNames.map((name, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-background border px-2.5 py-0.5 text-xs font-medium text-foreground"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <ul className="text-xs space-y-1">
                <li>• 품절 처리된 메뉴는 손님 주문 화면에 표시되지 않습니다.</li>
                <li>• 재고가 충분해지면 자동으로 품절이 해제됩니다.</li>
              </ul>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
        <Button
          className="h-10 w-full bg-baro-red text-white hover:bg-baro-red/80"
          onClick={onSoldOut}
          disabled={isPending}
        >
          품절 처리하고 취소
        </Button>
        <Button
          variant="outline"
          className="h-10 w-full"
          onClick={onCancelOnly}
          disabled={isPending}
        >
          그냥 취소만
        </Button>
        <Button variant="ghost" className="h-10 w-full" onClick={onClose} disabled={isPending}>
          돌아가기
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

/* ── 개별 주문 카드 ── */
interface OrderCardProps {
  order: ApiOrder;
  storeId: string;
  onCancelCompleted: (orderId: string) => void;
}

const OrderCard = ({ order, storeId, onCancelCompleted }: OrderCardProps) => {
  const { mutate: changeStatus, isPending } = useUpdateOrderStatus(storeId);
  const { mutate: updateMenu, isPending: isMarkingSoldOut } = useUpdateMenu();
  const stockWarnings = useOrderWarningsStore((s) => s.warnings[order.id]);
  const [showSoldOutModal, setShowSoldOutModal] = useState(false);

  const itemSummary = order.items?.map((i) => `${i.menu.name} x${i.quantity}`).join(' · ') ?? '';
  const orderMenuNames = order.items?.map((i) => i.menu.name) ?? [];

  const handlePendingCancel = () => {
    if (stockWarnings?.length) {
      setShowSoldOutModal(true);
    } else {
      changeStatus({ orderId: order.id, status: 'cancelled' });
    }
  };

  const handleSoldOut = () => {
    order.items?.forEach((item) => {
      updateMenu({ menuId: item.menuId, data: { isAvailable: false } });
    });
    changeStatus({ orderId: order.id, status: 'cancelled' });
    setShowSoldOutModal(false);
  };

  const handleCancelOnly = () => {
    changeStatus({ orderId: order.id, status: 'cancelled' });
    setShowSoldOutModal(false);
  };

  return (
    <>
      <div className="rounded-lg border bg-card p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">{order.tableNumber}번 테이블</span>
            <span className="text-xs text-muted-foreground shrink-0">
              #{order.id.slice(-4).toUpperCase()}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="size-3" />
            {formatTimeAgo(order.createdAt)}
          </div>
        </div>

        {/* 재고 부족 경고 배너 */}
        {stockWarnings && stockWarnings.length > 0 && (
          <div className="flex items-start gap-2 rounded-md bg-baro-red/5 border border-baro-red/30 px-3 py-2 text-xs">
            <AlertTriangle className="size-3.5 text-baro-red shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-baro-red">사장님! 수락 전 확인해 주세요.</p>
              <p className="text-baro-red/80 mt-0.5">
                {stockWarnings
                  .map(
                    (w) =>
                      `${w.ingredientName} (필요 ${w.required}${w.unit}, 가용 재고 ${w.currentStock}${w.unit})`,
                  )
                  .join(', ')}
                이 부족해요.
              </p>
            </div>
          </div>
        )}

        {itemSummary && <p className="text-xs text-muted-foreground line-clamp-2">{itemSummary}</p>}

        {order.customerNote && (
          <p className="text-xs text-muted-foreground line-clamp-2 py-1">💬 {order.customerNote}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">{order.totalPrice.toLocaleString()}원</span>
          <div className="flex gap-1.5">
            {order.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="h-7 px-2.5 text-xs bg-baro-blue text-white hover:bg-baro-blue/80"
                  disabled={isPending}
                  onClick={() => changeStatus({ orderId: order.id, status: 'preparing' })}
                >
                  수락
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs"
                  disabled={isPending}
                  onClick={handlePendingCancel}
                >
                  취소
                </Button>
              </>
            )}
            {order.status === 'preparing' && (
              <>
                <Button
                  size="sm"
                  className="h-7 px-2.5 text-xs bg-baro-blue text-white hover:bg-baro-blue/80"
                  disabled={isPending}
                  onClick={() => changeStatus({ orderId: order.id, status: 'completed' })}
                >
                  완료처리
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs"
                  disabled={isPending}
                  onClick={() => changeStatus({ orderId: order.id, status: 'cancelled' })}
                >
                  취소
                </Button>
              </>
            )}
            {order.status === 'completed' && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-xs text-muted-foreground"
                disabled={isPending}
                onClick={() => onCancelCompleted(order.id)}
              >
                취소
              </Button>
            )}
          </div>
        </div>
      </div>

      <SoldOutConfirmModal
        open={showSoldOutModal}
        menuNames={orderMenuNames}
        onSoldOut={handleSoldOut}
        onCancelOnly={handleCancelOnly}
        onClose={() => setShowSoldOutModal(false)}
        isPending={isPending || isMarkingSoldOut}
      />
    </>
  );
};

/* ── 주문 현황 카드 ── */
interface OrderStatusCardProps {
  storeId: string | null;
}

const OrderStatusCard = ({ storeId }: OrderStatusCardProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const { data: rawOrders = [], isLoading } = useOrders(storeId);
  const { mutate: changeStatus } = useUpdateOrderStatus(storeId);
  const businessDate = useClosingStore((s) => s.businessSession.businessDate);

  useOrderSSE(storeId);

  // 당일 개점 이후 접수된 주문만 표시 (createdAt은 UTC이므로 KST로 변환 후 비교)
  const toKSTDate = (isoString: string) =>
    new Date(new Date(isoString).getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const orders = businessDate
    ? rawOrders.filter((o) => toKSTDate(o.createdAt) === businessDate)
    : rawOrders;

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const filteredOrders = orders.filter((o) => o.status === activeTab);

  const handleCancelCompleted = (restoreStock: boolean) => {
    if (!cancelTarget) return;
    changeStatus({ orderId: cancelTarget, status: 'cancelled', restoreStock });
    setCancelTarget(null);
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader className="border-b shrink-0">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingBag className="size-4 text-muted-foreground" />
            오늘 주문 현황
            {pendingCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-baro-yellow text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <div className="flex border-b shrink-0">
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

        <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <ShoppingBag className="size-8 mb-2 opacity-25" />
              <p className="text-xs">{EMPTY_MESSAGE[activeTab]}</p>
            </div>
          ) : (
            filteredOrders.map((order) =>
              storeId ? (
                <OrderCard
                  key={order.id}
                  order={order}
                  storeId={storeId}
                  onCancelCompleted={setCancelTarget}
                />
              ) : null,
            )
          )}
        </CardContent>
      </Card>

      <CancelCompletedOrderModal
        open={cancelTarget !== null}
        onConfirm={handleCancelCompleted}
        onClose={() => setCancelTarget(null)}
      />
    </>
  );
};

export default OrderStatusCard;
