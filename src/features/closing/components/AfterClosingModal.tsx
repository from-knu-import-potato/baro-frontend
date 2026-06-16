import { useEffect, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  LogOut,
  Moon,
  ShoppingCart,
  Siren,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useGenerateOrderGuide } from '@/features/order-guide/hooks/useGenerateOrderGuide';
import type { OrderGuideItem, UrgencyLevel } from '@/features/order-guide/types/orderGuide.types';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent } from '@/shadcn/ui/dialog';

interface AfterClosingModalProps {
  open: boolean;
  totalRevenue: number;
  storeId: string;
  closingId: string;
}

type Step = 'generating' | 'no-guide' | 'choose' | 'summary' | 'confirm-exit';

const formatCurrency = (amount: number) => `${amount.toLocaleString('ko-KR')}원`;

const URGENCY_CONFIG: Record<
  UrgencyLevel,
  { label: string; badgeClass: string; borderClass: string; icon: React.ReactNode }
> = {
  critical: {
    label: '긴급',
    badgeClass: 'bg-red-100 text-baro-red border border-red-200',
    borderClass: 'border-l-2 border-l-baro-red',
    icon: <Siren className="w-3 h-3" />,
  },
  warning: {
    label: '주의',
    badgeClass: 'bg-orange-100 text-orange-600 border border-orange-200',
    borderClass: 'border-l-2 border-l-orange-400',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  recommended: {
    label: '권장',
    badgeClass: 'bg-blue-100 text-baro-blue border border-blue-200',
    borderClass: '',
    icon: <ShoppingCart className="w-3 h-3" />,
  },
};

const ClosingHero = ({ totalRevenue, subtitle }: { totalRevenue: number; subtitle?: string }) => (
  <div className="px-6 pt-8 pb-5 text-center bg-baro-blue">
    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
      <CheckCircle2 className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-xl font-bold text-white">오늘 마감 완료!</h2>
    {subtitle && <p className="text-sm text-white/70 mt-1">{subtitle}</p>}
    <div className="mt-4 bg-white/15 rounded-xl px-4 py-3">
      <p className="text-xs text-white/70">오늘 총 매출</p>
      <p className="text-3xl font-bold tabular-nums text-white mt-0.5">
        {formatCurrency(totalRevenue)}
      </p>
    </div>
  </div>
);

const AfterClosingModal = ({ open, totalRevenue, storeId, closingId }: AfterClosingModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('generating');
  const [guideItems, setGuideItems] = useState<OrderGuideItem[]>([]);

  const { mutate: generate } = useGenerateOrderGuide(storeId);

  useEffect(() => {
    if (!open || step !== 'generating') return;
    generate(closingId, {
      onSuccess: (data) => {
        setGuideItems(data.items);
        setStep(data.items.length > 0 ? 'choose' : 'no-guide');
      },
      onError: () => {
        setStep('no-guide');
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  const handleExit = () => navigate('/day-closed', { replace: true });

  const urgentItems = guideItems.filter((i) => i.urgency === 'critical' || i.urgency === 'warning');
  const displayItems = (urgentItems.length > 0 ? urgentItems : guideItems).slice(0, 5);
  const overflowCount = (urgentItems.length > 0 ? urgentItems : guideItems).length - 5;
  const criticalCount = guideItems.filter((i) => i.urgency === 'critical').length;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="p-0 sm:max-w-md overflow-hidden" showCloseButton={false}>
        {/* ── 생성 중 ── */}
        {step === 'generating' && (
          <>
            <ClosingHero totalRevenue={totalRevenue} />
            <div className="flex flex-col items-center gap-3 px-6 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-baro-blue border-t-transparent" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">AI가 재고를 분석하고 있어요</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  발주가 필요한 품목을 찾고 있습니다...
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── 발주 가이드 없음 ── */}
        {step === 'no-guide' && (
          <>
            <ClosingHero totalRevenue={totalRevenue} subtitle="수고하셨습니다" />
            <div className="px-6 pt-0 pb-5 space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-baro-green/10 border border-baro-green/25 p-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-baro-green/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-baro-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-baro-green">재고 상태 원활</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    발주가 필요한 품목이 없어요. 오늘도 수고하셨습니다!
                  </p>
                </div>
              </div>
              <Button
                onClick={handleExit}
                className="w-full h-11 bg-baro-blue hover:bg-baro-blue/90 text-white flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                프로그램 종료
              </Button>
            </div>
          </>
        )}

        {/* ── 발주 가이드 있음: 선택 ── */}
        {step === 'choose' && (
          <>
            <ClosingHero totalRevenue={totalRevenue} subtitle="재고 차감 완료" />
            <div className="px-6 pt-0 pb-5 space-y-3">
              <p className="text-sm text-muted-foreground text-center pt-1 pb-2">
                발주 가이드를 언제 확인할까요?
              </p>

              <button
                onClick={() => setStep('summary')}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-baro-blue/40 bg-baro-blue/5 hover:bg-baro-blue/10 hover:border-baro-blue/70 transition-colors text-left group"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-baro-blue/15 flex items-center justify-center group-hover:bg-baro-blue/25 transition-colors">
                  <ClipboardList className="w-5 h-5 text-baro-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">발주 가이드 즉시 보기</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {guideItems.length}개 품목 · 긴급 {criticalCount}건
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>

              <button
                onClick={() => setStep('confirm-exit')}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">오픈 때 볼게요</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    내일 오픈 전 발주 가이드 메뉴에서 확인
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </div>
          </>
        )}

        {/* ── 발주 가이드 요약 ── */}
        {step === 'summary' && (
          <>
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b">
              <div className="w-9 h-9 rounded-xl bg-baro-blue/10 flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4 text-baro-blue" />
              </div>
              <div>
                <h2 className="text-base font-bold">발주 가이드 요약</h2>
                <p className="text-xs text-muted-foreground">
                  {urgentItems.length > 0
                    ? `긴급·주의 ${urgentItems.length}건 포함`
                    : `권장 발주 ${guideItems.length}건`}
                </p>
              </div>
            </div>

            <div className="divide-y max-h-56 overflow-y-auto">
              {displayItems.map((item) => {
                const cfg = URGENCY_CONFIG[item.urgency];
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-6 py-3 gap-3 ${cfg.borderClass}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{item.reason}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-sm font-bold tabular-nums">
                        {item.recommendedOrderQty}
                        {item.recommendedOrderUnit}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg.badgeClass}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {overflowCount > 0 && (
                <div className="px-6 py-2.5 text-xs text-muted-foreground text-center bg-muted/30">
                  외 {overflowCount}개 품목 더 있어요
                </div>
              )}
            </div>

            <div className="flex gap-2 px-6 py-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  navigate('/closing/order-guide-detail', { state: { items: guideItems } })
                }
              >
                <ClipboardList className="w-4 h-4 mr-1.5" />
                전체 보기
              </Button>
              <Button
                className="flex-1 bg-baro-blue hover:bg-baro-blue/90 text-white"
                onClick={handleExit}
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                종료
              </Button>
            </div>
          </>
        )}

        {/* ── 오픈 때 보기: 종료 확인 ── */}
        {step === 'confirm-exit' && (
          <div className="px-6 py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800">
              <Moon className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">프로그램을 종료할까요?</h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                발주 가이드는 내일 오픈 때<br />
                발주 가이드 메뉴에서 확인할 수 있어요.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setStep('choose')}>
                취소
              </Button>
              <Button
                className="flex-1 bg-baro-blue hover:bg-baro-blue/90 text-white flex items-center gap-1.5"
                onClick={handleExit}
              >
                <LogOut className="w-4 h-4" />
                종료
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AfterClosingModal;
