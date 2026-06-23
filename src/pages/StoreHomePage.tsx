import { useState } from 'react';

import {
  AlertTriangle,
  Archive,
  ClipboardList,
  Clock,
  History,
  LogIn,
  MoonStar,
  Settings,
  Store,
  Trash2,
  UserCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { openBusiness } from '@/features/closing/api/closing.api';
import ClosingCancelModal from '@/features/closing/components/ClosingCancelModal';
import ClosingHistorySheet from '@/features/closing/components/ClosingHistorySheet';
import { useClosingHistory } from '@/features/closing/hooks/useClosingHistory';
import useClosingStore from '@/features/closing/store/closingStore';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { useMyStores } from '@/features/store-registration/hooks/useMyStores';
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

const StoreHomePage = () => {
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

  const { data: stores } = useMyStores();
  const currentStore = stores?.find((s) => s.storeId === storeId);

  const { data: history, isLoading } = useClosingHistory(storeId);
  const businessDateClosed =
    history?.closings.some((c) => c.date.startsWith(businessDate)) ?? false;

  // 개점 시간 이후(휴무일 제외)에만 전날 마감 누락 여부 조회
  const { data: dashboardStats } = useDashboardStats(
    !isLoading && !isBeforeOpen && !isHoliday ? storeId : null,
  );

  const [isStarting, setIsStarting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showHistorySheet, setShowHistorySheet] = useState(false);
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
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800/40 dark:bg-green-950/30 dark:text-green-400">
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-green-500 animate-pulse" />
            <span>현재 영업이 진행 중입니다.</span>
          </div>
        );
      case 'before-open-closed':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-400">
            <Clock className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
            <span>
              오늘 영업은 <span className="font-semibold">{todayOpenTime}</span> 이후에 시작할 수
              있습니다.
            </span>
          </div>
        );
      case 'before-open-not-closed':
        return (
          <div className="flex items-start gap-3 rounded-lg border border-baro-yellow/30 bg-baro-yellow/10 px-4 py-3 text-sm text-baro-yellow-text">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-baro-yellow-dark" />
            <div>
              <p className="font-semibold">전날 마감이 완료되지 않았습니다.</p>
              <p className="mt-0.5 text-xs text-baro-yellow-text">
                {formatShortDate(businessDate)} 소급 마감 후 영업을 시작할 수 있습니다.
              </p>
            </div>
          </div>
        );
      case 'today-closed':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
            <MoonStar className="h-4 w-4 shrink-0 text-slate-400" />
            <span>오늘 영업이 마감되었습니다.</span>
          </div>
        );
      case 'holiday':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
            <MoonStar className="h-4 w-4 shrink-0 text-slate-400" />
            <span>오늘은 설정된 휴무일입니다.</span>
          </div>
        );
      case 'holiday-closed':
        return (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
            <MoonStar className="h-4 w-4 shrink-0 text-slate-400" />
            <span>오늘 임시 영업이 마감되었습니다.</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPrimaryButton = () => {
    const cardBase =
      'flex h-full w-full flex-col justify-between rounded-xl border bg-background p-5 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5';
    const disabledCard =
      'flex h-full w-full flex-col justify-between rounded-xl border bg-muted/60 p-5 text-left cursor-not-allowed';
    const iconWrap = (color: string) =>
      `flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`;

    switch (currentCase) {
      case 'already-open':
        return (
          <button
            onClick={() => navigate('/dashboard')}
            className={`${cardBase} hover:border-baro-green/40 hover:bg-baro-green/5`}
          >
            <div className={iconWrap('bg-baro-green/10')}>
              <Store className="h-6 w-6 text-baro-green" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">영업 중</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatShortDate(businessDate)} · 대시보드로 이동합니다
              </p>
            </div>
          </button>
        );

      case 'normal':
        return (
          <button
            onClick={() => handleStartBusiness()}
            disabled={isStarting}
            className={`${cardBase} hover:border-baro-blue/40 hover:bg-baro-blue/5 disabled:opacity-60`}
          >
            <div className={iconWrap('bg-baro-blue/10')}>
              <LogIn className="h-6 w-6 text-baro-blue" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">
                {isStarting ? '시작 중...' : '영업 시작하기'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                오늘 영업을 시작하고 대시보드로 이동합니다
              </p>
            </div>
          </button>
        );

      case 'before-open-closed':
        return (
          <div className={disabledCard}>
            <div className={iconWrap('bg-slate-200')}>
              <Clock className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-400">영업 시작 대기 중</p>
              <p className="mt-1 text-sm text-slate-400">
                {todayOpenTime} 이후에 영업을 시작할 수 있습니다
              </p>
            </div>
          </div>
        );

      case 'before-open-not-closed':
        return (
          <button
            onClick={() => navigate(`/closing?date=${businessDate}`)}
            className={`${cardBase} hover:border-baro-yellow/50 hover:bg-baro-yellow/10`}
          >
            <div className={iconWrap('bg-baro-yellow/20')}>
              <AlertTriangle className="h-6 w-6 text-baro-yellow-dark" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">전날 마감하러 가기</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatShortDate(businessDate)} 소급 마감을 진행합니다
              </p>
            </div>
          </button>
        );

      case 'today-closed':
      case 'holiday-closed':
        return (
          <div className={disabledCard}>
            <div className={iconWrap('bg-slate-200')}>
              <MoonStar className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-400">오늘 영업 종료</p>
              <p className="mt-1 text-sm text-slate-400">마감이 완료되었습니다. 내일 다시 만나요</p>
            </div>
          </div>
        );

      case 'holiday':
        return (
          <button
            onClick={() => setShowHolidayModal(true)}
            disabled={isStarting}
            className={`${cardBase} hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-60`}
          >
            <div className={iconWrap('bg-slate-100 dark:bg-slate-800')}>
              <LogIn className="h-6 w-6 text-slate-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">임시 영업 시작하기</p>
              <p className="mt-1 text-sm text-muted-foreground">
                휴무일에 임시로 영업을 시작합니다
              </p>
            </div>
          </button>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-muted/30 md:h-screen md:overflow-hidden">
      {/* ── Header ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <img src={baroLogo} alt="BARO" className="h-7 w-auto" />
          <span className="text-xs text-muted-foreground">통합 가게 운영 솔루션</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden text-sm text-muted-foreground md:block">{formatCalendarDate()}</p>
          {!isLoading && businessDateClosed && (
            <span className="hidden text-xs font-medium text-baro-yellow-text bg-baro-yellow/20 border border-baro-yellow/30 px-2 py-0.5 rounded-full sm:inline">
              {formatShortDate(businessDate)} 마감 완료
            </span>
          )}
          {!isLoading &&
            dashboardStats?.missedClosing &&
            (history?.closings.length ?? 0) > 0 &&
            (currentCase === 'already-open' || currentCase === 'normal') && (
              <Link
                to={`/closing?date=${getYesterdayKST()}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-baro-yellow-text bg-baro-yellow/20 border border-baro-yellow/50 px-2 py-0.5 rounded-full hover:bg-baro-yellow/30 transition-colors"
              >
                <AlertTriangle className="h-3 w-3 shrink-0 text-baro-yellow-dark" />
                <span className="hidden sm:inline">전날 마감 누락</span>
              </Link>
            )}
        </div>
      </header>

      {/* ── Body: 모바일=세로 스택, 데스크탑=좌우 2열 ── */}
      <div className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        {/* ── 왼쪽/상단 패널 ── */}
        <aside className="flex flex-col border-b bg-background md:w-80 md:shrink-0 md:border-b-0 md:border-r md:overflow-hidden">
          {/* 현재 가게 */}
          <div className="shrink-0 border-b px-5 py-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              현재 가게
            </p>
            {currentStore ? (
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-semibold leading-tight">{currentStore.storeName}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    currentStore.role === 'owner'
                      ? 'bg-baro-blue/10 text-baro-blue'
                      : 'bg-baro-green/10 text-baro-green'
                  }`}
                >
                  {currentStore.role === 'owner' ? '사장님' : '직원'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            )}
          </div>

          {/* 오늘의 영업 섹션 레이블 */}
          <div className="shrink-0 border-b px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              오늘의 영업
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground md:hidden">{formatCalendarDate()}</p>
            {!isLoading && isBeforeOpen && !isHoliday && (
              <p className="mt-1 text-xs text-muted-foreground">
                영업 기준일: {formatShortDate(businessDate)}
              </p>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4 md:gap-4 md:overflow-hidden md:p-5">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-full shrink-0 rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl md:flex-1" />
              </>
            ) : (
              <>
                {renderStatusBanner()}
                <div className="h-40 min-h-0 md:h-auto md:flex-1">{renderPrimaryButton()}</div>
              </>
            )}
          </div>

          {/* 계정 홈 이동 */}
          <div className="shrink-0 border-t px-4 py-3 md:px-5">
            <button
              onClick={() => navigate(routePaths.myStores)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <UserCircle className="h-4 w-4 shrink-0" />
              <span>계정 홈</span>
            </button>
          </div>
        </aside>

        {/* ── 오른쪽/하단: 바로가기 카드 ── */}
        <main className="flex flex-1 flex-col gap-4 p-4 min-w-0 md:gap-5 md:overflow-hidden md:p-6">
          <div className="shrink-0">
            <p className="text-lg font-semibold">바로가기</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              자주 사용하는 기능으로 빠르게 이동하세요.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3 md:flex-1 md:gap-4 md:min-h-0">
              <div className="grid grid-cols-2 gap-3 md:flex-1 md:grid-cols-3 md:gap-4 md:min-h-0">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl md:h-auto" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 md:flex-1 md:gap-4 md:min-h-0">
                {[0, 1].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl md:h-auto" />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:flex-1 md:gap-4 md:min-h-0">
              {/* 상단 3열 (모바일: 2열) */}
              <div className="grid grid-cols-2 gap-3 md:flex-1 md:grid-cols-3 md:gap-4 md:min-h-0">
                <button
                  onClick={() => navigate('/inventory')}
                  className="cursor-pointer flex h-32 flex-col justify-between rounded-xl border bg-background p-4 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-baro-green/40 hover:bg-baro-green/5 md:h-full md:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-baro-green/10">
                    <Archive className="h-5 w-5 text-baro-green" />
                  </div>
                  <div>
                    <p className="font-semibold">재고 현황</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">현재 식자재 재고 확인</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/order-guide')}
                  className="cursor-pointer flex h-32 flex-col justify-between rounded-xl border bg-background p-4 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-baro-yellow/50 hover:bg-baro-yellow/10 md:h-full md:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-baro-yellow/20">
                    <ClipboardList className="h-5 w-5 text-baro-yellow-dark" />
                  </div>
                  <div>
                    <p className="font-semibold">발주 가이드</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">AI 발주 추천 확인</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowHistorySheet(true)}
                  className="cursor-pointer col-span-2 flex h-32 flex-col justify-between rounded-xl border bg-background p-4 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-baro-blue/40 hover:bg-baro-blue/5 md:col-span-1 md:h-full md:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-baro-blue/10">
                    <History className="h-5 w-5 text-baro-blue" />
                  </div>
                  <div>
                    <p className="font-semibold">마감 현황</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">이전 마감 날짜 및 매출</p>
                  </div>
                </button>
              </div>

              {/* 하단 2열 */}
              <div className="grid grid-cols-2 gap-3 md:flex-1 md:gap-4 md:min-h-0">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="cursor-pointer flex h-32 flex-col justify-between rounded-xl border bg-background p-4 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-baro-red/40 hover:bg-red-50 dark:hover:bg-red-950/20 md:h-full md:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-baro-red/10">
                    <Trash2 className="h-5 w-5 text-baro-red" />
                  </div>
                  <div>
                    <p className="font-semibold">마감 취소</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      마감 이력 삭제 및 재고 복구
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/store-settings')}
                  className="cursor-pointer flex h-32 flex-col justify-between rounded-xl border bg-background p-4 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:bg-muted/50 md:h-full md:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">설정</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">가게 정보 및 메뉴 설정</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 이전 마감 현황 시트 */}
      <ClosingHistorySheet
        open={showHistorySheet}
        onClose={() => setShowHistorySheet(false)}
        storeId={storeId}
      />

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
            <DialogTitle className="flex items-center gap-2">
              <Store className="size-4 text-muted-foreground" />
              임시 영업 시작
            </DialogTitle>
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
              className="bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              {isStarting ? '시작 중...' : '임시 영업 시작'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreHomePage;
