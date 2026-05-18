import { ChevronDown } from 'lucide-react';

interface AppHeaderProps {
  userName: string;
  userRole: string;
}

const AppHeader = ({ userName, userRole }: AppHeaderProps) => {
  return (
    <header className="bg-background h-13 border-b flex items-center justify-end px-6 gap-4 sticky top-0 z-10">
      {/* 검색 */}
      {/* <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-baro-black-muted/40 rounded-full outline-none transition-colors"
          />
        </div>
      </div> */}

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
