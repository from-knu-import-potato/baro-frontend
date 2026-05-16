import { Plus, Trash2 } from 'lucide-react';

import { INGREDIENT_UNITS } from '@/features/initial-setup/constants/initialSetup.constants';
import type {
  MenuItem,
  Recipe,
  RecipeIngredient,
} from '@/features/initial-setup/types/initialSetup.types';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';

interface StepRecipeInfoProps {
  menuItems: MenuItem[];
  recipes: Recipe[];
  onChange: (recipes: Recipe[]) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

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
                  <div className="grid grid-cols-[1fr_80px_88px_32px] gap-2 px-1">
                    <Label className="text-xs text-muted-foreground">식자재 이름</Label>
                    <Label className="text-xs text-muted-foreground">사용량</Label>
                    <Label className="text-xs text-muted-foreground">단위</Label>
                    <span />
                  </div>
                  {recipe.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="grid grid-cols-[1fr_80px_88px_32px] items-center gap-2"
                    >
                      <Input
                        placeholder="식자재 이름"
                        value={ingredient.ingredientName}
                        onChange={(e) =>
                          updateIngredient(menu.id, ingredient.id, {
                            ingredientName: e.target.value,
                          })
                        }
                        className="h-8"
                      />
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={ingredient.amount === 0 ? '' : ingredient.amount}
                        onChange={(e) =>
                          updateIngredient(menu.id, ingredient.id, {
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-8"
                      />
                      <Select
                        value={ingredient.unit}
                        onValueChange={(val) =>
                          val &&
                          updateIngredient(menu.id, ingredient.id, {
                            unit: val as RecipeIngredient['unit'],
                          })
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
