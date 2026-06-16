import { useState } from 'react';

import {
  Archive,
  ChevronRight,
  ClipboardList,
  History,
  LogIn,
  Settings,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import ClosingCancelModal from '@/features/closing/components/ClosingCancelModal';
import { useClosingStatus } from '@/features/closing/hooks/useClosingStatus';
import { Skeleton } from '@/shadcn/ui/skeleton';
import baroLogo from '@/shared/assets/images/baro-logo.png';

const formatToday = () =>
  new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

const SystemStartPage = () => {
  const navigate = useNavigate();
  const storeId = useAuthStore((s) => s.storeId);
  const { isCompleted, isLoading, refetch } = useClosingStatus(storeId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleStartBusiness = async () => {
    setIsChecking(true);
    try {
      const result = await refetch();
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const todayClosing = result.data?.closings.find((c) => c.date.startsWith(today));

      if (todayClosing) {
        toast.error(
          '이미 오늘 마감이 완료되었습니다. 마감을 취소하면 다시 영업을 시작할 수 있어요.',
        );
        return;
      }
      navigate('/dashboard');
    } finally {
      setIsChecking(false);
    }
  };

  const handleViewHistory = () => {
    toast.info('이전 마감 현황 기능은 준비 중이에요.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-background px-10 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* 로고 & 날짜 */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <img src={baroLogo} alt="BARO" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-foreground leading-none">BARO</h1>
              <p className="text-xs text-muted-foreground mt-0.5">통합 가게 운영 솔루션</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{formatToday()}</p>
            {!isLoading && isCompleted && (
              <span className="inline-block mt-1 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                마감 완료
              </span>
            )}
          </div>
        </div>

        {/* 카드들 */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-36 rounded-lg" />
              <Skeleton className="h-36 rounded-lg" />
              <Skeleton className="h-36 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-36 rounded-lg" />
              <Skeleton className="h-36 rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 영업 시작하기 */}
            <button
              onClick={handleStartBusiness}
              disabled={isChecking}
              className="w-full bg-baro-blue hover:bg-baro-blue/90 disabled:opacity-60 text-white rounded-lg px-8 py-6 flex items-center justify-between transition-colors text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <LogIn className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-xl">{isChecking ? '확인 중...' : '영업 시작하기'}</p>
                  <p className="text-sm text-white/70 mt-1">
                    오늘 영업을 시작하고 대시보드로 이동합니다
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 opacity-60 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* 3열: 재고 현황, 발주 가이드, 마감 현황 */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/inventory')}
                className="bg-white dark:bg-card border border-border hover:border-baro-green/40 hover:bg-baro-green/5 rounded-lg p-5 flex flex-col gap-4 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-baro-green/10 flex items-center justify-center">
                  <Archive className="w-5 h-5 text-baro-green" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">재고 현황</p>
                  <p className="text-xs text-muted-foreground mt-1">현재 식자재 재고 확인</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/order-guide')}
                className="bg-white dark:bg-card border border-border hover:border-purple-300/50 hover:bg-purple-50/60 dark:hover:bg-purple-950/20 rounded-lg p-5 flex flex-col gap-4 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100/70 dark:bg-purple-950/30 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">발주 가이드</p>
                  <p className="text-xs text-muted-foreground mt-1">AI 발주 추천 확인</p>
                </div>
              </button>

              <button
                onClick={handleViewHistory}
                className="bg-white dark:bg-card border border-border hover:border-baro-blue/40 hover:bg-baro-blue/5 rounded-lg p-5 flex flex-col gap-4 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-baro-blue/10 flex items-center justify-center">
                  <History className="w-5 h-5 text-baro-blue" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">마감 현황</p>
                  <p className="text-xs text-muted-foreground mt-1">이전 마감 날짜 및 매출</p>
                </div>
              </button>
            </div>

            {/* 2열: 마감 취소, 설정 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-white dark:bg-card border border-border hover:border-baro-red/40 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg p-5 flex flex-col gap-4 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-baro-red/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-baro-red" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">마감 취소</p>
                  <p className="text-xs text-muted-foreground mt-1">마감 이력 삭제 및 재고 복구</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/store-settings')}
                className="bg-white dark:bg-card border border-border hover:bg-muted/50 rounded-lg p-5 flex flex-col gap-4 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">설정</p>
                  <p className="text-xs text-muted-foreground mt-1">가게 정보 및 메뉴 설정</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {storeId && (
        <ClosingCancelModal
          open={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          storeId={storeId}
        />
      )}
    </div>
  );
};

export default SystemStartPage;
