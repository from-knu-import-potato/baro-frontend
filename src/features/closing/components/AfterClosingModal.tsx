import { Moon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useGenerateOrderGuide } from '@/features/order-guide/hooks/useGenerateOrderGuide';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';

interface AfterClosingModalProps {
  open: boolean;
  totalRevenue: number;
  storeId: string;
}

const formatCurrency = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;

const AfterClosingModal = ({ open, totalRevenue, storeId }: AfterClosingModalProps) => {
  const navigate = useNavigate();
  const { mutate: generate, isPending } = useGenerateOrderGuide(storeId);

  const handleViewNow = () => {
    generate(undefined, {
      onSuccess: () => {
        navigate('/order-guide');
      },
    });
  };

  const handleViewLater = () => {
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="text-center items-center gap-1">
          <div className="text-4xl mb-2">🎉</div>
          <DialogTitle className="text-xl">오늘 마감 완료!</DialogTitle>
          <DialogDescription className="mt-1">
            <span className="flex flex-col items-center gap-1 text-center">
              <span className="text-sm text-muted-foreground">오늘 총 매출</span>
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(totalRevenue)}
              </span>
              <span className="text-xs text-muted-foreground mt-2">
                재고 차감이 완료되었습니다. 발주 가이드를 언제 확인할까요?
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 mt-2">
          <Button
            onClick={handleViewNow}
            disabled={isPending}
            className="h-auto py-4 flex flex-col items-center gap-1.5 bg-baro-blue hover:bg-baro-blue/90 text-white"
          >
            {isPending ? (
              <span className="text-sm">AI가 분석 중이에요...</span>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">발주 가이드 즉시 보기</span>
                </span>
                <span className="text-xs opacity-80">AI가 지금 바로 발주량을 분석해요</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleViewLater}
            disabled={isPending}
            className="h-auto py-4 flex flex-col items-center gap-1.5"
          >
            <span className="flex items-center gap-1.5">
              <Moon className="w-4 h-4" />
              <span className="font-semibold">오픈 때 볼게요</span>
            </span>
            <span className="text-xs text-muted-foreground">내일 오픈 전에 확인할게요</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AfterClosingModal;
