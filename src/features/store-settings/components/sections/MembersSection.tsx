import { useState } from 'react';

import { Crown, UserMinus, Users } from 'lucide-react';
import { toast } from 'sonner';

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

const MembersSection = () => {
  const { data: settings } = useStoreSettings();
  const { data: members, isLoading } = useStoreMembers();
  const { mutate: removeMember, isPending } = useRemoveMember();

  const [targetMember, setTargetMember] = useState<StoreMember | null>(null);

  const isOwner = settings?.myRole === 'owner';

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
        title="멤버 관리"
        description="가게에 합류한 직원 목록을 확인할 수 있습니다."
        icon={<Users className="h-4 w-4" />}
      >
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : !members || members.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 합류한 멤버가 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member.userId} className="flex items-center gap-3">
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
      </SettingsSection>

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
            <Button variant="outline" onClick={() => setTargetMember(null)} disabled={isPending}>
              취소
            </Button>
            <Button
              onClick={handleRemoveConfirm}
              disabled={isPending}
              className="bg-baro-red text-white hover:bg-baro-red/90"
            >
              {isPending ? '내보내는 중...' : '내보내기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MembersSection;
