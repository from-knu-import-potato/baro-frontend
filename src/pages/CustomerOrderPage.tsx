import { useMemo, useState } from 'react';

import { useQuery, useMutation } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Loader2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  fetchStoreMenuCategories,
  fetchStoreMenus,
  fetchStoreTheme,
} from '@/features/customer-order/api/menu.api';
import { createOrder } from '@/features/customer-order/api/order.api';
import type {
  ApiMenu,
  ApiStoreTheme,
} from '@/features/customer-order/types/customerOrder.api.types';
import type { CartItem } from '@/features/customer-order/types/customerOrder.types';
import { THEME_HEX } from '@/features/store-settings/api/storeTheme.api';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Skeleton } from '@/shadcn/ui/skeleton';

const DEFAULT_THEME: ApiStoreTheme = {
  themeColor: 'blue',
  layout: 'list',
  bannerImageUrl: null,
  bannerPosition: '50% 50%',
};

/* ── 메뉴 아이템 카드 (리스트) ── */
interface MenuItemCardProps {
  item: ApiMenu;
  quantity: number;
  themeHex: string;
  onUpdate: (id: string, delta: number) => void;
}

const MenuItemListCard = ({ item, quantity, themeHex, onUpdate }: MenuItemCardProps) => (
  <div
    className={cn(
      'flex items-center gap-3 bg-white rounded-xl px-4 py-3 transition-all',
      !item.isAvailable
        ? 'opacity-50'
        : quantity > 0
          ? 'ring-2 ring-offset-0'
          : 'border border-gray-100',
    )}
    style={quantity > 0 ? ({ '--tw-ring-color': `${themeHex}40` } as React.CSSProperties) : {}}
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
    <MenuQuantityControl item={item} quantity={quantity} themeHex={themeHex} onUpdate={onUpdate} />
  </div>
);

