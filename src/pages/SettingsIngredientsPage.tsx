import { useState } from 'react';

import { isAxiosError } from 'axios';
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { type DeleteConflictDetail } from '@/features/store-settings/api/ingredients.api';
import {
  useIngredients,
  useArchivedIngredients,
  useArchiveIngredient,
  useDeleteIngredient,
  useForceDeleteIngredient,
} from '@/features/store-settings/hooks/useIngredients';
import {
  useStoreSettings,
  useUpdateStoreSettings,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Skeleton } from '@/shadcn/ui/skeleton';
import IngredientRegisterModal from '@/shared/components/IngredientRegisterModal';
import SafetyStockDial from '@/shared/components/SafetyStockDial';

type IngredientUnit = 'g' | 'ml' | '개';
type EditingIngredient = { id: string; name: string; unit: IngredientUnit };
type DeleteTarget = { id: string; name: string };

const SettingsIngredientsPage = () => {
  const navigate = useNavigate();
  const { data: activeIngredients, isLoading: isActiveLoading } = useIngredients();
  const { data: archivedIngredients, isLoading: isArchivedLoading } = useArchivedIngredients();
  const { data: storeSettings } = useStoreSettings();
  const { mutate: archiveIngredient, isPending: isArchiving } = useArchiveIngredient();
  const { mutate: deleteIngredient, isPending: isDeleting } = useDeleteIngredient();
  const { mutate: forceDeleteIngredient, isPending: isForceDeleting } = useForceDeleteIngredient();
  const { mutate: updateStoreSettings, isPending: isSavingPct } = useUpdateStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [safetyPct, setSafetyPct] = useState(20);
  const [addOpen, setAddOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<EditingIngredient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [conflictDetail, setConflictDetail] = useState<DeleteConflictDetail | null>(null);

  const displayedIngredients = showArchived ? archivedIngredients : activeIngredients;
  const isLoading = showArchived ? isArchivedLoading : isActiveLoading;
  const filteredIngredients = displayedIngredients?.filter((ing) =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenSafety = () => {
    setSafetyPct(storeSettings?.safetyStockPct ?? 20);
    setSafetyOpen(true);
  };

  const handleApplySafety = () => {
    updateStoreSettings({ safetyStockPct: safetyPct });
    setSafetyOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteIngredient(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (err) => {
        if (isAxiosError(err) && err.response?.status === 409) {
          setConflictDetail(
            err.response.data?.error?.detail ?? { inboundCount: 0, closingCount: 0 },
          );
        }
      },
    });
  };

  const handleForceDeleteConfirm = () => {
    if (!deleteTarget) return;
    forceDeleteIngredient(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        setConflictDetail(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
    setConflictDetail(null);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="shrink-0 flex items-center gap-3 border-b px-6 py-4 bg-background">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-semibold">식자재 관리</p>
          <p className="text-xs text-muted-foreground">
            {showArchived ? '보관된 식자재 목록입니다.' : '재고로 관리할 식자재를 등록합니다.'}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="식자재 이름 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleOpenSafety}>
            <ShieldCheck className="size-4 mr-1" /> 안전 재고 기준
          </Button>
          <Button
            variant={showArchived ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowArchived((prev) => !prev)}
            className={showArchived ? 'bg-baro-blue hover:bg-baro-blue/80 text-white' : ''}
          >
            <Archive className="size-4 mr-1" />
            보관함
            {(archivedIngredients?.length ?? 0) > 0 && (
              <span className="ml-1 bg-white/30 text-current rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none">
                {archivedIngredients!.length}
              </span>
            )}
          </Button>
          <Button
            size="sm"
            className="bg-baro-blue hover:bg-baro-blue/80 text-white"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="size-4 mr-1" /> 식자재 추가
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))
        ) : !displayedIngredients?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            {showArchived ? (
              <p className="text-sm">보관된 식자재가 없습니다.</p>
            ) : (
              <>
                <p className="text-sm">등록된 식자재가 없습니다.</p>
                <p className="text-xs mt-1">식자재 추가 버튼을 눌러 시작하세요.</p>
              </>
            )}
          </div>
        ) : !filteredIngredients?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          filteredIngredients.map((ing) => (
            <div
              key={ing.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3 bg-card"
            >
              <div>
                <p className="text-sm font-medium">{ing.name}</p>
                <p className="text-xs text-muted-foreground">단위: {ing.unit}</p>
              </div>
              <div className="flex items-center gap-4">
                {!showArchived && (
                  <>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">현재 재고</p>
                      <p className="text-sm font-semibold">
                        {Number(ing.currentStock).toLocaleString()} {ing.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">안전 재고</p>
                      <p className="text-sm font-semibold">
                        {Number(ing.safetyStock).toLocaleString()} {ing.unit}
                      </p>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-1">
                  {showArchived ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-baro-green"
                        onClick={() => archiveIngredient({ id: ing.id, isArchived: false })}
                        disabled={isArchiving}
                      >
                        <ArchiveRestore className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget({ id: ing.id, name: ing.name })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-baro-blue"
                        onClick={() =>
                          setEditingIngredient({ id: ing.id, name: ing.name, unit: ing.unit })
                        }
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-baro-blue"
                        onClick={() => archiveIngredient({ id: ing.id, isArchived: true })}
                        disabled={isArchiving}
                      >
                        <Archive className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget({ id: ing.id, name: ing.name })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 식자재 추가 모달 */}
      <IngredientRegisterModal
        key={addOpen ? 'add-open' : 'add-closed'}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />

      {/* 식자재 수정 모달 */}
      <IngredientRegisterModal
        key={editingIngredient?.id ?? 'edit-closed'}
        open={!!editingIngredient}
        editingId={editingIngredient?.id}
        initialName={editingIngredient?.name}
        initialUnit={editingIngredient?.unit}
        onClose={() => setEditingIngredient(null)}
      />

      {/* 1차 삭제 확인 */}
      <AlertDialog
        open={!!deleteTarget && !conflictDetail}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="size-4 text-baro-red" />
              식자재를 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{deleteTarget?.name}</span>을(를)
              삭제하면 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? '확인 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2차 삭제 확인 (관련 기록 있을 때) */}
      <AlertDialog open={!!conflictDetail} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-baro-red" />
              관련 기록도 함께 삭제됩니다
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{deleteTarget?.name}</span>에 연결된
              입고 기록 {conflictDetail?.inboundCount ?? 0}건, 마감 기록{' '}
              {conflictDetail?.closingCount ?? 0}건이 함께 삭제됩니다. 계속하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleForceDeleteConfirm}
              disabled={isForceDeleting}
            >
              {isForceDeleting ? '삭제 중...' : '모두 삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 안전 재고 기준 다이얼로그 */}
      <Dialog open={safetyOpen} onOpenChange={setSafetyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-muted-foreground" />
              안전 재고 기준 설정
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              현재 재고의 몇 %를 안전 재고로 볼지 기준을 설정합니다.
              <br />
              <span className="text-xs">
                OCR 입고 후에는 자동으로 반영됩니다. 지금 즉시 적용하려면 '전체 적용'을 눌러주세요.
              </span>
            </p>
            <div className="flex justify-center py-4">
              <SafetyStockDial value={safetyPct} onChange={setSafetyPct} step={5} />
            </div>
            <Button
              className="w-full bg-baro-blue hover:bg-baro-blue/80 text-white h-10"
              onClick={handleApplySafety}
              disabled={isSavingPct}
            >
              전체 적용
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsIngredientsPage;
