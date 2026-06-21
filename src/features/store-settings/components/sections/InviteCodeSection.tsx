import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy, RefreshCw, TriangleAlert, Users } from 'lucide-react';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import { regenerateInviteCode } from '@/features/store-registration/api/storeRegistration.api';
import { useStoreSettings } from '@/features/store-settings/hooks/useStoreSettings';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const InviteCodeSection = () => {
  const storeId = useAuthStore((s) => s.storeId);
  const queryClient = useQueryClient();
  const { data: settings } = useStoreSettings();

  const [isIssuing, setIsIssuing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (settings?.myRole !== 'owner') return null;

  const inviteCode = settings?.inviteCode ?? null;

  const handleIssue = async () => {
    if (!storeId) return;
    setIsIssuing(true);
    try {
      await regenerateInviteCode(storeId);
      await queryClient.invalidateQueries({ queryKey: ['storeSettings', storeId] });
      toast.success('초대코드가 발급되었습니다.');
    } catch {
      toast.error('초대코드 발급에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsIssuing(false);
      setConfirmOpen(false);
    }
  };

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <SettingsSection
        title="직원 초대"
        description="초대코드를 공유해 직원을 가게에 초대할 수 있습니다."
        icon={<Users className="h-4 w-4" />}
      >
        <SettingRow
          label="초대코드"
          description={
            inviteCode
              ? '직원에게 이 코드를 공유하세요.'
              : '초대코드를 발급하면 직원이 가게에 합류할 수 있습니다.'
          }
          action={
            inviteCode ? (
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-muted px-3 py-1.5 font-mono text-sm font-semibold tracking-widest">
                  {inviteCode}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                  aria-label="코드 복사"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-baro-green" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8"
                  onClick={() => setConfirmOpen(true)}
                  disabled={isIssuing}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  재발급
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-9"
                onClick={handleIssue}
                disabled={isIssuing}
              >
                <Users className="h-3.5 w-3.5" />
                {isIssuing ? '발급 중...' : '초대코드 발급'}
              </Button>
            )
          }
        />
      </SettingsSection>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-baro-yellow" />
              초대코드 재발급
            </DialogTitle>
            <DialogDescription>
              재발급하면 기존 초대코드는 즉시 무효화됩니다. 이미 나눠준 코드로는 더 이상 합류할 수
              없습니다. 계속하시겠어요?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isIssuing}>
              취소
            </Button>
            <Button
              onClick={handleIssue}
              disabled={isIssuing}
              className="bg-baro-blue text-white hover:bg-baro-blue/90"
            >
              {isIssuing ? '재발급 중...' : '재발급하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteCodeSection;
