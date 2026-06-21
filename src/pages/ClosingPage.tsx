import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CalendarDays, CheckCircle, MoonStar, TrendingUp } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import AfterClosingModal from '@/features/closing/components/AfterClosingModal';
import ClosingInventoryDeductionSection, {
  type DeductionRow,
} from '@/features/closing/components/ClosingInventoryDeductionSection';
import ClosingSoldMenusSection from '@/features/closing/components/ClosingSoldMenusSection';
import { useClosing } from '@/features/closing/hooks/useClosing';
import { useClosingPreview } from '@/features/closing/hooks/useClosingPreview';
import useClosingStore from '@/features/closing/store/closingStore';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent } from '@/shadcn/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const storeId = useAuthStore((s) => s.storeId);
  const clearBusinessSession = useClosingStore((s) => s.clearBusinessSession);
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') ?? undefined;
  const isRetroactive = !!dateParam;

  const { data: preview, isLoading, isError } = useClosingPreview(storeId, dateParam);

  const [deductionRows, setDeductionRows] = useState<DeductionRow[]>([]);
  const [afterModalOpen, setAfterModalOpen] = useState(false);
  const [alreadyClosedModalOpen, setAlreadyClosedModalOpen] = useState(false);
  const [finalRevenue, setFinalRevenue] = useState(0);
  const [closingId, setClosingId] = useState('');
  const [closingDate, setClosingDate] = useState('');
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

    if (preview.isClosed) {
      setAlreadyClosedModalOpen(true);
      return;
    }

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
          setClosingId(res.closingId);
          setClosingDate(res.date);
          // 소급 마감은 오늘 영업 세션과 무관하므로 세션을 유지
          if (!isRetroactive) clearBusinessSession();
          void queryClient.invalidateQueries({ queryKey: ['closing', 'preview'] });
          setAfterModalOpen(true);
        },
        onError: () => {
          toast.error('마감 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !preview) {
    return (
      <div className="flex flex-col gap-4 p-4">
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="shrink-0 bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">마감하기</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{formatDate(preview.date)}</span>
            </div>
          </div>
        </div>

        {/* 소급 마감 안내 배너 */}
        {isRetroactive && (
          <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-baro-yellow/30 bg-baro-yellow/10 px-4 py-3 text-sm text-baro-yellow-text">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-baro-yellow-dark" />
            <p>
              전날 마감을 소급 처리합니다. 오늘 이미 발생한 매출과 재고 차감 순서가 실제와 다를 수
              있습니다.
            </p>
          </div>
        )}

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-4">
          {/* 총 매출 카드 */}
          <Card>
            <CardContent className="px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-baro-blue/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-baro-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {isRetroactive ? '해당일 총 매출' : '오늘 총 매출'}
                  </p>
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

        {/* 하단 버튼 */}
        <div className="shrink-0 bg-background border-t px-6 py-4">
          {preview.isClosed ? (
            <Button
              onClick={handleComplete}
              className="w-full h-12 text-base font-semibold bg-slate-200 hover:bg-slate-300 text-slate-500 flex items-center gap-2"
            >
              <MoonStar className="w-5 h-5" />
              마감 완료됨
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isPending}
              className="w-full h-12 text-base font-semibold bg-baro-blue hover:bg-baro-blue/90 text-white flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {isPending ? '마감 처리 중...' : '마감 완료'}
            </Button>
          )}
        </div>
      </div>

      {storeId && (
        <AfterClosingModal
          open={afterModalOpen}
          totalRevenue={finalRevenue}
          closingDate={closingDate}
          storeId={storeId}
          closingId={closingId}
          isRetroactive={isRetroactive}
        />
      )}

      {/* 이미 마감된 날짜에 재시도할 때 안내 모달 */}
      <Dialog open={alreadyClosedModalOpen} onOpenChange={setAlreadyClosedModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MoonStar className="w-4 h-4 text-slate-400" />
              이미 마감이 완료된 날짜입니다
            </DialogTitle>
            <DialogDescription>
              {preview && formatDate(preview.date)} 마감은 이미 처리되었습니다. 마감 취소가
              필요하다면 시스템 시작 페이지에서 진행해 주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAlreadyClosedModalOpen(false)}>
              닫기
            </Button>
            <Button
              onClick={() => navigate('/system-start')}
              className="bg-baro-blue hover:bg-baro-blue/90 text-white"
            >
              시스템 시작으로
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClosingPage;
