import { useState } from 'react';

import { PackagePlus, Pencil } from 'lucide-react';

import {
  useCreateIngredient,
  useUpdateIngredient,
} from '@/features/store-settings/hooks/useIngredients';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';

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
  const [form, setForm] = useState({ name: initialName, unit: initialUnit });

  const isEditMode = !!editingId;
  const isPending = isCreating || isUpdating;

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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg! leading-none! flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-baro-blue/10 flex items-center justify-center shrink-0">
              {isEditMode ? (
                <Pencil className="w-4 h-4 text-baro-blue" />
              ) : (
                <PackagePlus className="w-4 h-4 text-baro-blue" />
              )}
            </div>
            {isEditMode ? '식자재 수정' : '식자재 등록'}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {isEditMode
              ? '식자재 이름과 단위를 수정합니다.'
              : '등록한 단위는 이후 재고 관리에 고정으로 사용됩니다'}
          </p>
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
                <SelectTrigger className="h-9 w-full text-sm">
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

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={!form.name.trim() || isPending}
              className="flex-1 bg-baro-blue hover:bg-baro-blue/90 text-white"
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
