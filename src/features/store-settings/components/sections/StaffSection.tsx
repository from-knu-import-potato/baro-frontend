import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Crown, RefreshCw, TriangleAlert, UserMinus, Users } from 'lucide-react';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import { regenerateInviteCode } from '@/features/store-registration/api/storeRegistration.api';
import {
  useStoreMembers,
  useStoreSettings,
  useRemoveMember,
} from '@/features/store-settings/hooks/useStoreSettings';
import type { StoreMember } from '@/features/store-settings/types/store-settings.types';
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
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const MemberAvatar = ({ member }: { member: StoreMember }) => {
  if (member.profileImage) {
    return (
      <img
        src={member.profileImage}
        alt={member.name}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
      {member.name.charAt(0)}
    </div>
  );
};

const StaffSection = () => {
  const storeId = useAuthStore((s) => s.storeId);
  const queryClient = useQueryClient();
  const { data: settings } = useStoreSettings();
  const { data: members, isLoading: membersLoading } = useStoreMembers();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();

  const [isIssuing, setIsIssuing] = useState(false);
  const [confirmReissueOpen, setConfirmReissueOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetMember, setTargetMember] = useState<StoreMember | null>(null);

  const isOwner = settings?.myRole === 'owner';
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
      setConfirmReissueOpen(false);
    }
  };

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRemoveConfirm = () => {
    if (!targetMember) return;
    removeMember(targetMember.userId, {
      onSuccess: () => {
        toast.success(`${targetMember.name}님을 내보냈습니다.`);
        setTargetMember(null);
      },
      onError: () => {
        toast.error('멤버 내보내기에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        setTargetMember(null);
      },
    });
  };

  return (
    <>
      <SettingsSection
        title="직원 관리"
        description="초대코드로 직원을 초대하고 멤버를 관리합니다."
        icon={<Users className="h-4 w-4" />}
      >
        {/* 초대코드 — 사장님만 표시 */}
        {isOwner && (
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
                    onClick={() => setConfirmReissueOpen(true)}
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
        )}

        {/* 멤버 목록 */}
        <div>
          <div className="mb-3">
            <p className="text-sm font-medium">멤버 목록</p>
            <p className="mt-0.5 text-xs text-muted-foreground">가게에 합류한 직원 목록입니다.</p>
          </div>
          <div className="overflow-hidden rounded-xl border bg-card">
            {membersLoading ? (
              <div className="space-y-0 divide-y">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !members || members.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                아직 합류한 멤버가 없습니다.
              </p>
            ) : (
              <ul className="divide-y">
                {members.map((member) => (
                  <li key={member.userId} className="flex items-center gap-3 px-4 py-3">
                    <MemberAvatar member={member} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium truncate">{member.name}</span>
                        {member.role === 'owner' && (
                          <Crown className="h-3.5 w-3.5 shrink-0 text-baro-yellow" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {member.role === 'owner' ? '사장님' : '직원'}
                      </p>
                    </div>
                    {isOwner && member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-baro-red"
                        onClick={() => setTargetMember(member)}
                        aria-label={`${member.name} 내보내기`}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* 초대코드 재발급 확인 다이얼로그 */}
      <Dialog open={confirmReissueOpen} onOpenChange={setConfirmReissueOpen}>
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
            <Button
              variant="outline"
              onClick={() => setConfirmReissueOpen(false)}
              disabled={isIssuing}
            >
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

      {/* 멤버 내보내기 확인 다이얼로그 */}
      <Dialog open={!!targetMember} onOpenChange={(open) => !open && setTargetMember(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserMinus className="size-4 text-baro-red" />
              멤버 내보내기
            </DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{targetMember?.name}</span>님을 가게에서
              내보내시겠어요? 해당 직원은 더 이상 가게에 접근할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTargetMember(null)} disabled={isRemoving}>
              취소
            </Button>
            <Button
              onClick={handleRemoveConfirm}
              disabled={isRemoving}
              className="bg-baro-red text-white hover:bg-baro-red/90"
            >
              {isRemoving ? '내보내는 중...' : '내보내기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StaffSection;
