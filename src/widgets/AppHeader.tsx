import { ChevronDown } from 'lucide-react';

import useAuthStore from '@/features/auth/store/authStore';
import { useClosingStatus } from '@/features/closing/hooks/useClosingStatus';
import useClosingStore from '@/features/closing/store/closingStore';
import { Button } from '@/shadcn/ui/button';
import { Skeleton } from '@/shadcn/ui/skeleton';

interface AppHeaderProps {
  userName: string;
  userRole: string;
  isLoading?: boolean;
  onClosingClick?: () => void;
}

const AppHeader = ({ userName, userRole, isLoading = false, onClosingClick }: AppHeaderProps) => {
  const storeId = useAuthStore((s) => s.storeId);
  const { isCompleted } = useClosingStatus(storeId);
  const { isOpen: isBusinessOpen } = useClosingStore((s) => s.businessSession);

  // 영업 중이 아니거나 이미 마감한 경우 마감 버튼 비활성화
  const isClosingDisabled = !isBusinessOpen || isCompleted;

  return (
    <header className="bg-background h-13 border-b flex items-center justify-end px-6 gap-4 sticky top-0 z-10">
      {/* 마감하기 */}
      <Button
        size="sm"
        onClick={onClosingClick}
        disabled={isClosingDisabled}
        title={
          !isBusinessOpen
            ? '영업을 시작하면 마감할 수 있습니다'
            : isCompleted
              ? '오늘 마감이 완료되었습니다'
              : undefined
        }
        className="bg-baro-blue text-xs rounded-full hover:bg-baro-blue/80 text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isCompleted ? '마감 완료' : '마감하기'}
      </Button>

      {/* 구분선 */}
      <div className="h-5 w-px bg-border" />

      {/* 유저 정보 */}
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Skeleton className="w-7 h-7 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      ) : (
        <div className="flex items-center gap-4 cursor-pointer rounded-lg transition-colors">
          <div className="w-7 h-7 rounded-full bg-baro-blue flex items-center justify-center">
            <span className="text-xs font-semibold text-white">{userName.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold leading-tight">{userName}</span>
            <span className="text-xs leading-tight text-muted-foreground">{userRole}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </header>
  );
};

export default AppHeader;
