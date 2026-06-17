import { useState } from 'react';

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  Search,
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
  onEdit,
  onDeleteAll,
  onDeleteOne,
}: {
  menuId: string;
  menuName: string;
  recipes: RecipeDto[];
  onEdit: () => void;
  onDeleteAll: () => void;
  onDeleteOne: (recipeId: string) => void;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border">
      <div
        className="flex w-full items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{menuName}</span>
          <span className="text-xs text-muted-foreground">식자재 {recipes.length}가지</span>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-baro-blue hover:bg-baro-blue/5"
            onClick={onEdit}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-baro-red hover:bg-red-50"
            onClick={onDeleteAll}
            disabled={recipes.length === 0}
          >
            <Trash2 className="size-3.5" />
          </Button>
          {open ? (
            <ChevronUp className="size-4 text-muted-foreground ml-1" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground ml-1" />
          )}
        </div>
      </div>

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
                    onClick={() => onDeleteOne(r.id)}
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

type LocalRecipe = RecipeDto & { deleted?: boolean };

/* ── 메인 페이지 ── */
const SettingsRecipesPage = () => {
  const navigate = useNavigate();
  const { data: recipes, isLoading } = useRecipes();
  const { data: menus } = useMenus();
  const { data: ingredients } = useIngredients();
  const { mutate: createRecipe, isPending: isCreating } = useCreateRecipe();
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [deletingMenuId, setDeletingMenuId] = useState<string | null>(null);
  const [localRecipes, setLocalRecipes] = useState<LocalRecipe[]>([]);
  const [editAmounts, setEditAmounts] = useState<Record<string, string>>({});
  const [pendingItems, setPendingItems] = useState<{ ingredientId: string; amount: string }[]>([]);

  const openEdit = (menuId: string) => {
    const existing = recipes?.filter((r) => r.menuId === menuId) ?? [];
    setLocalRecipes(existing.map((r) => ({ ...r })));
    const amounts: Record<string, string> = {};
    existing.forEach((r) => {
      amounts[r.id] = String(r.amount);
    });
    setEditAmounts(amounts);
    setPendingItems([]);
    setEditingMenuId(menuId);
  };

  const closeModal = () => {
    setEditingMenuId(null);
    setLocalRecipes([]);
    setEditAmounts({});
    setPendingItems([]);
  };

  const handleDeleteAll = () => {
    if (!deletingMenuId) return;
    const toDelete = recipes?.filter((r) => r.menuId === deletingMenuId) ?? [];
    toDelete.forEach((r) => deleteRecipe(r.id));
    setDeletingMenuId(null);
  };

  const visibleRecipes = localRecipes.filter((r) => !r.deleted);
  const existingIngredientIds = visibleRecipes.map((r) => r.ingredientId);
  const addedIds = [...existingIngredientIds, ...pendingItems.map((p) => p.ingredientId)];

  const handleTagClick = (ingredientId: string) => {
    if (pendingItems.some((p) => p.ingredientId === ingredientId)) {
      setPendingItems((prev) => prev.filter((p) => p.ingredientId !== ingredientId));
    } else if (existingIngredientIds.includes(ingredientId)) {
      setLocalRecipes((prev) =>
        prev.map((r) => (r.ingredientId === ingredientId ? { ...r, deleted: true } : r)),
      );
    } else {
      setPendingItems((prev) => [...prev, { ingredientId, amount: '' }]);
    }
  };

  const handleRemoveExisting = (recipeId: string) => {
    setLocalRecipes((prev) => prev.map((r) => (r.id === recipeId ? { ...r, deleted: true } : r)));
  };

  const handleExistingAmountChange = (recipeId: string, amount: string) => {
    setEditAmounts((prev) => ({ ...prev, [recipeId]: amount }));
  };

  const handlePendingAmountChange = (ingredientId: string, amount: string) => {
    setPendingItems((prev) =>
      prev.map((p) => (p.ingredientId === ingredientId ? { ...p, amount } : p)),
    );
  };

  const handleRemovePending = (ingredientId: string) => {
    setPendingItems((prev) => prev.filter((p) => p.ingredientId !== ingredientId));
  };

  const handleSave = () => {
    const toDelete = localRecipes.filter((r) => r.deleted).map((r) => r.id);
    const toUpdate = localRecipes.filter(
      (r) =>
        !r.deleted && editAmounts[r.id] !== undefined && editAmounts[r.id] !== String(r.amount),
    );
    const toCreate = pendingItems.filter((p) => p.amount && Number(p.amount) > 0);

    const total = toDelete.length + toUpdate.length + toCreate.length;
    if (total === 0) {
      closeModal();
      return;
    }

    let remaining = total;
    const onDone = () => {
      remaining--;
      if (remaining === 0) closeModal();
    };

    toDelete.forEach((id) => deleteRecipe(id, { onSuccess: onDone }));

    toUpdate.forEach((recipe) => {
      deleteRecipe(recipe.id, {
        onSuccess: () => {
          createRecipe(
            {
              menuId: editingMenuId!,
              ingredientId: recipe.ingredientId,
              amount: Number(editAmounts[recipe.id]),
            },
            { onSuccess: onDone },
          );
        },
      });
    });

    toCreate.forEach((item) => {
      createRecipe(
        { menuId: editingMenuId!, ingredientId: item.ingredientId, amount: Number(item.amount) },
        { onSuccess: onDone },
      );
    });
  };

  const grouped = menus
    ?.map((menu) => ({
      menuId: menu.id,
      menuName: menu.name,
      recipes: recipes?.filter((r) => r.menuId === menu.id) ?? [],
    }))
    .filter((g) => g.menuName.toLowerCase().includes(searchQuery.toLowerCase()));

  const editingMenuName = menus?.find((m) => m.id === editingMenuId)?.name;
  const deletingMenuName = menus?.find((m) => m.id === deletingMenuId)?.name;
  const hasListItems = visibleRecipes.length > 0 || pendingItems.length > 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="shrink-0 flex items-center gap-3 border-b px-6 py-4 bg-background">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-semibold">레시피 관리</p>
          <p className="text-xs text-muted-foreground">메뉴별 식자재 사용량을 설정합니다.</p>
        </div>
        <div className="relative ml-auto w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="메뉴 이름 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 pr-3 text-sm"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : !menus?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">먼저 메뉴를 등록해주세요.</p>
          </div>
        ) : !grouped?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          grouped?.map((g) => (
            <RecipeAccordion
              key={g.menuId}
              menuId={g.menuId}
              menuName={g.menuName}
              recipes={g.recipes}
              onEdit={() => openEdit(g.menuId)}
              onDeleteAll={() => setDeletingMenuId(g.menuId)}
              onDeleteOne={deleteRecipe}
            />
          ))
        )}
      </div>

      <Dialog
        open={editingMenuId !== null}
        onOpenChange={(v) => {
          if (!v) closeModal();
        }}
      >
        <DialogContent className="flex max-h-[60vh] max-w-xl flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>레시피 수정</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{editingMenuName}</span>의 식자재
              사용량을 수정합니다
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pb-2">
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">식자재 선택</span>
                <div className="h-px flex-1 bg-border" />
              </div>

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
                      {visibleRecipes.map((recipe) => (
                        <div
                          key={recipe.id}
                          className="grid grid-cols-[1fr_96px_40px_32px] items-center gap-2 px-3.5 py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="size-1.5 shrink-0 rounded-full bg-gray-300" />
                            <span className="truncate text-sm">{recipe.ingredientName}</span>
                          </div>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            value={editAmounts[recipe.id] ?? String(recipe.amount)}
                            onChange={(e) => handleExistingAmountChange(recipe.id, e.target.value)}
                            className="h-8 px-2 text-right text-sm"
                          />
                          <span className="text-xs text-muted-foreground">
                            {recipe.ingredientUnit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExisting(recipe.id)}
                            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-baro-red"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}

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
                                handlePendingAmountChange(item.ingredientId, e.target.value)
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeModal}>
              취소
            </Button>
            <Button
              className="bg-baro-blue text-white hover:bg-baro-blue/80"
              onClick={handleSave}
              disabled={isCreating || isDeleting}
            >
              {isCreating || isDeleting ? <Loader2 className="size-4 animate-spin" /> : '저장하기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingMenuId !== null}
        onOpenChange={(v) => {
          if (!v) setDeletingMenuId(null);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>레시피 삭제</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{deletingMenuName}</span>의 레시피에
              등록된 식자재를 모두 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeletingMenuId(null)}>
              취소
            </Button>
            <Button
              className="bg-baro-red text-white hover:bg-baro-red/80"
              onClick={handleDeleteAll}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsRecipesPage;
