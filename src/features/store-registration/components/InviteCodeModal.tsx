import { useState } from 'react';

import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { useJoinStore } from '@/features/store-registration/hooks/useJoinStore';
import { fetchStoreSettings } from '@/features/store-settings/api/storeSettings.api';
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
import { Label } from '@/shadcn/ui/label';

interface InviteCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_INVITE_CODE: '유효하지 않은 초대코드입니다. 다시 확인해 주세요.',
  ALREADY_MEMBER: '이미 참여한 가게입니다.',
};

const InviteCodeModal = ({ open, onOpenChange }: InviteCodeModalProps) => {
  const navigate = useNavigate();
  const { setStoreId, setOperatingHours } = useAuthStore();
  const { mutate: joinStore, isPending } = useJoinStore();
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    joinStore(trimmed, {
      onSuccess: async (result) => {
        setStoreId(result.storeId);
        const settings = await fetchStoreSettings(result.storeId).catch(() => null);
        if (settings?.operatingHours) setOperatingHours(settings.operatingHours);
        onOpenChange(false);
        navigate(routePaths.storeHome, { replace: true });
      },
      onError: (err: unknown) => {
        const code = (err as { response?: { data?: { error?: { code?: string } } } })?.response
          ?.data?.error?.code;
        const message =
          (code && ERROR_MESSAGES[code]) ?? '가게 참여에 실패했습니다. 잠시 후 다시 시도해 주세요.';
        toast.error(message);
      },
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setCode('');
    onOpenChange(isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="text-xl! mb-1! flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" />
            초대코드 입력
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            사장님께 받은 초대코드를 입력해 주세요. 코드가 맞으면 가게에 직원으로 등록됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="invite-code" className="text-sm font-medium">
            초대코드
          </Label>
          <Input
            id="invite-code"
            placeholder="초대코드를 입력하세요"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            className="uppercase h-11"
            maxLength={12}
            disabled={isPending}
          />
        </div>

        <DialogFooter className="gap-2 pt-2 bg-background">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1 h-9"
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={code.trim().length === 0 || isPending}
            className="flex-1 bg-baro-blue text-white hover:bg-baro-blue/90 h-9"
          >
            {isPending ? '참여 중...' : '입장하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteCodeModal;