/* ── 메뉴 아이템 카드 (그리드) ── */
const MenuItemGridCard = ({ item, quantity, themeHex, onUpdate }: MenuItemCardProps) => (
  <div
    className={cn(
      'overflow-hidden rounded-xl bg-white shadow-xs transition-all',
      !item.isAvailable ? 'opacity-50' : quantity > 0 ? 'ring-2' : 'border border-gray-100',
    )}
    style={quantity > 0 ? ({ '--tw-ring-color': `${themeHex}60` } as React.CSSProperties) : {}}
  >
    <div className="relative h-32 bg-orange-50">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-3xl select-none">☕</div>
      )}
      {!item.isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-500">
            품절
          </span>
        </div>
      )}
    </div>
    <div className="p-3">
      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
      {item.description && (
        <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{item.description}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900">{item.price.toLocaleString()}원</p>
        <MenuQuantityControl
          item={item}
          quantity={quantity}
          themeHex={themeHex}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  </div>
);

/* ── 수량 조절 버튼 (리스트·그리드 공용) ── */
const MenuQuantityControl = ({ item, quantity, themeHex, onUpdate }: MenuItemCardProps) => {
  if (!item.isAvailable) return null;
  return (
    <div className="flex items-center gap-2 shrink-0">
      {quantity > 0 ? (
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
            className="size-8 flex items-center justify-center rounded-full text-white active:scale-90 transition-transform"
            style={{ backgroundColor: themeHex }}
          >
            <Plus className="size-3.5" />
          </button>
        </>
      ) : (
        <button
          onClick={() => onUpdate(item.id, 1)}
          className="size-8 flex items-center justify-center rounded-full text-white active:scale-90 transition-transform"
          style={{ backgroundColor: themeHex }}
        >
          <Plus className="size-3.5" />
        </button>
      )}
    </div>
  );
};

const PREVIEW_COUNT = 2;

/* ── 주문 성공 화면 ── */
interface OrderSuccessProps {
  orderId: string;
  totalAmount: number;
  items: CartItem[];
  themeHex: string;
  onReorder: () => void;
}

const OrderSuccess = ({ orderId, totalAmount, items, themeHex, onReorder }: OrderSuccessProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > PREVIEW_COUNT;
  const visibleItems = expanded ? items : items.slice(0, PREVIEW_COUNT);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 gap-4">
      <div
        className="size-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: themeHex }}
      >
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
            <span className="font-bold" style={{ color: themeHex }}>
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </CardContent>
      </Card>
      <Button
        className="w-full max-w-xs text-white rounded-xl h-11 text-sm font-semibold"
        style={{ backgroundColor: themeHex }}
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

  const [activeTab, setActiveTab] = useState<string>('all');
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

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['public-menu-categories', storeId],
    queryFn: () => fetchStoreMenuCategories(storeId!),
    enabled: !!storeId,
  });

  const { data: theme = DEFAULT_THEME } = useQuery({
    queryKey: ['public-store-theme', storeId],
    queryFn: () => fetchStoreTheme(storeId!),
    enabled: !!storeId,
  });

  const themeHex = THEME_HEX[theme.themeColor];

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

  const tabs = useMemo(() => {
    const base = [{ key: 'all', label: '전체' }];
    const categoryTabs = categories.map((cat) => ({ key: cat.id, label: cat.name }));
    return [...base, ...categoryTabs, { key: 'available', label: '주문 가능' }];
  }, [categories]);

  const visibleMenu = useMemo(() => {
    if (activeTab === 'available') return menus.filter((m) => m.isAvailable);
    if (activeTab === 'all') return menus;
    return menus.filter((m) => m.categoryId === activeTab);
  }, [menus, activeTab]);

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
        themeHex={themeHex}
        onReorder={() => setSuccessInfo(null)}
      />
    );
  }

  const isLoading = isMenuLoading || isCategoriesLoading;

  return (
    <div className="h-svh bg-gray-50 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header
        className="shrink-0 px-5 py-4 flex items-center justify-between gap-3"
        style={{ backgroundColor: themeHex }}
      >
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

      {/* 배너 이미지 */}
      {theme.bannerImageUrl && (
        <div className="shrink-0 h-36 w-full overflow-hidden">
          <img
            src={theme.bannerImageUrl}
            alt="가게 배너"
            className="h-full w-full object-cover"
            style={{ objectPosition: theme.bannerPosition ?? '50% 50%' }}
          />
        </div>
      )}

      {/* 카테고리 탭 */}
      <div className="shrink-0 bg-white border-b">
        <div className="flex overflow-x-auto scrollbar-none px-4">
          {isCategoriesLoading
            ? [1, 2, 3].map((i) => <Skeleton key={i} className="my-3 mr-2 h-5 w-16 shrink-0" />)
            : tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
                  style={
                    activeTab === tab.key
                      ? { borderBottomColor: themeHex, color: themeHex }
                      : { borderBottomColor: 'transparent', color: '#9ca3af' }
                  }
                >
                  {tab.label}
                </button>
              ))}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className={cn('flex-1 overflow-y-auto pt-3', totalItems > 0 ? 'pb-28' : 'pb-4')}>
        <div
          className={
            theme.layout === 'grid'
              ? 'px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
              : 'px-4 space-y-2'
          }
        >
          {isLoading ? (
            theme.layout === 'grid' ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-52 w-full rounded-xl" />
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))
            )
          ) : isMenuError ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <AlertCircle className="size-10 opacity-40" />
              <p className="text-sm">메뉴를 불러오지 못했어요.</p>
              <p className="text-xs">잠시 후 다시 시도해 주세요.</p>
            </div>
          ) : visibleMenu.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-sm">주문 가능한 메뉴가 없어요.</p>
            </div>
          ) : theme.layout === 'grid' ? (
            visibleMenu.map((item) => (
              <MenuItemGridCard
                key={item.id}
                item={item}
                quantity={cart[item.id] ?? 0}
                themeHex={themeHex}
                onUpdate={updateCart}
              />
            ))
          ) : (
            visibleMenu.map((item) => (
              <MenuItemListCard
                key={item.id}
                item={item}
                quantity={cart[item.id] ?? 0}
                themeHex={themeHex}
                onUpdate={updateCart}
              />
            ))
          )}
        </div>
      </div>

      {/* 장바구니 바 */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full h-12 text-white rounded-xl text-sm font-semibold flex items-center justify-between px-5 active:opacity-90 transition-opacity"
            style={{ backgroundColor: themeHex }}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="size-4" style={{ color: themeHex }} />
              주문 확인
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl bg-gray-50 px-4 py-3 space-y-2">
              <div className="max-h-40 overflow-y-auto space-y-2">
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
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold">
                <span className="text-gray-900">합계</span>
                <span style={{ color: themeHex }}>{totalAmount.toLocaleString()}원</span>
              </div>
            </div>
            {tableNumber && (
              <div
                className="flex items-center justify-between rounded-xl px-4 py-2.5"
                style={{ backgroundColor: `${themeHex}14` }}
              >
                <span className="text-sm text-gray-500">테이블 번호</span>
                <span className="text-sm font-semibold" style={{ color: themeHex }}>
                  {tableNumber}번 테이블
                </span>
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
              className="w-full text-white rounded-xl h-11 text-sm font-semibold"
              style={{ backgroundColor: themeHex }}
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
