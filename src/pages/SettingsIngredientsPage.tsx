import { useState } from 'react';

import { ArrowLeft, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import {
  useIngredients,
  useDeleteIngredient,
} from '@/features/store-settings/hooks/useIngredients';
import {
  useStoreSettings,
  useUpdateStoreSettings,
} from '@/features/store-settings/hooks/useStoreSettings';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Skeleton } from '@/shadcn/ui/skeleton';
import IngredientRegisterModal from '@/shared/components/IngredientRegisterModal';
import SafetyStockDial from '@/shared/components/SafetyStockDial';

const SettingsIngredientsPage = () => {
  const navigate = useNavigate();
  const { data: ingredients, isLoading } = useIngredients();
  const { data: storeSettings } = useStoreSettings();
  const { mutate: deleteIngredient } = useDeleteIngredient();
  const { mutate: updateStoreSettings, isPending: isSavingPct } = useUpdateStoreSettings();

  const [safetyPct, setSafetyPct] = useState(20);
  const [addOpen, setAddOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);

  // 모달 열 때 서버 값으로 다이얼 초기화
  const handleOpenSafety = () => {
    setSafetyPct(storeSettings?.safetyStockPct ?? 20);
    setSafetyOpen(true);
  };

  const handleApplySafety = () => {
    // PATCH /stores/:storeId { safetyStockPct } 한 번으로 백엔드가 전체 식자재 일괄 업데이트
    updateStoreSettings({ safetyStockPct: safetyPct });
    setSafetyOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="shrink-0 flex items-center gap-3 border-b px-6 py-4 bg-background">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-semibold">식자재 관리</p>
          <p className="text-xs text-muted-foreground">재고로 관리할 식자재를 등록합니다.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenSafety}>
            <ShieldCheck className="size-4 mr-1" /> 안전 재고 기준
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

      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))
        ) : !ingredients?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">등록된 식자재가 없습니다.</p>
            <p className="text-xs mt-1">식자재 추가 버튼을 눌러 시작하세요.</p>
          </div>
        ) : (
          ingredients.map((ing) => (
            <div
              key={ing.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3 bg-card"
            >
              <div>
                <p className="text-sm font-medium">{ing.name}</p>
                <p className="text-xs text-muted-foreground">단위: {ing.unit}</p>
              </div>
              <div className="flex items-center gap-4">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteIngredient(ing.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <IngredientRegisterModal open={addOpen} onClose={() => setAddOpen(false)} />

      {/* ── 안전 재고 기준 다이얼로그 ── */}
      <Dialog open={safetyOpen} onOpenChange={setSafetyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>안전 재고 기준 설정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              현재 재고의 몇 %를 안전 재고로 볼지 기준을 설정합니다.
              <br />
              <span className="text-xs">
                OCR 입고 후에는 자동으로 반영됩니다. 지금 즉시 적용하려면 '전체 적용'을 눌러주세요.
              </span>
            </p>
            <div className="flex justify-center">
              <SafetyStockDial value={safetyPct} onChange={setSafetyPct} step={5} />
            </div>
            <Button
              className="w-full bg-baro-blue hover:bg-baro-blue/80 text-white"
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
