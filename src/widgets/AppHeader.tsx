import { ChevronDown } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';

interface AppHeaderProps {
  userName: string;
  userRole: string;
  onClosingClick?: () => void;
}

const AppHeader = ({ userName, userRole, onClosingClick }: AppHeaderProps) => {
  return (
    <header className="bg-background h-13 border-b flex items-center justify-end px-6 gap-4 sticky top-0 z-10">
      {/* 마감하기 */}
      <Button
        size="sm"
        onClick={onClosingClick}
        className="bg-baro-blue text-xs rounded-full hover:bg-baro-blue/80 text-white"
      >
        마감하기
      </Button>

      {/* 구분선 */}
      <div className="h-5 w-px bg-border" />

      {/* 유저 정보 */}
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
    </header>
  );
};

export default AppHeader;
