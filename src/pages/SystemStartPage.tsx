import { useState } from 'react';

import {
  AlertTriangle,
  Archive,
  ChevronRight,
  ClipboardList,
  Clock,
  History,
  LogIn,
  MoonStar,
  Settings,
  Store,
  Trash2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import { openBusiness } from '@/features/closing/api/closing.api';
import ClosingCancelModal from '@/features/closing/components/ClosingCancelModal';
import { useClosingHistory } from '@/features/closing/hooks/useClosingHistory';
import useClosingStore from '@/features/closing/store/closingStore';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Skeleton } from '@/shadcn/ui/skeleton';
import baroLogo from '@/shared/assets/images/baro-logo.png';
import {
  getBusinessDate,
  getTodayOpenTime,
  isTodayBusinessDay,
  todayKSTString,
} from '@/shared/utils/businessDate';

const getYesterdayKST = () => {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  kstNow.setDate(kstNow.getDate() - 1);
  return kstNow.toISOString().slice(0, 10);
};

const formatCalendarDate = () =>
  new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

const formatShortDate = (dateStr: string) => {
  const [, month, day] = dateStr.split('-').map(Number);
  const date = new Date(dateStr + 'T00:00:00');
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
};

type BusinessCase =
  | 'already-open' // A: 이미 개점한 상태 (영업 중)
  | 'normal' // B: 정상 영업 시작 가능
  | 'before-open-closed' // C: 개점 전, 전날 마감 완료
  | 'before-open-not-closed' // D: 개점 전, 전날 마감 미완료
  | 'today-closed' // E: 오늘 마감 완료
  | 'holiday-closed' // F: 휴무일 + 임시 영업 마감 완료
  | 'holiday'; // G: 휴무일, 임시 영업 가능

