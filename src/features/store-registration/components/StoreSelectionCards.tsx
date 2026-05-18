import { useState } from 'react';

import { Store, Users, ArrowRight, ChefHat, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import InviteCodeModal from '@/features/store-registration/components/InviteCodeModal';
import { cn } from '@/lib/utils';
import baroLogo from '@/shared/assets/images/baro-logo.png';

const StoreSelectionCards = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<'new' | 'invite' | null>(null);

  const handleNewStore = () => {
    navigate(routePaths.initialSetup);
  };

  const handleInviteCode = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 px-4 pt-8 mt-8 text-center">
        <img src={baroLogo} alt="BARO Logo" className="h-9 w-auto" />
        <div>
          <p className="text-3xl tracking-tight">어떻게 시작할까요?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            새 가게를 등록하거나, 초대코드로 기존 가게에 합류하세요.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col items-center justify-center gap-16 px-4">
        <div className="flex w-full max-w-3xl flex-col gap-8 sm:flex-row">
          {/* New Store Card */}
          <button
            onClick={handleNewStore}
            onMouseEnter={() => setHoveredCard('new')}
            onMouseLeave={() => setHoveredCard(null)}
            className={cn(
              'group relative flex flex-1 flex-col items-start gap-6 overflow-hidden rounded-3xl border-2 p-8 text-left transition-all duration-300',
              hoveredCard === 'new'
                ? 'border-baro-blue bg-baro-blue/5 shadow-lg shadow-baro-blue/10 -translate-y-1'
                : 'border-border bg-card hover:border-baro-blue/40',
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300',
                hoveredCard === 'new'
                  ? 'bg-baro-blue text-white'
                  : 'bg-baro-blue/10 text-baro-blue',
              )}
            >
              <Store className="size-8" />
            </div>

            {/* Text */}
            <div className="flex-1 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-baro-blue">사장님</p>
              <h2 className="text-xl font-black text-baro-black">새 가게 등록하기</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                직접 가게를 개설하고 재고를 관리하세요.
                <br />
                직원을 초대해 함께 사용할 수 있어요.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <ChefHat className="size-3" />
                가게 정보 설정
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <ClipboardList className="size-3" />
                재고·레시피 관리
              </span>
            </div>

            {/* Arrow */}
            <div
              className={cn(
                'absolute right-6 top-1/2 -translate-y-1/2 transition-all duration-300',
                hoveredCard === 'new' ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
              )}
            >
              <ArrowRight className="size-6 text-baro-blue" />
            </div>
          </button>

          {/* Divider (mobile) */}
          <div className="flex items-center gap-3 sm:hidden">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">또는</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Divider (desktop) */}
          <div className="hidden items-center sm:flex">
            <span className="text-xs text-muted-foreground">또는</span>
          </div>

          {/* Invite Code Card */}
          <button
            onClick={handleInviteCode}
            onMouseEnter={() => setHoveredCard('invite')}
            onMouseLeave={() => setHoveredCard(null)}
            className={cn(
              'group relative flex flex-1 flex-col items-start gap-6 overflow-hidden rounded-3xl border-2 p-8 text-left transition-all duration-300',
              hoveredCard === 'invite'
                ? 'border-baro-green bg-baro-green/5 shadow-lg shadow-baro-green/10 -translate-y-1'
                : 'border-border bg-card hover:border-baro-green/40',
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300',
                hoveredCard === 'invite'
                  ? 'bg-baro-green text-white'
                  : 'bg-baro-green/10 text-baro-green',
              )}
            >
              <Users className="size-8" />
            </div>

            {/* Text */}
            <div className="flex-1 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-baro-green">직원</p>
              <h2 className="text-xl font-black text-baro-black">초대코드로 합류하기</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                사장님께 받은 초대코드를 입력하면
                <br />
                바로 가게 직원으로 합류할 수 있어요.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Users className="size-3" />
                직원으로 참여
              </span>
            </div>

            {/* Arrow */}
            <div
              className={cn(
                'absolute right-6 top-1/2 -translate-y-1/2 transition-all duration-300',
                hoveredCard === 'invite' ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0',
              )}
            >
              <ArrowRight className="size-6 text-baro-green" />
            </div>
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground">
          선택 후에도 언제든지 가게를 변경하거나 나갈 수 있어요.
        </p>
      </div>

      <InviteCodeModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default StoreSelectionCards;
