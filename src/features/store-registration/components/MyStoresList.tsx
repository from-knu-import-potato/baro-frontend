import { useRef, useState } from 'react';

import {
  Check,
  ChevronRight,
  Info,
  LogOut,
  Moon,
  Pencil,
  Plus,
  Store,
  Sun,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { routePaths } from '@/app/routes/routePaths';
import { withdrawUser } from '@/features/account-settings/api/accountSettings.api';
import { APP_VERSION } from '@/features/account-settings/data/account-settings.mock';
import { useUpdateUserName, useUserInfo } from '@/features/account-settings/hooks/useUserInfo';
import { logout } from '@/features/auth/api/authApi';
import useAuthStore from '@/features/auth/store/authStore';
import { useMyStores } from '@/features/store-registration/hooks/useMyStores';
import type { MyStore } from '@/features/store-registration/types/storeRegistration.types';
import { fetchStoreSettings } from '@/features/store-settings/api/storeSettings.api';
import ThemeToggle from '@/features/theme/components/ThemeToggle';
import { useTheme } from '@/features/theme/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { Input } from '@/shadcn/ui/input';
import { Separator } from '@/shadcn/ui/separator';
import { Skeleton } from '@/shadcn/ui/skeleton';
import baroLogo from '@/shared/assets/images/baro-logo.png';

const ROLE_LABEL: Record<MyStore['role'], string> = { owner: '사장님', staff: '직원' };
const ROLE_STYLE: Record<MyStore['role'], string> = {
  owner: 'bg-baro-blue/10 text-baro-blue',
  staff: 'bg-baro-green/10 text-baro-green',
};

function getInitials(name?: string | null) {
  return name?.trim().slice(0, 2) ?? '?';
}

const MyStoresList = () => {
  const navigate = useNavigate();
  const { data: userInfo, isLoading: isUserLoading } = useUserInfo();
  const { data: stores, isLoading: isStoresLoading } = useMyStores();
  const { mutate: updateName, isPending: isUpdatingName } = useUpdateUserName();
  const { dark, toggleTheme } = useTheme();
  const { setStoreId, setOperatingHours, clearAuth } = useAuthStore();

  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectStore = async (storeId: string) => {
    setSelectingId(storeId);
    try {
      setStoreId(storeId);
      const settings = await fetchStoreSettings(storeId).catch(() => null);
      if (settings?.operatingHours) setOperatingHours(settings.operatingHours);
      navigate(routePaths.storeHome, { replace: true });
    } finally {
      setSelectingId(null);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      clearAuth();
      navigate(routePaths.login, { replace: true });
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawUser();
      clearAuth();
      navigate(routePaths.login, { replace: true });
    } catch {
      toast.error('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setIsWithdrawing(false);
      setWithdrawOpen(false);
    }
  };

  const handleEditStart = () => {
    setDraftName(userInfo?.name ?? '');
    setIsEditingName(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveName = () => {
    const trimmed = draftName.trim();
    if (!trimmed) return;
    updateName(trimmed, {
      onSuccess: () => setIsEditingName(false),
      onError: () => toast.error('이름 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') setIsEditingName(false);
  };

  const isBlocked = selectingId !== null || isLoggingOut;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-muted/30 md:h-screen md:overflow-hidden">
      {/* ── Top nav ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
        <img src={baroLogo} alt="BARO" className="h-7 w-auto" />
        {isUserLoading ? (
          <Skeleton className="h-4 w-28" />
        ) : (
          <span className="text-sm text-muted-foreground">
            안녕하세요,&nbsp;
            <span className="font-semibold text-foreground">{userInfo?.name}</span>님
          </span>
        )}
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        {/* ── Left/Top: Account panel ── */}
        <aside className="flex flex-col border-b bg-background md:w-72 md:shrink-0 md:border-b-0 md:border-r md:overflow-y-auto">
          {/* Profile block */}
          <div className="flex flex-col items-center gap-3 px-6 py-5 md:py-8">
            {isUserLoading ? (
              <>
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-1.5 text-center">
                  <Skeleton className="mx-auto h-5 w-24" />
                  <Skeleton className="mx-auto h-3.5 w-36" />
                </div>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 select-none items-center justify-center rounded-full bg-baro-blue text-xl font-bold text-white">
                  {getInitials(userInfo?.name)}
                </div>
                <div className="text-center">
                  {isEditingName ? (
                    <div className="flex items-center gap-1">
                      <Input
                        ref={inputRef}
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-8 w-28 text-center text-sm"
                        maxLength={20}
                        disabled={isUpdatingName}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-baro-green hover:bg-baro-green/10"
                        onClick={handleSaveName}
                        disabled={isUpdatingName}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={() => setIsEditingName(false)}
                        disabled={isUpdatingName}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <p className="font-semibold">{userInfo?.name}</p>
                      <button
                        onClick={handleEditStart}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">{userInfo?.email}</p>
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* 설정 + 서비스 정보 */}
          <nav className="flex flex-col px-3 py-3">
            {/* 테마 토글 */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                {dark ? (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{dark ? '다크 모드' : '라이트 모드'}</span>
              </div>
              <ThemeToggle dark={dark} toggleTheme={toggleTheme} />
            </div>

            {/* 서비스 정보 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted">
                  <div className="flex items-center gap-2.5">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span>서비스 정보</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-48">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  버전 {APP_VERSION}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={routePaths.terms}>이용약관</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={routePaths.privacy}>개인정보처리방침</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="https://naver.me/xM5slAyu" target="_blank" rel="noopener noreferrer">
                    문의하기
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* 스페이서 */}
          <div className="flex-1" />

          <Separator />

          {/* 로그아웃 + 회원 탈퇴 */}
          <nav className="flex flex-col px-3 py-3">
            <button
              onClick={handleLogout}
              disabled={isBlocked}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-colors hover:bg-muted disabled:opacity-50"
            >
              <LogOut className="h-4 w-4 text-muted-foreground" />
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
            <button
              onClick={() => setWithdrawOpen(true)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left text-baro-red/80 transition-colors hover:bg-baro-red/5 hover:text-baro-red"
            >
              <Trash2 className="h-4 w-4" />
              회원 탈퇴
            </button>
          </nav>
        </aside>

        {/* ── Right/Bottom: Store selection ── */}
        <main className="flex flex-1 flex-col p-4 gap-4 min-w-0 md:overflow-hidden md:p-6 md:gap-5">
          {/* Header row */}
          <div className="shrink-0">
            <p className="text-xl font-bold">내 가게</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              운영할 가게를 선택하면 대시보드로 이동합니다.
            </p>
          </div>

          {/* Stores grid — scrolls internally */}
          <div className="flex-1 overflow-y-auto p-1 md:overflow-y-auto">
            {isStoresLoading ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-2xl" />
                ))}
              </div>
            ) : stores && stores.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 pb-2 md:gap-4 lg:grid-cols-3">
                {stores.map((store) => {
                  const isSelecting = selectingId === store.storeId;
                  return (
                    <div
                      key={store.storeId}
                      className={cn(
                        'group flex flex-col justify-between gap-5 rounded-2xl border bg-background p-5',
                        'shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ',
                        isSelecting && 'pointer-events-none opacity-60',
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                          <Store className="size-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold leading-tight truncate">{store.storeName}</p>
                          <span
                            className={cn(
                              'mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                              ROLE_STYLE[store.role],
                            )}
                          >
                            {ROLE_LABEL[store.role]}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full h-9 rounded-full bg-baro-blue text-white hover:bg-baro-blue/90"
                        onClick={() => handleSelectStore(store.storeId)}
                        disabled={isBlocked}
                      >
                        {isSelecting ? '이동 중...' : '입장하기'}
                      </Button>
                    </div>
                  );
                })}

                {/* Add store card */}
                <button
                  onClick={() => navigate(routePaths.storeSelection)}
                  disabled={isBlocked}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-background text-muted-foreground transition-colors hover:border-baro-blue/40 hover:bg-baro-blue/5 hover:text-baro-blue min-h-44"
                >
                  <Plus className="size-6" />
                  <span className="text-sm font-medium">새 가게 추가</span>
                  <span className="text-xs">새 가게 등록 또는 초대코드로 합류</span>
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-background text-center">
                <Store className="size-10 text-muted-foreground/40" />
                <div>
                  <p className="font-semibold">참여 중인 가게가 없어요</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    가게를 만들거나 초대코드로 합류해 보세요.
                  </p>
                </div>
                <Button
                  className="mt-2 gap-2 bg-baro-blue text-white hover:bg-baro-blue/90"
                  onClick={() => navigate(routePaths.storeSelection)}
                >
                  <Plus className="size-4" />
                  시작하기
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Withdraw dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-baro-red" />
              정말 탈퇴하시겠어요?
            </DialogTitle>
            <DialogDescription>
              탈퇴하면 가게 정보, 재고, 메뉴, 레시피 등 모든 데이터가 영구적으로 삭제됩니다. 이
              작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawOpen(false)}
              disabled={isWithdrawing}
            >
              취소
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="bg-baro-red/10 text-baro-red hover:bg-baro-red/20"
            >
              탈퇴하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyStoresList;
