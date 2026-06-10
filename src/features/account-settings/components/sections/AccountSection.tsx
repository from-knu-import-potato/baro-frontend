import { useRef, useState } from 'react';

import { Check, LogOut, Pencil, Trash2, UserCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { withdrawUser } from '@/features/account-settings/api/accountSettings.api';
import { MOCK_ACCOUNT_SETTINGS } from '@/features/account-settings/data/account-settings.mock';
import { logout } from '@/features/auth/api/authApi';
import useAuthStore from '@/features/auth/store/authStore';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Separator } from '@/shadcn/ui/separator';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const AccountSection = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(MOCK_ACCOUNT_SETTINGS.name);
  const [draftName, setDraftName] = useState(name);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleEditStart = () => {
    setDraftName(name);
    setIsEditingName(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = () => {
    const trimmed = draftName.trim();
    if (trimmed) {
      setName(trimmed);
    }
    setIsEditingName(false);
  };

  const handleCancel = () => {
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawUser();
      clearAuth();
      navigate('/login');
    } catch {
      setIsWithdrawing(false);
      setIsWithdrawDialogOpen(false);
    }
  };

  return (
    <>
      <SettingsSection
        title="계정"
        description="계정 정보 및 보안 설정을 관리합니다."
        icon={<UserCircle className="h-4 w-4" />}
      >
        <SettingRow
          label="이름"
          action={
            isEditingName ? (
              <div className="flex items-center gap-1.5">
                <Input
                  ref={inputRef}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 w-36 text-sm"
                  maxLength={20}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-baro-green hover:bg-baro-green/10 hover:text-baro-green"
                  onClick={handleSave}
                  aria-label="저장"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleCancel}
                  aria-label="취소"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">{name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleEditStart}
                  aria-label="이름 편집"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            )
          }
        />
        <Separator />
        <SettingRow
          label="로그아웃"
          description="현재 기기에서 로그아웃합니다."
          action={
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-baro-red text-baro-red hover:bg-baro-red/10 hover:text-baro-red"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-3.5 w-3.5" />
              로그아웃
            </Button>
          }
        />
        <Separator />
        <SettingRow
          label="회원 탈퇴"
          description="서비스에서 계정을 삭제합니다."
          action={
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-baro-red text-baro-red hover:bg-baro-red/10 hover:text-baro-red"
              onClick={() => setIsWithdrawDialogOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              회원 탈퇴
            </Button>
          }
        />
      </SettingsSection>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말 탈퇴하시겠어요?</DialogTitle>
            <DialogDescription>
              탈퇴하면 가게 정보, 재고, 메뉴, 레시피 등 모든 데이터가 영구적으로 삭제됩니다. 이
              작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsWithdrawDialogOpen(false)}
              disabled={isWithdrawing}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={handleWithdraw} disabled={isWithdrawing}>
              탈퇴하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountSection;
