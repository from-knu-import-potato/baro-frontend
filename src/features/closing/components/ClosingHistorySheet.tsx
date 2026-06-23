import { useState } from 'react';

import { ArrowLeft, CalendarDays, History, Package, ShoppingBag } from 'lucide-react';

import { useClosingDetail } from '@/features/closing/hooks/useClosingDetail';
import { useClosingHistory } from '@/features/closing/hooks/useClosingHistory';
import type { ClosingHistoryItem } from '@/features/closing/types/closing.types';
import { Separator } from '@/shadcn/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import { Skeleton } from '@/shadcn/ui/skeleton';

interface ClosingHistorySheetProps {
  open: boolean;
  onClose: () => void;
  storeId: string | null;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

const formatCurrency = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;

const getDaysAgo = (dateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  target.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
};

interface DetailViewProps {
  storeId: string | null;
  item: ClosingHistoryItem;
  onBack: () => void;
}

const DetailView = ({ storeId, item, onBack }: DetailViewProps) => {
  const { data: detail, isLoading } = useClosingDetail(storeId, item.id);
  const daysAgo = getDaysAgo(item.date);

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </button>
        <SheetTitle className="text-left">{formatDate(item.date)}</SheetTitle>
        <SheetDescription className="text-left">
          {daysAgo === 0 ? '오늘' : `${daysAgo}일 전`} 마감 ·{' '}
          <span className="font-semibold text-foreground">{formatCurrency(item.totalRevenue)}</span>
        </SheetDescription>
      </SheetHeader>

      <Separator />

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !detail ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            마감 상세 정보를 불러오지 못했습니다.
          </p>
        ) : (
          <>
            {/* 판매 메뉴 */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <ShoppingBag className="w-4 h-4 text-baro-blue" />
                판매 메뉴
              </h3>
              {detail.soldMenus.length === 0 ? (
                <p className="text-sm text-muted-foreground pl-6">판매 내역이 없습니다.</p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground">
                        <th className="text-left px-3 py-2 font-medium">메뉴</th>
                        <th className="text-right px-3 py-2 font-medium">수량</th>
                        <th className="text-right px-3 py-2 font-medium">단가</th>
                        <th className="text-right px-3 py-2 font-medium">소계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.soldMenus.map((menu) => (
                        <tr key={menu.menuId} className="border-t">
                          <td className="px-3 py-2.5 font-medium">{menu.menuName}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {menu.quantity}잔
                          </td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {formatCurrency(menu.unitPrice)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-medium">
                            {formatCurrency(menu.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t bg-muted/30">
                        <td
                          colSpan={3}
                          className="px-3 py-2.5 text-right text-sm font-semibold text-muted-foreground"
                        >
                          총 매출
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-baro-blue">
                          {formatCurrency(detail.totalRevenue)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </section>

            {/* 재고 차감 내역 */}
            <section>
              <h3 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Package className="w-4 h-4 text-baro-green" />
                재고 차감 내역
              </h3>
              {detail.inventoryDeductions.length === 0 ? (
                <p className="text-sm text-muted-foreground pl-6">차감된 재고가 없습니다.</p>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground">
                        <th className="text-left px-3 py-2 font-medium">식자재</th>
                        <th className="text-right px-3 py-2 font-medium">사용량</th>
                        <th className="text-right px-3 py-2 font-medium">차감 후 재고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.inventoryDeductions.map((deduction) => (
                        <tr key={deduction.ingredientId} className="border-t">
                          <td className="px-3 py-2.5 font-medium">{deduction.ingredientName}</td>
                          <td className="px-3 py-2.5 text-right text-muted-foreground">
                            {deduction.usedAmount.toLocaleString('ko-KR')}
                            {deduction.unit}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            {deduction.remainingStock.toLocaleString('ko-KR')}
                            {deduction.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const ClosingHistorySheet = ({ open, onClose, storeId }: ClosingHistorySheetProps) => {
  const [selectedItem, setSelectedItem] = useState<ClosingHistoryItem | null>(null);
  const { data: history, isLoading } = useClosingHistory(storeId);

  const handleClose = () => {
    setSelectedItem(null);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        {selectedItem ? (
          <DetailView storeId={storeId} item={selectedItem} onBack={() => setSelectedItem(null)} />
        ) : (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
              <SheetTitle className="flex items-center gap-2">
                <History className="w-4 h-4" />
                이전 마감 현황
              </SheetTitle>
              <SheetDescription>날짜를 선택하면 상세 내역을 확인할 수 있습니다.</SheetDescription>
            </SheetHeader>

            <Separator />

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </>
              ) : !history?.closings.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                  <History className="w-8 h-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">아직 마감 이력이 없습니다.</p>
                </div>
              ) : (
                history.closings.map((item) => {
                  const daysAgo = getDaysAgo(item.date);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="w-full flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{formatDate(item.date)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {daysAgo === 0 ? '오늘' : `${daysAgo}일 전`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatCurrency(item.totalRevenue)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground transition-colors">
                          상세보기 →
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ClosingHistorySheet;
