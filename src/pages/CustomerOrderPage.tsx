import { useState } from 'react';

import { useQuery, useMutation } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Loader2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';

import { fetchStoreMenus } from '@/features/customer-order/api/menu.api';
import { createOrder } from '@/features/customer-order/api/order.api';
import type { ApiMenu } from '@/features/customer-order/types/customerOrder.api.types';
import type { CartItem } from '@/features/customer-order/types/customerOrder.types';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Skeleton } from '@/shadcn/ui/skeleton';

type CategoryTab = 'all' | 'available';

/* ── 메뉴 아이템 카드 ── */
interface MenuItemCardProps {
  item: ApiMenu;
  quantity: number;
  onUpdate: (id: string, delta: number) => void;
}

const MenuItemCard = ({ item, quantity, onUpdate }: MenuItemCardProps) => (
  <div
    className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 transition-all ${
      !item.isAvailable
        ? 'opacity-50'
        : quantity > 0
          ? 'ring-2 ring-baro-blue/25'
          : 'border border-gray-100'
    }`}
  >
    {item.imageUrl ? (
      <img
        src={item.imageUrl}
        alt={item.name}
        className="size-16 rounded-lg object-cover shrink-0"
      />
    ) : (
      <div className="size-16 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 text-2xl select-none">
        ☕
      </div>
    )}

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
        {!item.isAvailable && (
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
            품절
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.description}</p>
      )}
      <p className="text-sm font-bold text-gray-900 mt-1.5">{item.price.toLocaleString()}원</p>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {!item.isAvailable ? null : quantity > 0 ? (
        <>
          <button
            onClick={() => onUpdate(item.id, -1)}
            className="size-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 active:scale-90 transition-transform"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-4 text-center text-sm font-bold text-gray-900">{quantity}</span>
          <button
            onClick={() => onUpdate(item.id, 1)}
            className="size-8 flex items-center justify-center rounded-full bg-baro-blue text-white active:scale-90 transition-transform"
          >
            <Plus className="size-3.5" />
          </button>
        </>
      ) : (
        <button
          onClick={() => onUpdate(item.id, 1)}
          className="size-8 flex items-center justify-center rounded-full bg-baro-blue text-white active:scale-90 transition-transform"
        >
          <Plus className="size-3.5" />
        </button>
      )}
    </div>
  </div>
);

const PREVIEW_COUNT = 2;

/* ── 주문 성공 화면 ── */
interface OrderSuccessProps {
  orderId: string;
  totalAmount: number;
  items: CartItem[];
  onReorder: () => void;
}

const OrderSuccess = ({ orderId, totalAmount, items, onReorder }: OrderSuccessProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > PREVIEW_COUNT;
  const visibleItems = expanded ? items : items.slice(0, PREVIEW_COUNT);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 gap-4">
      <div className="size-14 rounded-full bg-baro-blue flex items-center justify-center">
        <CheckCircle className="size-7 text-white" strokeWidth={2.5} />
      </div>

      <div className="text-center">
        <h1 className="text-lg font-bold text-gray-900">주문 접수 완료</h1>
        <p className="text-sm text-gray-400 mt-1">사장님이 곧 준비를 시작할 거예요</p>
      </div>

      <Card className="w-full max-w-xs">
        <CardContent className="px-5 py-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">주문번호</span>
            <span className="font-bold text-gray-900">#{orderId}</span>
          </div>
          <div className="border-t pt-3 space-y-2">
            {visibleItems.map((item) => (
              <div key={item.menuItemId} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">
                  {item.name}
                  <span className="text-gray-400 ml-1">× {item.quantity}</span>
                </span>
                <span className="text-gray-500">
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            ))}
            {hasMore && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full text-xs text-gray-400 hover:text-gray-600 pt-1 transition-colors"
              >
                {expanded ? '접기 ↑' : `+${items.length - PREVIEW_COUNT}개 더 보기 ↓`}
              </button>
            )}
          </div>
          <div className="border-t pt-3 flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">합계</span>
            <span className="font-bold text-baro-blue">{totalAmount.toLocaleString()}원</span>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full max-w-xs bg-baro-blue text-white hover:bg-baro-blue/90 rounded-xl h-11 text-sm font-semibold"
        onClick={onReorder}
      >
        다시 주문하기
      </Button>
    </div>
  );
};

/* ── 메인 페이지 ── */
const CustomerOrderPage = () => {
  const { shopId: storeId } = useParams<{ shopId: string }>();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table');

  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  const [successInfo, setSuccessInfo] = useState<{
    orderId: string;
    totalAmount: number;
    items: CartItem[];
  } | null>(null);

  const {
    data: menus = [],
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useQuery({
    queryKey: ['public-menus', storeId],
    queryFn: () => fetchStoreMenus(storeId!),
    enabled: !!storeId,
  });

  const orderMutation = useMutation({
    mutationFn: (data: Parameters<typeof createOrder>[1]) => createOrder(storeId!, data),
    onSuccess: (order) => {
      const cartItems: CartItem[] = menus
        .filter((item) => (cart[item.id] ?? 0) > 0)
        .map((item) => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: cart[item.id]!,
          imageUrl: item.imageUrl ?? undefined,
        }));

      setIsCheckoutOpen(false);
      setSuccessInfo({
        orderId: order.id.slice(-4).toUpperCase(),
        totalAmount: order.totalPrice,
        items: cartItems,
      });
      setCart({});
      setCustomerNote('');
    },
  });

  const visibleMenu = activeTab === 'available' ? menus.filter((m) => m.isAvailable) : menus;

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalAmount = menus.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);

  const updateCart = (itemId: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[itemId] ?? 0) + delta;
      if (newQty <= 0) delete next[itemId];
      else next[itemId] = newQty;
      return next;
    });
  };

  const handleOrder = () => {
    if (!tableNumber) return;
    const items = menus
      .filter((item) => (cart[item.id] ?? 0) > 0)
      .map((item) => ({ menuId: item.id, quantity: cart[item.id]! }));

    orderMutation.mutate({ tableNumber: Number(tableNumber), items });
  };

  if (successInfo) {
    return (
      <OrderSuccess
        orderId={successInfo.orderId}
        totalAmount={successInfo.totalAmount}
        items={successInfo.items}
        onReorder={() => setSuccessInfo(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-baro-blue px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white/20 flex items-center justify-center text-lg select-none shrink-0">
            🍽️
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">주문하기</p>
            <p className="text-xs text-white/60 mt-1">메뉴를 선택해 주세요</p>
          </div>
        </div>
        {tableNumber && (
          <div className="bg-white/20 rounded-lg px-3 py-1.5 text-right shrink-0">
            <p className="text-xs text-white/70 leading-none">테이블</p>
            <p className="text-sm font-bold text-white leading-tight mt-0.5">{tableNumber}번</p>
          </div>
        )}
      </header>

      {/* 카테고리 탭 */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="flex px-4">
          {(
            [
              { key: 'all', label: '전체' },
              { key: 'available', label: '주문 가능' },
            ] as { key: CategoryTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-baro-blue text-baro-blue'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="px-4 pt-3 pb-28 space-y-2">
        {isMenuLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : isMenuError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <AlertCircle className="size-10 opacity-40" />
            <p className="text-sm">메뉴를 불러오지 못했어요.</p>
            <p className="text-xs">잠시 후 다시 시도해 주세요.</p>
          </div>
        ) : visibleMenu.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-sm">주문 가능한 메뉴가 없어요.</p>
          </div>
        ) : (
          visibleMenu.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={cart[item.id] ?? 0}
              onUpdate={updateCart}
            />
          ))
        )}
      </div>

      {/* 장바구니 바 */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full h-12 bg-baro-blue text-white rounded-xl text-sm font-semibold flex items-center justify-between px-5 active:opacity-90 transition-opacity"
          >
            <span className="size-6 flex items-center justify-center rounded-full bg-white/25 text-xs font-bold">
              {totalItems}
            </span>
            <span>주문하기</span>
            <span className="font-bold">{totalAmount.toLocaleString()}원</span>
          </button>
        </div>
      )}

      {/* 주문 확인 모달 */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="size-4 text-baro-blue" />
              주문 확인
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl bg-gray-50 px-4 py-3 space-y-2">
              {menus
                .filter((item) => (cart[item.id] ?? 0) > 0)
                .map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {item.name} <span className="text-gray-400">× {cart[item.id]}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      {((cart[item.id] ?? 0) * item.price).toLocaleString()}원
                    </span>
                  </div>
                ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold">
                <span className="text-gray-900">합계</span>
                <span className="text-baro-blue">{totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            {tableNumber && (
              <div className="flex items-center justify-between rounded-xl bg-baro-blue/8 px-4 py-2.5">
                <span className="text-sm text-gray-500">테이블 번호</span>
                <span className="text-sm font-semibold text-baro-blue">{tableNumber}번 테이블</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="customer-note" className="text-sm text-gray-700">
                요청사항 <span className="text-gray-400 font-normal">(선택)</span>
              </Label>
              <Input
                id="customer-note"
                placeholder="예: 얼음 적게 주세요"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                className="h-10"
              />
            </div>

            <Button
              className="w-full bg-baro-blue text-white hover:bg-baro-blue/90 rounded-xl h-11 text-sm font-semibold"
              onClick={handleOrder}
              disabled={orderMutation.isPending}
            >
              {orderMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `주문하기 · ${totalAmount.toLocaleString()}원`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerOrderPage;
