import { useState } from 'react';

import { PackagePlus } from 'lucide-react';

import type { OcrUnit } from '@/features/ocr-inbound/types/ocrInbound.types';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';

const UNITS: OcrUnit[] = ['g', 'ml', '개'];

interface IngredientForm {
  name: string;
  unit: OcrUnit;
  safetyStock: string;
}

interface IngredientRegisterModalProps {
  open: boolean;
  initialName: string;
  initialUnit: OcrUnit;
  onClose: () => void;
  onConfirm: () => void;
}

const IngredientRegisterModal = ({
  open,
  initialName,
  initialUnit,
  onClose,
  onConfirm,
}: IngredientRegisterModalProps) => {
  const [form, setForm] = useState<IngredientForm>({
    name: initialName,
    unit: initialUnit,
    safetyStock: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg! leading-none! flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-baro-blue/10 flex items-center justify-center shrink-0">
              <PackagePlus className="w-4 h-4 text-baro-blue" />
            </div>
            식자재 등록
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            등록한 단위는 이후 재고 관리에 고정으로 사용됩니다
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
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

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 w-fit shrink-0">
              <Label className="text-xs">
                단위 <span className="text-baro-red">*</span>
              </Label>
              <Select
                value={form.unit}
                onValueChange={(v) => v && setForm((prev) => ({ ...prev, unit: v as OcrUnit }))}
              >
                <SelectTrigger className="h-9 text-sm w-fit px-3">
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
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-xs">
                안전 재고
                <span className="text-muted-foreground font-normal ml-1">(선택)</span>
              </Label>
              <Input
                type="number"
                value={form.safetyStock}
                onChange={(e) => setForm((prev) => ({ ...prev, safetyStock: e.target.value }))}
                placeholder="0"
                min={0}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button
              type="submit"
              disabled={!form.name.trim()}
              className="flex-1 bg-baro-blue hover:bg-baro-blue/90 text-white"
            >
              등록
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientRegisterModal;
