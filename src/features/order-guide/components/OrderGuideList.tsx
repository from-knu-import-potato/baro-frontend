import { useState } from 'react';

import {
  AlertTriangle,
  CalendarDays,
  Clock,
  ClipboardList,
  Package,
  ShoppingCart,
  Siren,
} from 'lucide-react';

import type { OrderGuideItem, UrgencyLevel } from '@/features/order-guide/types/orderGuide.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';

interface OrderGuideListProps {
  items: OrderGuideItem[];
  generatedAt?: string | null;
}

type FilterTab = 'all' | UrgencyLevel;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'critical', label: '긴급' },
  { key: 'warning', label: '주의' },
  { key: 'expiry', label: '만료' },
  { key: 'recommend', label: '권장' },
];

const URGENCY_CONFIG: Record<
  UrgencyLevel,
  { label: string; badgeClass: string; rowClass: string; icon: React.ReactNode }
> = {
  critical: {
    label: '긴급',
    badgeClass:
      'bg-red-100 text-baro-red border border-red-200 dark:bg-red-950/40 dark:text-red-400',
    rowClass: 'border-l-4 border-l-baro-red/50',
    icon: <Siren className="w-3.5 h-3.5" />,
  },
  warning: {
    label: '주의',
    badgeClass: 'bg-baro-yellow/10 text-baro-yellow-dark border border-baro-yellow',
    rowClass: 'border-l-4 border-l-baro-yellow/50',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  expiry: {
    label: '만료',
    badgeClass:
      'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400',
    rowClass: 'border-l-4 border-l-orange-400/50',
    icon: <CalendarDays className="w-3.5 h-3.5" />,
  },
  recommend: {
    label: '권장',
    badgeClass:
      'bg-blue-100 text-baro-blue-dark border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400',
    rowClass: 'border-l-4 border-l-baro-blue/50',
    icon: <ShoppingCart className="w-3.5 h-3.5" />,
  },
};

const formatStock = (qty: number, unit: string) => `${qty.toLocaleString()} ${unit}`;

const OrderGuideList = ({ items, generatedAt }: OrderGuideListProps) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredItems =
    activeTab === 'all' ? items : items.filter((item) => item.urgency === activeTab);

  const countByUrgency = (urgency: UrgencyLevel) =>
    items.filter((item) => item.urgency === urgency).length;

  return (
    <Card className="flex-1 min-h-0 gap-0 pb-0">
      {/* 고정 헤더: 타이틀 + 필터 탭 */}
      <CardHeader className="border-b pb-0 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            발주 가이드
            <span className="text-xs font-normal text-muted-foreground">
              — 총 {items.length}개 품목
            </span>
          </CardTitle>
        </div>

        <div className="flex gap-1 overflow-x-auto">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === 'all' ? items.length : countByUrgency(tab.key as UrgencyLevel);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center whitespace-nowrap px-2.5 py-2 text-xs font-medium rounded-t-md border-b-2 transition-colors
                  ${
                    isActive
                      ? 'border-b-baro-blue text-baro-blue-dark bg-blue-50/50 dark:bg-blue-950/20'
                      : 'border-b-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                {tab.label}
                <span
                  className={`ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold
                  ${
                    isActive
                      ? 'bg-baro-blue text-white'
                      : tab.key === 'critical' && count > 0
                        ? 'bg-red-100 text-baro-red'
                        : tab.key === 'expiry' && count > 0
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-muted text-muted-foreground'
                  }
                `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* 스크롤 영역 */}
      <CardContent className="p-0 flex-1 min-h-0 overflow-y-auto flex flex-col">
        {filteredItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            {generatedAt === null ? (
              <>
                <ClipboardList className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">아직 발주 가이드가 없어요</p>
                <p className="text-xs text-muted-foreground mt-1">
                  마감을 완료하면 AI가 자동으로 발주 가이드를 생성해 드려요.
                </p>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">해당 조건의 발주 항목이 없어요.</span>
            )}
          </div>
        ) : (
          <>
            {/* 고정 컬럼 헤더 (스크롤 내 sticky) */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_3fr_80px] gap-4 px-5 py-2.5 bg-background border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide sticky top-0 z-10">
              <span>재료명</span>
              <span>현재 재고</span>
              <span>안전 재고 기준</span>
              <span>권장 발주량</span>
              <span>발주 이유</span>
              <span className="text-center">긴급도</span>
            </div>

            {/* 항목 리스트 */}
            <div className="divide-y">
              {filteredItems.map((item) => {
                const config = URGENCY_CONFIG[item.urgency];

                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_3fr_80px] gap-3 md:gap-4 px-5 py-4 hover:bg-muted/20 transition-colors ${config.rowClass}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                      {item.expiryDate && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-baro-red mt-0.5">
                          <Clock className="w-3 h-3" />
                          유통기한 {item.expiryDate}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="md:hidden text-xs text-muted-foreground mb-0.5">
                        현재 재고
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formatStock(item.currentStock, item.currentStockUnit)}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="md:hidden text-xs text-muted-foreground mb-0.5">
                        안전 재고
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatStock(item.safetyStock, item.safetyStockUnit)}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center gap-0.5">
                      <span className="md:hidden text-xs text-muted-foreground mb-0.5">
                        권장 발주량
                      </span>
                      {item.urgency === 'recommend' ? (
                        <span className="text-sm text-muted-foreground">소진 후 재발주</span>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-baro-blue-dark">
                            {formatStock(item.recommendedOrderQty, item.recommendedOrderUnit)}
                          </span>
                          {item.purchaseConversions.map((c) => (
                            <span key={c.purchaseUnit} className="text-xs text-muted-foreground">
                              약 {c.purchaseAmount} × {c.purchaseUnit} ({c.factor.toLocaleString()}
                              {item.recommendedOrderUnit})
                            </span>
                          ))}
                        </>
                      )}
                    </div>

                    <div className="flex flex-col justify-center gap-1">
                      <span className="md:hidden text-xs text-muted-foreground">발주 이유</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.reason}</p>
                      {item.lastOrderDate && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/70">
                          <CalendarDays className="w-3 h-3" />
                          마지막 입고 {item.lastOrderDate}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-start md:justify-center pt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.badgeClass}`}
                      >
                        {config.icon}
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderGuideList;