const SystemStartPage = () => {
  const navigate = useNavigate();
  const storeId = useAuthStore((s) => s.storeId);
  const operatingHours = useAuthStore((s) => s.operatingHours);
  const setBusinessSession = useClosingStore((s) => s.setBusinessSession);
  const businessSession = useClosingStore((s) => s.businessSession);

  const businessDate = getBusinessDate(operatingHours);
  const todayKST = todayKSTString();
  const isBeforeOpen = businessDate !== todayKST;
  const isHoliday = !isTodayBusinessDay(operatingHours);
  const todayOpenTime = getTodayOpenTime(operatingHours);

  const { data: history, isLoading } = useClosingHistory(storeId);
  const businessDateClosed =
    history?.closings.some((c) => c.date.startsWith(businessDate)) ?? false;

  // 개점 시간 이후(휴무일 제외)에만 전날 마감 누락 여부 조회
  const { data: dashboardStats } = useDashboardStats(
    !isLoading && !isBeforeOpen && !isHoliday ? storeId : null,
  );

  const [isStarting, setIsStarting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);

  const getCase = (): BusinessCase => {
    if (businessSession.isOpen && businessSession.businessDate === businessDate)
      return 'already-open';
    if (isHoliday) return businessDateClosed ? 'holiday-closed' : 'holiday';
    if (isBeforeOpen) return businessDateClosed ? 'before-open-closed' : 'before-open-not-closed';
    return businessDateClosed ? 'today-closed' : 'normal';
  };

  const currentCase = getCase();

  const handleStartBusiness = async (targetDate = businessDate) => {
    if (!storeId) return;
    setIsStarting(true);
    try {
      await openBusiness(storeId, { businessDate: targetDate });
      setBusinessSession({ isOpen: true, businessDate: targetDate });
      navigate('/dashboard');
    } catch {
      toast.error('영업 시작에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsStarting(false);
    }
  };

  const renderStatusBanner = () => {
    switch (currentCase) {
      case 'already-open':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-green-500 animate-pulse" />
            <span>현재 영업이 진행 중입니다.</span>
          </div>
        );
      case 'before-open-closed':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <Clock className="h-4 w-4 shrink-0 text-blue-500" />
            <span>
              오늘 영업은 <span className="font-semibold">{todayOpenTime}</span> 이후에 시작할 수
              있습니다.
            </span>
          </div>
        );
      case 'before-open-not-closed':
        return (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <p className="font-semibold">전날 마감이 완료되지 않았습니다.</p>
              <p className="mt-0.5 text-xs text-amber-700">
                {formatShortDate(businessDate)} 소급 마감 후 영업을 시작할 수 있습니다.
              </p>
            </div>
          </div>
        );
      case 'today-closed':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <MoonStar className="h-4 w-4 shrink-0 text-slate-400" />
            <span>오늘 영업이 마감되었습니다.</span>
          </div>
        );
      case 'holiday':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-800">
            <MoonStar className="h-4 w-4 shrink-0 text-purple-400" />
            <span>오늘은 설정된 휴무일입니다.</span>
          </div>
        );
      case 'holiday-closed':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <MoonStar className="h-4 w-4 shrink-0 text-slate-400" />
            <span>오늘 임시 영업이 마감되었습니다.</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPrimaryButton = () => {
    switch (currentCase) {
      case 'already-open':
        return (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-baro-blue hover:bg-baro-blue/90 text-white rounded-lg px-8 py-6 flex items-center justify-between transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-xl">영업 중 · 대시보드로 이동</p>
                <p className="text-sm text-white/70 mt-1">
                  {formatShortDate(businessDate)} 영업이 진행 중입니다
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-60 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        );

      case 'normal':
        return (
          <button
            onClick={() => handleStartBusiness()}
            disabled={isStarting}
            className="w-full bg-baro-blue hover:bg-baro-blue/90 disabled:opacity-60 text-white rounded-lg px-8 py-6 flex items-center justify-between transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-xl">{isStarting ? '시작 중...' : '영업 시작하기'}</p>
                <p className="text-sm text-white/70 mt-1">
                  오늘 영업을 시작하고 대시보드로 이동합니다
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-60 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        );

      case 'before-open-closed':
        return (
          <div className="w-full bg-slate-100 text-slate-400 rounded-lg px-8 py-6 flex items-center gap-4 cursor-not-allowed">
            <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-xl">영업 시작 대기 중</p>
              <p className="text-sm mt-1">{todayOpenTime} 이후에 영업을 시작할 수 있습니다</p>
            </div>
          </div>
        );

      case 'before-open-not-closed':
        return (
          <button
            onClick={() => navigate(`/closing?date=${businessDate}`)}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-8 py-6 flex items-center justify-between transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-xl">전날 마감하러 가기</p>
                <p className="text-sm text-white/80 mt-1">
                  {formatShortDate(businessDate)} 소급 마감을 진행합니다
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-60 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        );

      case 'today-closed':
      case 'holiday-closed':
        return (
          <div className="w-full bg-slate-100 text-slate-400 rounded-lg px-8 py-6 flex items-center gap-4 cursor-not-allowed">
            <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
              <MoonStar className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-xl">오늘 영업 종료</p>
              <p className="text-sm mt-1">마감이 완료되었습니다. 내일 다시 만나요</p>
            </div>
          </div>
        );

      case 'holiday':
        return (
          <button
            onClick={() => setShowHolidayModal(true)}
            disabled={isStarting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-lg px-8 py-6 flex items-center justify-between transition-colors text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-xl">임시 영업 시작하기</p>
                <p className="text-sm text-white/70 mt-1">휴무일에 임시로 영업을 시작합니다</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-60 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        );
    }
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
            <p className="text-sm text-muted-foreground">{formatCalendarDate()}</p>
            {/* 영업 날짜가 캘린더 날짜와 다를 때 (개점 전 구간) 별도 표시 */}
            {!isLoading && isBeforeOpen && !isHoliday && (
              <p className="text-xs text-muted-foreground mt-0.5">
                영업 기준일: {formatShortDate(businessDate)}
              </p>
            )}
            {!isLoading && businessDateClosed && (
              <span className="inline-block mt-1 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                {formatShortDate(businessDate)} 마감 완료
              </span>
            )}
            {/* 전날 마감 누락 알림 — already-open / normal 케이스 */}
            {!isLoading &&
              dashboardStats?.missedClosing &&
              (history?.closings.length ?? 0) > 0 &&
              (currentCase === 'already-open' || currentCase === 'normal') && (
                <Link
                  to={`/closing?date=${getYesterdayKST()}`}
                  className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full hover:bg-amber-200 transition-colors"
                >
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  전날 마감 누락
                </Link>
              )}
          </div>
        </div>

        {/* 카드들 */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
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
            {/* 상태 배너 */}
            {renderStatusBanner()}

            {/* 메인 CTA */}
            {renderPrimaryButton()}

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
                onClick={() => toast.info('이전 마감 현황 기능은 준비 중이에요.')}
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

      {/* 마감 취소 모달 */}
      {storeId && (
        <ClosingCancelModal
          open={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          storeId={storeId}
        />
      )}

      {/* 휴무일 임시 영업 확인 모달 */}
      <Dialog open={showHolidayModal} onOpenChange={setShowHolidayModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>임시 영업 시작</DialogTitle>
            <DialogDescription>
              오늘은 휴무일로 설정되어 있습니다. 그래도 영업을 시작하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHolidayModal(false)}
              disabled={isStarting}
            >
              취소
            </Button>
            <Button
              onClick={() => {
                setShowHolidayModal(false);
                handleStartBusiness(todayKST);
              }}
              disabled={isStarting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isStarting ? '시작 중...' : '임시 영업 시작'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemStartPage;
