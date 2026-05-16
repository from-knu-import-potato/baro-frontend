import { AlertCircle, Plus, Trash2 } from 'lucide-react';

import { INGREDIENT_UNITS } from '@/features/initial-setup/constants/initialSetup.constants';
import type { KeyIngredient } from '@/features/initial-setup/types/initialSetup.types';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';

interface StepKeyIngredientsProps {
  data: KeyIngredient[];
  onChange: (data: KeyIngredient[]) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const StepKeyIngredients = ({ data, onChange }: StepKeyIngredientsProps) => {
  const addIngredient = () => {
    onChange([...data, { id: generateId(), name: '', minStockAmount: 0, unit: 'g' }]);
  };

  const removeIngredient = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const updateIngredient = (id: string, updated: Partial<KeyIngredient>) => {
    onChange(data.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg bg-baro-blue/8 p-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-baro-blue" />
        <p className="text-xs leading-relaxed text-baro-blue/80">
          최소 재고 기준을 설정하면 재고가 기준 이하로 떨어질 때 알림을 받을 수 있어요
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-10 text-center">
          <p className="text-sm text-muted-foreground">등록된 식자재가 없습니다</p>
          <p className="text-xs text-muted-foreground">관리할 주요 식자재를 추가해주세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_100px_88px_32px] gap-2 px-2">
            <Label className="text-xs text-muted-foreground">식자재 이름</Label>
            <Label className="text-xs text-muted-foreground">최소 재고</Label>
            <Label className="text-xs text-muted-foreground">단위</Label>
            <span />
          </div>

          {data.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_100px_88px_32px] items-center gap-2 rounded-lg border px-2 py-1.5"
            >
              <Input
                placeholder="예: 원두"
                value={item.name}
                onChange={(e) => updateIngredient(item.id, { name: e.target.value })}
                className="h-8 bg-white"
              />
              <Input
                type="number"
                placeholder="0"
                min={0}
                value={item.minStockAmount === 0 ? '' : item.minStockAmount}
                onChange={(e) =>
                  updateIngredient(item.id, { minStockAmount: parseFloat(e.target.value) || 0 })
                }
                className="h-8 bg-white"
              />
              <Select
                value={item.unit}
                onValueChange={(val) =>
                  val && updateIngredient(item.id, { unit: val as KeyIngredient['unit'] })
                }
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INGREDIENT_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                type="button"
                onClick={() => removeIngredient(item.id)}
                className="flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addIngredient}
        className="w-full gap-1.5 border-dashed"
      >
        <Plus className="size-4" />
        식자재 추가
      </Button>
    </div>
  );
};

export default StepKeyIngredients;
