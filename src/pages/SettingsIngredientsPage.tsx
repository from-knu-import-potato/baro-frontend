import { useState } from 'react';

import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import {
  useIngredients,
  useCreateIngredient,
  useDeleteIngredient,
} from '@/features/store-settings/hooks/useIngredients';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Skeleton } from '@/shadcn/ui/skeleton';

const UNITS = [
  { value: 'g', label: 'g (그램)' },
  { value: 'ml', label: 'ml (밀리리터)' },
  { value: '개', label: '개' },
] as const;

const SettingsIngredientsPage = () => {
  const navigate = useNavigate();
  const { data: ingredients, isLoading } = useIngredients();
  const { mutate: createIngredient, isPending: isCreating } = useCreateIngredient();
  const { mutate: deleteIngredient } = useDeleteIngredient();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; unit: 'g' | 'ml' | '개' }>({
    name: '',
    unit: 'g',
  });

  const handleCreate = () => {
    if (!form.name) return;
    createIngredient(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ name: '', unit: 'g' });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-semibold">식자재 관리</p>
          <p className="text-xs text-muted-foreground">재고로 관리할 식자재를 등록합니다.</p>
        </div>
        <Button
          size="sm"
          className="ml-auto bg-baro-blue hover:bg-baro-blue/80 text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4 mr-1" /> 식자재 추가
        </Button>
      </header>

      <div className="p-6 space-y-2">
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
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">현재 재고</p>
                  <p className="text-sm font-semibold">
                    {Number(ing.currentStock).toLocaleString()} {ing.unit}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>식자재 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>식자재명 *</Label>
              <Input
                placeholder="예: 원두"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>단위 *</Label>
              <Select
                value={form.unit}
                onValueChange={(v) => setForm((f) => ({ ...f, unit: v as typeof form.unit }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-baro-blue hover:bg-baro-blue/80 text-white"
              onClick={handleCreate}
              disabled={isCreating}
            >
              추가하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsIngredientsPage;
