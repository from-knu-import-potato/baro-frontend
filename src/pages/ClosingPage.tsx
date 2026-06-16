import { useState } from 'react';

import { CalendarDays, CheckCircle, TrendingUp } from 'lucide-react';

import useAuthStore from '@/features/auth/store/authStore';
import AfterClosingModal from '@/features/closing/components/AfterClosingModal';
import ClosingInventoryDeductionSection, {
  type DeductionRow,
} from '@/features/closing/components/ClosingInventoryDeductionSection';
import ClosingSoldMenusSection from '@/features/closing/components/ClosingSoldMenusSection';
import { useClosing } from '@/features/closing/hooks/useClosing';
import { useClosingPreview } from '@/features/closing/hooks/useClosingPreview';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import { Skeleton } from '@/shadcn/ui/skeleton';

const formatCurrency = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

const ClosingPage = () => {
  const storeId = useAuthStore((s) => s.storeId);
  const { data: preview, isLoading, isError } = useClosingPreview(storeId);

  const [deductionRows, setDeductionRows] = useState<DeductionRow[]>([]);
  const [afterModalOpen, setAfterModalOpen] = useState(false);
  const [finalRevenue, setFinalRevenue] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const { mutate: submitClosing, isPending } = useClosing(storeId ?? '');

  if (preview && !isInitialized) {
    setDeductionRows(
      preview.inventoryDeductions.map((d) => ({
        ...d,
        actualUsage: d.theoreticalUsage,
      })),
    );
    setIsInitialized(true);
  }

  const handleDeductionChange = (ingredientId: string, actualUsage: number) => {
    setDeductionRows((prev) =>
      prev.map((row) => (row.ingredientId === ingredientId ? { ...row, actualUsage } : row)),
    );
  };

  const handleComplete = () => {
    if (!storeId || !preview) return;

    submitClosing(
      {
        date: preview.date,
        inventoryDeductions: deductionRows.map(({ ingredientId, actualUsage }) => ({
          ingredientId,
          actualUsage,
        })),
      },
      {
        onSuccess: (res) => {
          setFinalRevenue(res.totalRevenue);
          setAfterModalOpen(true);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !preview) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              마감 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-full">
        {/* 고정 헤더 */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold">마감하기</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{formatDate(preview.date)}</span>
            </div>
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 flex flex-col gap-6 p-6 pb-28">
          {/* 총 매출 카드 */}
          <Card className="bg-linear-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-baro-blue/30">
            <CardContent className="py-5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-baro-blue/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-baro-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">오늘 총 매출</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(preview.totalRevenue)}
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>판매 메뉴 {preview.soldMenus.length}종</p>
                <p>
                  총 {preview.soldMenus.reduce((acc, m) => acc + m.quantity, 0).toLocaleString()}건
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 판매 메뉴 섹션 */}
          <ClosingSoldMenusSection menus={preview.soldMenus} />

          {/* 재고 차감 섹션 */}
          <ClosingInventoryDeductionSection rows={deductionRows} onChange={handleDeductionChange} />
        </div>

        {/* 고정 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t px-6 py-4">
          <Button
            onClick={handleComplete}
            disabled={isPending}
            className="w-full h-12 text-base font-semibold bg-baro-blue hover:bg-baro-blue/90 text-white flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {isPending ? '마감 처리 중...' : '마감 완료'}
          </Button>
        </div>
      </div>

      {storeId && (
        <AfterClosingModal open={afterModalOpen} totalRevenue={finalRevenue} storeId={storeId} />
      )}
    </>
  );
};

export default ClosingPage;
