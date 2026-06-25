import { useEffect, useState } from 'react';

import { Package, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import {
  useDeleteUnitConversion,
  useUnitConversions,
  useUpdateUnitConversion,
} from '@/features/ocr-inbound/hooks/useUnitConversions';
import type { UnitConversionDto } from '@/features/ocr-inbound/types/ocrInbound.api.types';
import {
  useCreateIngredient,
  useUpdateIngredient,
} from '@/features/store-settings/hooks/useIngredients';
import { Button } from '@/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { getApiErrorMessage } from '@/shared/utils/apiError';

type IngredientUnit = 'g' | 'ml' | '개';

const UNITS: IngredientUnit[] = ['g', 'ml', '개'];

interface IngredientRegisterModalProps {
  open: boolean;
  initialName?: string;
  initialUnit?: IngredientUnit;
  /** 전달 시 수정 모드로 동작 */
  editingId?: string;
  onClose: () => void;
  onConfirm?: (ingredientId: string) => void;
}

const IngredientRegisterModal = ({
  open,
  initialName = '',
  initialUnit = 'g',
  editingId,
  onClose,
  onConfirm,
}: IngredientRegisterModalProps) => {
  const { mutate: createIngredient, isPending: isCreating } = useCreateIngredient();
  const { mutate: updateIngredient, isPending: isUpdating } = useUpdateIngredient();
  const { data: conversionData } = useUnitConversions();
  const { mutate: updateConversion, isPending: isUpdatingConv } = useUpdateUnitConversion();
  const { mutate: deleteConversion, isPending: isDeletingConv } = useDeleteUnitConversion();

  const [form, setForm] = useState({ name: initialName, unit: initialUnit });
  const [localFactors, setLocalFactors] = useState<Record<string, number>>({});
  const [isAddingConversion, setIsAddingConversion] = useState(false);
  const [newConversion, setNewConversion] = useState({ purchaseUnit: '', factor: '' });

  const isEditMode = !!editingId;
  const isPending = isCreating || isUpdating;

  const conversions: UnitConversionDto[] = editingId
    ? (conversionData?.list.filter((c) => c.ingredientId === editingId) ?? [])
    : [];

  const handleClose = () => {
    setIsAddingConversion(false);
    setNewConversion({ purchaseUnit: '', factor: '' });
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const initial: Record<string, number> = {};
    conversions.forEach((c) => {
      initial[c.id] = c.factor;
    });
    // open될 때 서버 데이터로 로컬 편집 상태 초기화 — 외부 상태와 동기화 목적으로 허용

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalFactors(initial);
  }, [open, conversions.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (isEditMode) {
      updateIngredient(
        { id: editingId, data: { name: form.name, unit: form.unit } },
        { onSuccess: () => onClose() },
      );
    } else {
      createIngredient(
        { name: form.name, unit: form.unit },
        {
          onSuccess: (created) => {
            onConfirm?.(created.id);
            onClose();
          },
        },
      );
    }
  };

  const handleSaveConversion = (conv: UnitConversionDto) => {
    const factor = localFactors[conv.id];
    if (!factor || factor <= 0) {
      toast.error('변환 계수는 0보다 커야 합니다.');
      return;
    }
    updateConversion(
      {
        ingredientId: conv.ingredientId,
        purchaseUnit: conv.purchaseUnit,
        baseUnit: conv.baseUnit,
        factor,
      },
      { onSuccess: () => toast.success('변환 계수가 저장되었습니다.') },
    );
  };

  const handleDeleteConversion = (conv: UnitConversionDto) => {
    deleteConversion(conv.id, {
      onSuccess: () => toast.success(`${conv.purchaseUnit} 변환 계수가 삭제되었습니다.`),
      onError: (err) =>
        toast.error(getApiErrorMessage(err, '삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.')),
    });
  };

  const handleAddConversion = () => {
    if (!editingId) return;
    const factor = Number(newConversion.factor);
    if (!newConversion.purchaseUnit.trim()) {
      toast.error('명세서 단위명을 입력해주세요.');
      return;
    }
    if (!factor || factor <= 0) {
      toast.error('변환 계수는 0보다 커야 합니다.');
      return;
    }
    updateConversion(
      {
        ingredientId: editingId,
        purchaseUnit: newConversion.purchaseUnit.trim(),
        baseUnit: form.unit as 'g' | 'ml' | '개',
        factor,
      },
      {
        onSuccess: () => {
          toast.success('변환 계수가 추가되었습니다.');
          setIsAddingConversion(false);
          setNewConversion({ purchaseUnit: '', factor: '' });
        },
        onError: (err) =>
          toast.error(getApiErrorMessage(err, '추가에 실패했습니다. 잠시 후 다시 시도해 주세요.')),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg! leading-none! flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />
            {isEditMode ? '식자재 수정' : '식자재 등록'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditMode
              ? '식자재 이름과 단위를 수정합니다.'
              : '등록한 단위는 이후 재고 관리에 고정으로 사용됩니다'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          <div className="grid grid-cols-[1fr_5rem] gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">
                식자재명 <span className="text-baro-red">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="식자재명 입력"
                className="h-9 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">
                단위 <span className="text-baro-red">*</span>
              </Label>
              <Select
                value={form.unit}
                onValueChange={(v) =>
                  v && setForm((prev) => ({ ...prev, unit: v as IngredientUnit }))
                }
              >
                <SelectTrigger className="h-9! w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEditMode && (
            <div className="border-t pt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">입고 단위 변환</p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 text-muted-foreground hover:text-baro-blue"
                  onClick={() => setIsAddingConversion((v) => !v)}
                  aria-label="변환 추가"
                >
                  {isAddingConversion ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </Button>
              </div>

              {isAddingConversion && (
                <div className="grid grid-cols-[1fr_90px_30px_48px] gap-1.5 items-center px-1">
                  <Input
                    autoFocus
                    placeholder="단위명 (예: 박스)"
                    value={newConversion.purchaseUnit}
                    onChange={(e) =>
                      setNewConversion((prev) => ({ ...prev, purchaseUnit: e.target.value }))
                    }
                    className="h-7 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="계수"
                    value={newConversion.factor}
                    onChange={(e) =>
                      setNewConversion((prev) => ({ ...prev, factor: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleAddConversion()}
                    className="h-7 text-xs"
                    min={0.001}
                    step="any"
                  />
                  <span className="text-xs text-muted-foreground">{form.unit}</span>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-baro-blue hover:bg-baro-blue/90 text-white h-7 text-xs px-2"
                    onClick={handleAddConversion}
                    disabled={isUpdatingConv}
                  >
                    추가
                  </Button>
                </div>
              )}

              {conversions.length === 0 && !isAddingConversion ? (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  저장된 변환 계수가 없습니다.
                  <br />
                  <span className="text-[10px]">
                    + 버튼을 눌러 박스·병 등 명세서 단위의 변환 계수를 직접 추가할 수 있습니다.
                  </span>
                </p>
              ) : conversions.length > 0 ? (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[1fr_90px_30px_48px_28px] gap-1.5 px-1 text-[10px] font-medium text-muted-foreground">
                    <span>명세서 단위</span>
                    <span>변환 계수</span>
                    <span>단위</span>
                    <span />
                    <span />
                  </div>
                  {conversions.map((conv) => {
                    const isDirty =
                      localFactors[conv.id] !== undefined && localFactors[conv.id] !== conv.factor;
                    return (
                      <div
                        key={conv.id}
                        className="grid grid-cols-[1fr_90px_30px_48px_28px] gap-1.5 items-center px-1"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted rounded px-1 py-0.5 leading-none">
                            1
                          </span>
                          <span className="text-sm font-medium">{conv.purchaseUnit}</span>
                        </div>
                        <Input
                          type="number"
                          value={localFactors[conv.id] ?? conv.factor}
                          onChange={(e) =>
                            setLocalFactors((prev) => ({
                              ...prev,
                              [conv.id]: Number(e.target.value),
                            }))
                          }
                          className="h-7 text-xs"
                          min={0.001}
                          step="any"
                        />
                        <span className="text-xs text-muted-foreground">{conv.baseUnit}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant={isDirty ? 'default' : 'outline'}
                          className={
                            isDirty
                              ? 'bg-baro-blue hover:bg-baro-blue/90 text-white h-7 text-xs px-2'
                              : 'h-7 text-xs px-2'
                          }
                          onClick={() => handleSaveConversion(conv)}
                          disabled={isUpdatingConv}
                        >
                          저장
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-baro-red hover:bg-red-50"
                          onClick={() => handleDeleteConversion(conv)}
                          disabled={isDeletingConv}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-10" onClick={onClose}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={!form.name.trim() || isPending}
              className="flex-1 bg-baro-blue hover:bg-baro-blue/90 text-white h-10"
            >
              {isPending
                ? isEditMode
                  ? '수정 중...'
                  : '등록 중...'
                : isEditMode
                  ? '수정'
                  : '등록'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientRegisterModal;
