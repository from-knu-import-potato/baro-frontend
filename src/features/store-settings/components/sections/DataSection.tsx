import { useState } from 'react';

import { AlertTriangle, Database, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useResetStoreData } from '@/features/store-settings/hooks/useStoreSettings';
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
  const [open, setOpen] = useState(false);
  const { mutate: resetStore, isPending } = useResetStoreData();

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

  return (
    <>
      <SettingsSection
        title="데이터 관리"
        description="재고 데이터를 초기화합니다."
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
                            ? 'rounded-md bg-red-50 px-2 py-0.5 text-xs text-baro-red border border-red-100'
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
    </>
  );
};

export default DataSection;
