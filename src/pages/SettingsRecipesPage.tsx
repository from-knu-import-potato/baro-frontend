import { useState } from 'react';

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shadcn/ui/dialog';
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
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all select-none',
      added
        ? 'bg-baro-blue text-white hover:bg-baro-blue/80'
        : 'border border-gray-200 bg-white text-gray-600 hover:border-baro-blue/60 hover:bg-baro-blue/5 hover:text-baro-blue',
    )}
  >
    {added ? (
      <CheckCircle2 className="size-3 shrink-0" />
    ) : (
      <Plus className="size-3 shrink-0 text-gray-400" />
    )}
    {ingredient.name}
    <span className={cn('font-normal', added ? 'text-white/70' : 'text-gray-400')}>
      ({ingredient.unit})
    </span>
  </button>
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
  const existingIngredientIds = existingForMenu.map((r) => r.ingredientId);
  const addedIds = [...existingIngredientIds, ...pendingItems.map((p) => p.ingredientId)];

  const handleTagClick = (ingredientId: string) => {
    if (pendingItems.some((p) => p.ingredientId === ingredientId)) {
      setPendingItems((prev) => prev.filter((p) => p.ingredientId !== ingredientId));
    } else if (existingIngredientIds.includes(ingredientId)) {
      const recipe = existingForMenu.find((r) => r.ingredientId === ingredientId);
      if (recipe) deleteRecipe(recipe.id);
    } else {
      setPendingItems((prev) => [...prev, { ingredientId, amount: '' }]);
    }
  };

  const handleRemovePending = (ingredientId: string) => {
    setPendingItems((prev) => prev.filter((p) => p.ingredientId !== ingredientId));
  };

  const handleAmountChange = (ingredientId: string, amount: string) => {
    setPendingItems((prev) =>
      prev.map((p) => (p.ingredientId === ingredientId ? { ...p, amount } : p)),
    );
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedMenuId('');
    setPendingItems([]);
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
            if (remaining === 0) closeModal();
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

  const selectedMenuName = menus?.find((m) => m.id === selectedMenuId)?.name;
  const hasListItems = existingForMenu.length > 0 || pendingItems.length > 0;

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
          if (!v) closeModal();
          else setOpen(true);
        }}
      >
        <DialogContent className="flex max-h-[60vh] max-w-xl flex-col overflow-hidden">
          {/* 헤더 — 고정 */}
          <DialogHeader>
            <DialogTitle>레시피 추가</DialogTitle>
            <DialogDescription>메뉴별 식자재 사용량을 설정합니다</DialogDescription>
          </DialogHeader>

          {/* 본문 — 스크롤 */}
          <div className="flex-1 overflow-y-auto pb-2">
            {/* 메뉴 선택 */}
            <div className="space-y-1.5">
              <Label className="text-sm">
                메뉴 <span className="text-baro-red">*</span>
              </Label>
              <Select
                value={selectedMenuId}
                onValueChange={(v) => {
                  setSelectedMenuId(v ?? '');
                  setPendingItems([]);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="레시피를 추가할 메뉴를 선택하세요">
                    {selectedMenuName}
                  </SelectValue>
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
              <div className="space-y-4 py-2">
                {/* 구분선 */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">식자재 선택</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* 식자재 팔레트 */}
                {!ingredients?.length ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    등록된 식자재가 없습니다. 먼저 식자재를 등록해주세요.
                  </p>
                ) : (
                  <div className="rounded-xl border bg-gray-50/60 p-3 dark:bg-muted/20">
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ing) => (
                        <IngredientTag
                          key={ing.id}
                          ingredient={ing}
                          added={addedIds.includes(ing.id)}
                          onClick={() => handleTagClick(ing.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 재료 목록 (기존 저장 + 새로 추가) */}
                {hasListItems && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">사용량</span>
                      {pendingItems.length > 0 && (
                        <span className="text-xs font-medium text-baro-blue">
                          +{pendingItems.length}개 추가 예정
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden rounded-xl border">
                      <div className="grid grid-cols-[1fr_96px_40px_32px] items-center gap-2 border-b bg-muted/40 px-3.5 py-2 text-xs font-medium text-muted-foreground">
                        <span>식자재</span>
                        <span>사용량</span>
                        <span>단위</span>
                        <span />
                      </div>
                      <div className="divide-y">
                        {/* 기존 저장된 항목 — 읽기 전용 */}
                        {existingForMenu.map((recipe) => (
                          <div
                            key={recipe.id}
                            className="grid grid-cols-[1fr_96px_40px_32px] items-center gap-2 bg-muted/10 px-3.5 py-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="size-1.5 shrink-0 rounded-full bg-gray-300" />
                              <span className="truncate text-sm text-muted-foreground">
                                {recipe.ingredientName}
                              </span>
                            </div>
                            <span className="pr-1 text-right text-sm text-muted-foreground">
                              {Number(recipe.amount).toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {recipe.ingredientUnit}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteRecipe(recipe.id)}
                              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-baro-red"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* 새로 추가 중인 항목 — 사용량 입력 가능 */}
                        {pendingItems.map((item) => {
                          const ing = ingredients?.find((i) => i.id === item.ingredientId);
                          if (!ing) return null;
                          return (
                            <div
                              key={item.ingredientId}
                              className="grid grid-cols-[1fr_96px_40px_32px] items-center gap-2 px-3.5 py-2.5"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="size-1.5 shrink-0 rounded-full bg-baro-blue" />
                                <span className="truncate text-sm">{ing.name}</span>
                              </div>
                              <Input
                                type="number"
                                placeholder="0"
                                min={0}
                                value={item.amount}
                                onChange={(e) =>
                                  handleAmountChange(item.ingredientId, e.target.value)
                                }
                                className="h-8 px-2 text-right text-sm"
                              />
                              <span className="text-xs text-muted-foreground">{ing.unit}</span>
                              <button
                                type="button"
                                onClick={() => handleRemovePending(item.ingredientId)}
                                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-baro-red"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 푸터 — 고정 */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              취소
            </Button>
            <Button
              className="bg-baro-blue text-white hover:bg-baro-blue/80"
              onClick={handleSave}
              disabled={
                isCreating ||
                !selectedMenuId ||
                pendingItems.every((p) => !p.amount || Number(p.amount) <= 0)
              }
            >
              {isCreating ? <Loader2 className="size-4 animate-spin" /> : '저장하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsRecipesPage;
