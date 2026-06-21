import { useState } from 'react';

import { AlertTriangle, CalendarDays, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useCancelClosing } from '@/features/closing/hooks/useCancelClosing';
import { useClosingHistory } from '@/features/closing/hooks/useClosingHistory';
import type { ClosingHistoryItem } from '@/features/closing/types/closing.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shadcn/ui/alert-dialog';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Skeleton } from '@/shadcn/ui/skeleton';

interface ClosingCancelModalProps {
  open: boolean;
  onClose: () => void;
  storeId: string;
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
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
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
};

const ClosingCancelModal = ({ open, onClose, storeId }: ClosingCancelModalProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmingItem, setConfirmingItem] = useState<ClosingHistoryItem | null>(null);
  const { data: history, isLoading } = useClosingHistory(storeId);
  const { mutate: cancel, isPending } = useCancelClosing(storeId);

  const handleCancelRequest = () => {
    if (!selectedId) return;
    const item = history?.closings.find((c) => c.id === selectedId);
    if (!item) return;
    setConfirmingItem(item);
  };

  const handleConfirmCancel = () => {
    if (!confirmingItem) return;
    cancel(confirmingItem.id, {
      onSuccess: () => {
        toast.success('마감이 취소되었습니다.');
        setSelectedId(null);
        setConfirmingItem(null);
        onClose();
      },
      onError: () => {
        toast.error('마감 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        setConfirmingItem(null);
      },
    });
  };

  const handleClose = () => {
    setSelectedId(null);
    setConfirmingItem(null);
    onClose();
  };

  const daysAgo = confirmingItem ? getDaysAgo(confirmingItem.date) : 0;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-baro-red" />
              마감 취소
            </DialogTitle>
            <DialogDescription>
              취소할 마감 날짜를 선택해 주세요. 해당 날짜의 재고 차감이 원래대로 복구됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {isLoading ? (
              <>
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </>
            ) : !history?.closings.length ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                취소할 수 있는 마감 이력이 없어요.
              </div>
            ) : (
              history.closings.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors
                    ${
                      selectedId === item.id
                        ? 'border-baro-red bg-red-50 dark:bg-red-950/20'
                        : 'border-border hover:bg-muted/50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium">{formatDate(item.date)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(item.totalRevenue)}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={handleClose}
              disabled={isPending}
            >
              닫기
            </Button>
            <Button
              variant="destructive"
              className="flex-1 flex items-center gap-1.5 h-10 border-baro-red bg-baro-red/10 hover:bg-baro-red/20 text-baro-red"
              onClick={handleCancelRequest}
              disabled={!selectedId || isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              마감 취소하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 마감 취소 확인 경고 모달 */}
      <AlertDialog open={!!confirmingItem} onOpenChange={() => setConfirmingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-baro-red">
              <AlertTriangle className="w-4 h-4" />
              마감 취소 전 확인하세요
            </AlertDialogTitle>
            <AlertDialogDescription className="sr-only">마감 취소 경고</AlertDialogDescription>
            <div className="space-y-3 text-sm">
              {confirmingItem && (
                <p className="text-foreground font-medium pb-2">
                  <span className="text-baro-red font-semibold">
                    현재 날짜로부터 {daysAgo}일 전
                  </span>{' '}
                  마감({formatDate(confirmingItem.date)})입니다.
                </p>
              )}
              <div className="rounded-lg border border-baro-yellow/30 bg-baro-yellow/10 dark:bg-baro-yellow/10 dark:border-baro-yellow/30 px-4 py-3 text-baro-yellow-text dark:text-baro-yellow-text">
                <div className="flex flex-row gap-2 items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-baro-yellow-dark" />
                  <p className="font-semibold mb-1 ">복구 불가능한 작업입니다</p>
                </div>
                <p className="text-xs leading-relaxed">
                  마감을 취소하면 해당 날짜의 재고 차감이 원상 복구되지만, 이미 개점이 이루어진
                  이후이므로 <strong>마감 재진행 및 재고 재차감이 불가능합니다.</strong> 그래도
                  마감을 취소하시겠습니까?
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmingItem(null)}>돌아가기</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-baro-red hover:bg-baro-red-dark text-white"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '취소 확정'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClosingCancelModal;
