import { useState } from 'react';

import { ArrowLeft, ChevronDown, ChevronUp, GripVertical, Plus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import type { IngredientDto } from '@/features/store-settings/api/ingredients.api';
import type { RecipeDto } from '@/features/store-settings/api/recipes.api';
import { useIngredients } from '@/features/store-settings/hooks/useIngredients';
import { useMenus } from '@/features/store-settings/hooks/useMenus';
import {
  useRecipes,
  useCreateRecipe,
  useDeleteRecipe,
} from '@/features/store-settings/hooks/useRecipes';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Skeleton } from '@/shadcn/ui/skeleton';

/* ── 식자재 태그 ── */
const IngredientTag = ({
  ingredient,
  added,
  onClick,
}: {
  ingredient: IngredientDto;
  added: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all select-none',
      added
        ? 'border-baro-blue bg-baro-blue/10 text-baro-blue cursor-default'
        : 'border-gray-200 bg-white text-foreground hover:border-baro-blue/60 hover:bg-baro-blue/5 dark:border-gray-700 dark:bg-gray-800',
    )}
  >
    {!added && <GripVertical className="size-3 text-muted-foreground" />}
    <span>{ingredient.name}</span>
    <span className="text-muted-foreground">({ingredient.unit})</span>
  </div>
);

/* ── 메뉴별 아코디언 패널 ── */
const RecipeAccordion = ({
  menuName,
  recipes,
  onDelete,
}: {
  menuId: string;
  menuName: string;
  recipes: RecipeDto[];
  onDelete: (recipeId: string) => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{menuName}</span>
          <span className="text-xs text-muted-foreground">식자재 {recipes.length}가지</span>
        </div>
        {open ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t">
          {recipes.length === 0 ? (
            <div className="flex items-center justify-center py-5">
              <p className="text-xs text-muted-foreground">아직 추가된 식자재가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1.5 p-3">
              <div className="grid grid-cols-[1fr_90px_auto_28px] items-center gap-2 px-1">
                <Label className="text-xs text-muted-foreground">식자재</Label>
                <Label className="text-xs text-muted-foreground">사용량</Label>
                <Label className="text-xs text-muted-foreground">단위</Label>
                <span />
              </div>
              {recipes.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[1fr_90px_auto_28px] items-center gap-2 rounded-lg border bg-background px-2 py-1.5"
                >
                  <span className="truncate text-sm">{r.ingredientName}</span>
                  <span className="text-sm font-medium">{Number(r.amount).toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">{r.ingredientUnit}</span>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    className="flex items-center justify-center rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── 메인 페이지 ── */
const SettingsRecipesPage = () => {
  const navigate = useNavigate();
  const { data: recipes, isLoading } = useRecipes();
  const { data: menus } = useMenus();
  const { data: ingredients } = useIngredients();
  const { mutate: createRecipe, isPending: isCreating } = useCreateRecipe();
  const { mutate: deleteRecipe } = useDeleteRecipe();

  const [open, setOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [pendingItems, setPendingItems] = useState<{ ingredientId: string; amount: string }[]>([]);

  const existingForMenu = recipes?.filter((r) => r.menuId === selectedMenuId) ?? [];
  const addedIds = [
    ...existingForMenu.map((r) => r.ingredientId),
    ...pendingItems.map((p) => p.ingredientId),
  ];

  const handleTagClick = (ingredientId: string) => {
    if (addedIds.includes(ingredientId)) return;
    setPendingItems((prev) => [...prev, { ingredientId, amount: '' }]);
  };

  const handleRemovePending = (ingredientId: string) => {
    setPendingItems((prev) => prev.filter((p) => p.ingredientId !== ingredientId));
  };

  const handleAmountChange = (ingredientId: string, amount: string) => {
    setPendingItems((prev) =>
      prev.map((p) => (p.ingredientId === ingredientId ? { ...p, amount } : p)),
    );
  };

  const handleSave = () => {
    const valid = pendingItems.filter((p) => p.amount && Number(p.amount) > 0);
    if (!valid.length) return;
    let remaining = valid.length;
    valid.forEach((item) => {
      createRecipe(
        { menuId: selectedMenuId, ingredientId: item.ingredientId, amount: Number(item.amount) },
        {
          onSuccess: () => {
            remaining--;
            if (remaining === 0) {
              setOpen(false);
              setSelectedMenuId('');
              setPendingItems([]);
            }
          },
        },
      );
    });
  };

  const grouped = menus
    ?.map((menu) => ({
      menuId: menu.id,
      menuName: menu.name,
      recipes: recipes?.filter((r) => r.menuId === menu.id) ?? [],
    }))
    .filter((g) => g.recipes.length > 0 || menus.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-semibold">레시피 관리</p>
          <p className="text-xs text-muted-foreground">메뉴별 식자재 사용량을 설정합니다.</p>
        </div>
        <Button
          size="sm"
          className="ml-auto bg-baro-blue hover:bg-baro-blue/80 text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4 mr-1" /> 레시피 추가
        </Button>
      </header>

      <div className="p-6 space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : !menus?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">먼저 메뉴를 등록해주세요.</p>
          </div>
        ) : (
          grouped?.map((g) => (
            <RecipeAccordion
              key={g.menuId}
              menuId={g.menuId}
              menuName={g.menuName}
              recipes={g.recipes}
              onDelete={deleteRecipe}
            />
          ))
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setSelectedMenuId('');
            setPendingItems([]);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>레시피 추가</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 메뉴 선택 */}
            <div className="space-y-1.5">
              <Label>메뉴 선택 *</Label>
              <Select
                value={selectedMenuId}
                onValueChange={(v) => {
                  setSelectedMenuId(v ?? '');
                  setPendingItems([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="메뉴를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {menus?.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMenuId && (
              <>
                {/* 식자재 태그 팔레트 */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    식자재를 클릭해서 추가하세요
                  </p>
                  {!ingredients?.length ? (
                    <p className="text-xs text-muted-foreground italic">
                      등록된 식자재가 없습니다.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 rounded-xl border border-dashed p-3">
                      {ingredients.map((ing) => (
                        <IngredientTag
                          key={ing.id}
                          ingredient={ing}
                          added={addedIds.includes(ing.id)}
                          onClick={() => handleTagClick(ing.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 추가된 식자재 + 사용량 입력 */}
                {pendingItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_90px_auto_28px] items-center gap-2 px-1">
                      <Label className="text-xs text-muted-foreground">식자재</Label>
                      <Label className="text-xs text-muted-foreground">사용량</Label>
                      <Label className="text-xs text-muted-foreground">단위</Label>
                      <span />
                    </div>
                    {pendingItems.map((item) => {
                      const ing = ingredients?.find((i) => i.id === item.ingredientId);
                      if (!ing) return null;
                      return (
                        <div
                          key={item.ingredientId}
                          className="grid grid-cols-[1fr_90px_auto_28px] items-center gap-2 rounded-lg border bg-background px-2 py-1.5"
                        >
                          <span className="truncate text-sm">{ing.name}</span>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            value={item.amount}
                            onChange={(e) => handleAmountChange(item.ingredientId, e.target.value)}
                            className="h-8"
                          />
                          <span className="text-xs text-muted-foreground">{ing.unit}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePending(item.ingredientId)}
                            className="flex items-center justify-center rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Button
                  className="w-full bg-baro-blue hover:bg-baro-blue/80 text-white"
                  onClick={handleSave}
                  disabled={isCreating || pendingItems.every((p) => !p.amount)}
                >
                  저장하기
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsRecipesPage;
