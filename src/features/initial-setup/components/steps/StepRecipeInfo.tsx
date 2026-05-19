import { useEffect, useRef, useState } from 'react';

import { Plus, Trash2 } from 'lucide-react';

import type {
  MenuItem,
  Recipe,
  RecipeIngredient,
} from '@/features/initial-setup/types/initialSetup.types';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

interface StepRecipeInfoProps {
  menuItems: MenuItem[];
  recipes: Recipe[];
  onChange: (recipes: Recipe[]) => void;
}

interface IngredientInputProps {
  value: string;
  suggestions: string[];
  onChange: (name: string) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const IngredientInput = ({ value, suggestions, onChange }: IngredientInputProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = value.trim()
    ? suggestions.filter((s) => s.includes(value.trim()) && s !== value.trim())
    : [];

  const showNew = value.trim() && !suggestions.includes(value.trim());

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Input
        placeholder="식자재 이름"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="h-8"
        autoComplete="off"
      />
      {open && (filtered.length > 0 || showNew) && (
        <ul className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
          {filtered.map((name) => (
            <li
              key={name}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(name);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-accent"
            >
              {name}
            </li>
          ))}
          {showNew && (
            <li
              onMouseDown={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
            >
              <span className="text-foreground">"{value.trim()}"</span> 새로 추가
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const StepRecipeInfo = ({ menuItems, recipes, onChange }: StepRecipeInfoProps) => {
  const getRecipe = (menuItemId: string): Recipe =>
    recipes.find((r) => r.menuItemId === menuItemId) ?? { menuItemId, ingredients: [] };

  const updateRecipe = (updatedRecipe: Recipe) => {
    const exists = recipes.some((r) => r.menuItemId === updatedRecipe.menuItemId);
    if (exists) {
      onChange(recipes.map((r) => (r.menuItemId === updatedRecipe.menuItemId ? updatedRecipe : r)));
    } else {
      onChange([...recipes, updatedRecipe]);
    }
  };

  const addIngredient = (menuItemId: string) => {
    const recipe = getRecipe(menuItemId);
    const newIngredient: RecipeIngredient = {
      id: generateId(),
      ingredientName: '',
      amount: 0,
      unit: '개',
    };
    updateRecipe({ ...recipe, ingredients: [...recipe.ingredients, newIngredient] });
  };

  const removeIngredient = (menuItemId: string, ingredientId: string) => {
    const recipe = getRecipe(menuItemId);
    updateRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((i) => i.id !== ingredientId),
    });
  };

  const updateIngredient = (
    menuItemId: string,
    ingredientId: string,
    updated: Partial<RecipeIngredient>,
  ) => {
    const recipe = getRecipe(menuItemId);
    updateRecipe({
      ...recipe,
      ingredients: recipe.ingredients.map((i) =>
        i.id === ingredientId ? { ...i, ...updated } : i,
      ),
    });
  };

  const allIngredientNames = Array.from(
    new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.ingredientName).filter(Boolean))),
  );

  if (menuItems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-10 text-center">
        <p className="text-sm text-muted-foreground">등록된 메뉴가 없습니다</p>
        <p className="text-xs text-muted-foreground">이전 단계에서 메뉴를 먼저 등록해주세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {menuItems.map((menu) => {
        const recipe = getRecipe(menu.id);

        return (
          <div key={menu.id} className="overflow-hidden rounded-xl border">
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{menu.name || '(이름 없음)'}</span>
                {menu.isFeatured && (
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    대표
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                식자재 {recipe.ingredients.length}개
              </span>
            </div>

            <div className="space-y-2 p-3">
              {recipe.ingredients.length > 0 && (
                <>
                  <div className="grid grid-cols-[1fr_80px_40px_32px] gap-2 px-1">
                    <Label className="text-xs text-muted-foreground">식자재 이름</Label>
                    <Label className="text-xs text-muted-foreground">수량</Label>
                    <Label className="text-xs text-muted-foreground">단위</Label>
                    <span />
                  </div>
                  {recipe.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="grid grid-cols-[1fr_80px_40px_32px] items-center gap-2"
                    >
                      <IngredientInput
                        value={ingredient.ingredientName}
                        suggestions={allIngredientNames}
                        onChange={(name) =>
                          updateIngredient(menu.id, ingredient.id, { ingredientName: name })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        step={0.1}
                        value={ingredient.amount === 0 ? '' : ingredient.amount}
                        onChange={(e) =>
                          updateIngredient(menu.id, ingredient.id, {
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-8"
                      />
                      <span className="flex h-8 w-10 items-center justify-center rounded-md border border-input bg-muted text-xs text-muted-foreground">
                        개
                      </span>
                      <button
                        type="button"
                        onClick={() => removeIngredient(menu.id, ingredient.id)}
                        className="flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addIngredient(menu.id)}
                className="w-full gap-1.5 border border-dashed text-xs text-muted-foreground"
              >
                <Plus className="size-3.5" />
                식자재 추가
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepRecipeInfo;
