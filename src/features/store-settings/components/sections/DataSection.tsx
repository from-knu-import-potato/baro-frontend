import { useState } from 'react';

import { AlertTriangle, Database, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { useDeleteStore, useLeaveStore } from '@/features/store-registration/hooks/useMyStores';
import {
  useResetStoreData,
  useStoreSettings,
} from '@/features/store-settings/hooks/useStoreSettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shadcn/ui/alert-dialog';
import { Button } from '@/shadcn/ui/button';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const DataSection = () => {
  const navigate = useNavigate();
  const storeId = useAuthStore((s) => s.storeId);
  const { data: settings } = useStoreSettings();
  const isOwner = settings?.myRole === 'owner';
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const { mutate: resetStore, isPending } = useResetStoreData();
  const { mutate: deleteStoreMutate, isPending: isDeleting } = useDeleteStore();
  const { mutate: leaveStoreMutate, isPending: isLeaving } = useLeaveStore();

  const handleConfirm = () => {
    resetStore(undefined, {
      onSuccess: () => {
        toast.success('가게 데이터가 초기화되었습니다.');
        setOpen(false);
      },
      onError: () => {
        toast.error('데이터 초기화에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        setOpen(false);
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (!storeId) return;
    deleteStoreMutate(storeId, {
      onSuccess: () => {
        toast.success('가게가 삭제되었습니다.');
        useAuthStore.setState({ storeId: null });
        navigate(routePaths.myStores, { replace: true });
      },
      onError: () => {
        toast.error('가게 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        setDeleteOpen(false);
      },
    });
  };

  const handleLeaveConfirm = () => {
    if (!storeId) return;
    leaveStoreMutate(storeId, {
      onSuccess: () => {
        toast.success('가게에서 나왔습니다.');
        useAuthStore.setState({ storeId: null });
        navigate(routePaths.myStores, { replace: true });
      },
      onError: () => {
        toast.error('가게 나가기에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        setLeaveOpen(false);
      },
    });
  };

  return (
    <>
      <SettingsSection
        title="데이터 관리"
        description="재고 데이터 초기화 또는 가게 삭제를 진행합니다."
        icon={<Database className="h-4 w-4" />}
      >
        {/* MVP 이후 구현 예정
        <SettingRow
          label="데이터 내보내기"
          description="전체 재고 및 입출고 내역을 CSV 파일로 다운로드합니다."
          action={
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              CSV 내보내기
            </Button>
          }
        />
        <Separator />
        */}
        <SettingRow
          label="데이터 초기화"
          description="모든 재고 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
          action={
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-baro-red text-baro-red hover:bg-baro-red/10 hover:text-baro-red"
              onClick={() => setOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              초기화
            </Button>
          }
        />
        {isOwner ? (
          <SettingRow
            label="가게 삭제"
            description="가게와 관련된 모든 데이터가 영구 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
            action={
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-baro-red text-baro-red hover:bg-baro-red/10 hover:text-baro-red"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                가게 삭제
              </Button>
            }
          />
        ) : (
          <SettingRow
            label="가게 떠나기"
            description="가게에서 나가면 더 이상 접근할 수 없습니다. 재합류하려면 초대코드가 필요합니다."
            action={
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-baro-red text-baro-red hover:bg-baro-red/10 hover:text-baro-red"
                onClick={() => setLeaveOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                가게 떠나기
              </Button>
            }
          />
        )}
      </SettingsSection>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-baro-red">
              <AlertTriangle className="w-4 h-4" />
              데이터 초기화 전 확인하세요
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-end items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-baro-red" />
                      삭제
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                      유지
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '메뉴', del: true },
                      { label: '메뉴 카테고리', del: true },
                      { label: '식자재', del: true },
                      { label: '레시피', del: true },
                      { label: '주문', del: true },
                      { label: '입고 기록', del: true },
                      { label: '마감', del: true },
                      { label: '발주 가이드', del: true },
                      { label: '가게 기본 정보', del: false },
                      { label: '멤버', del: false },
                      { label: '운영 시간', del: false },
                    ].map(({ label, del }) => (
                      <span
                        key={label}
                        className={
                          del
                            ? 'rounded-md bg-red-50 px-2 py-0.5 text-xs text-baro-red border border-red-100 dark:bg-red-950/40 dark:border-red-800/40'
                            : 'rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground border border-border'
                        }
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  초기화 후에는 삭제된 데이터를 복구할 수 없습니다. 계속하기 전에 필요한 데이터를
                  별도로 기록해 두세요.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>돌아가기</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isPending}
              className="bg-baro-red hover:bg-baro-red-dark text-white"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '초기화 확정'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 가게 나가기 확인 다이얼로그 */}
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-baro-red">
              <AlertTriangle className="w-4 h-4" />
              가게에서 나가시겠어요?
            </AlertDialogTitle>
            <AlertDialogDescription>
              가게를 떠나면 더 이상 해당 가게에 접근할 수 없습니다. 다시 합류하려면 초대코드가
              필요합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveConfirm}
              disabled={isLeaving}
              className="bg-baro-red hover:bg-baro-red-dark text-white"
            >
              {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : '나가기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 가게 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-baro-red">
              <AlertTriangle className="w-4 h-4" />
              가게를 삭제하시겠어요?
            </AlertDialogTitle>
            <AlertDialogDescription>
              가게를 삭제하면 재고·메뉴·레시피·주문 내역 등 모든 데이터가 영구적으로 삭제됩니다. 이
              작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-baro-red hover:bg-baro-red-dark text-white"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : '가게 삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DataSection;
