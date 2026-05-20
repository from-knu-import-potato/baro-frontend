import { useRef, useState } from 'react';

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, X } from 'lucide-react';

import { INGREDIENT_UNIT_SUGGESTIONS } from '@/features/initial-setup/constants/initialSetup.constants';
import type {
  Ingredient,
  MenuItem,
  Recipe,
  RecipeIngredient,
} from '@/features/initial-setup/types/initialSetup.types';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

interface StepIngredientsAndRecipesProps {
  menuItems: MenuItem[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  onRecipesChange: (recipes: Recipe[]) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

/* ────────────────────────────────────────────────
   서브컴포넌트: 식자재 태그
──────────────────────────────────────────────── */
interface IngredientTagProps {
  ingredient: Ingredient;
  isDragging?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'active' | 'recipe';
}

const IngredientTag = ({
  ingredient,
  isDragging,
  onClick,
  onRemove,
  variant = 'default',
}: IngredientTagProps) => (
  <div
    draggable={!!onClick}
    onDragStart={(e) => {
      e.dataTransfer.setData('ingredientId', ingredient.id);
      e.dataTransfer.effectAllowed = 'copy';
    }}
    onClick={onClick}
    className={cn(
      'inline-flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all select-none',
      variant === 'default' &&
        'border-gray-200 bg-white text-foreground dark:border-gray-700 dark:bg-gray-800',
      variant === 'active' &&
        'border-baro-blue bg-baro-blue/10 text-baro-blue dark:bg-baro-blue/20',
      variant === 'recipe' && 'border-baro-green/40 bg-baro-green/10 text-baro-green',
      onClick && 'cursor-pointer hover:border-baro-blue/60 hover:bg-baro-blue/5',
      isDragging && 'opacity-50',
    )}
  >
    {onClick && <GripVertical className="size-3 text-muted-foreground" />}
    <span>{ingredient.name}</span>
    <span className="text-muted-foreground">({ingredient.unit})</span>
    {onRemove && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-0.5 rounded-full p-0.5 hover:bg-red-100 hover:text-red-500"
      >
        <X className="size-3" />
      </button>
    )}
  </div>
);

/* ────────────────────────────────────────────────
   서브컴포넌트: 메뉴별 레시피 패널
──────────────────────────────────────────────── */
interface RecipePanelProps {
  menu: MenuItem;
  recipe: Recipe;
  ingredients: Ingredient[];
  onRecipeChange: (recipe: Recipe) => void;
}

const RecipePanel = ({ menu, recipe, ingredients, onRecipeChange }: RecipePanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const getIngredient = (id: string) => ingredients.find((i) => i.id === id);

  const isAlreadyAdded = (ingredientId: string) =>
    recipe.ingredients.some((ri) => ri.ingredientId === ingredientId);

  const addIngredientToRecipe = (ingredientId: string) => {
    if (isAlreadyAdded(ingredientId)) return;
    const newItem: RecipeIngredient = { id: generateId(), ingredientId, amount: 0 };
    onRecipeChange({ ...recipe, ingredients: [...recipe.ingredients, newItem] });
  };

  const removeIngredientFromRecipe = (recipeIngredientId: string) => {
    onRecipeChange({
      ...recipe,
      ingredients: recipe.ingredients.filter((ri) => ri.id !== recipeIngredientId),
    });
  };

  const updateAmount = (recipeIngredientId: string, amount: number) => {
    onRecipeChange({
      ...recipe,
      ingredients: recipe.ingredients.map((ri) =>
        ri.id === recipeIngredientId ? { ...ri, amount } : ri,
      ),
    });
  };

  /* 드래그 앤 드롭 핸들러 */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const ingredientId = e.dataTransfer.getData('ingredientId');
    if (ingredientId) addIngredientToRecipe(ingredientId);
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      {/* 헤더 */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{menu.name || '(이름 없음)'}</span>
          {menu.isFeatured && (
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
              대표
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            식자재 {recipe.ingredients.length}가지
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="border-t">
          {/* 식자재 클릭/드래그 팔레트 */}
          <div className="px-4 py-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              식자재를 클릭하거나 드래그해서 추가하세요
            </p>
            {ingredients.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                위 섹션에서 식자재를 먼저 등록해주세요
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {ingredients.map((ing) => (
                  <IngredientTag
                    key={ing.id}
                    ingredient={ing}
                    variant={isAlreadyAdded(ing.id) ? 'active' : 'default'}
                    onClick={
                      isAlreadyAdded(ing.id) ? undefined : () => addIngredientToRecipe(ing.id)
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* 드롭 영역 + 레시피 목록 */}
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'min-h-[56px] border-t transition-colors',
              isDragOver ? 'bg-baro-blue/5' : 'bg-transparent',
            )}
          >
            {recipe.ingredients.length === 0 ? (
              <div className="flex items-center justify-center py-4">
                <p
                  className={cn(
                    'text-xs',
                    isDragOver ? 'text-baro-blue font-medium' : 'text-muted-foreground',
                  )}
                >
                  {isDragOver ? '여기에 놓으세요' : '아직 추가된 식자재가 없습니다'}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 p-3">
                {/* 헤더 */}
                <div className="grid grid-cols-[1fr_90px_auto_28px] items-center gap-2 px-1">
                  <Label className="text-xs text-muted-foreground">식자재</Label>
                  <Label className="text-xs text-muted-foreground">사용량</Label>
                  <Label className="text-xs text-muted-foreground">단위</Label>
                  <span />
                </div>

                {recipe.ingredients.map((ri) => {
                  const ing = getIngredient(ri.ingredientId);
                  if (!ing) return null;
                  return (
                    <div
                      key={ri.id}
                      className="grid grid-cols-[1fr_90px_auto_28px] items-center gap-2 rounded-lg border bg-background px-2 py-1.5"
                    >
                      <span className="truncate text-sm">{ing.name}</span>
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={ri.amount === 0 ? '' : ri.amount}
                        onChange={(e) => updateAmount(ri.id, parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                      <span className="text-xs text-muted-foreground">{ing.unit}</span>
                      <button
                        type="button"
                        onClick={() => removeIngredientFromRecipe(ri.id)}
                        className="flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ────────────────────────────────────────────────
   메인 컴포넌트
──────────────────────────────────────────────── */
const StepIngredientsAndRecipes = ({
  menuItems,
  ingredients,
  recipes,
  onIngredientsChange,
  onRecipesChange,
}: StepIngredientsAndRecipesProps) => {
  const [inputName, setInputName] = useState('');
  const [inputUnit, setInputUnit] = useState('');
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

  /* ── 식자재 추가 ── */
  const handleAddIngredient = () => {
    const name = inputName.trim();
    const unit = inputUnit.trim();
    if (!name || !unit) return;

    // 중복 방지
    const alreadyExists = ingredients.some((i) => i.name === name && i.unit === unit);
    if (alreadyExists) return;

    onIngredientsChange([...ingredients, { id: generateId(), name, unit }]);
    setInputName('');
    setInputUnit('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter((i) => i.id !== id));
    // 레시피에서도 해당 식자재 제거
    onRecipesChange(
      recipes.map((recipe) => ({
        ...recipe,
        ingredients: recipe.ingredients.filter((ri) => ri.ingredientId !== id),
      })),
    );
  };

  /* ── 레시피 업데이트 ── */
  const getRecipeForMenu = (menuItemId: string): Recipe =>
    recipes.find((r) => r.menuItemId === menuItemId) ?? { menuItemId, ingredients: [] };

  const handleRecipeChange = (updatedRecipe: Recipe) => {
    const exists = recipes.some((r) => r.menuItemId === updatedRecipe.menuItemId);
    if (exists) {
      onRecipesChange(
        recipes.map((r) => (r.menuItemId === updatedRecipe.menuItemId ? updatedRecipe : r)),
      );
    } else {
      onRecipesChange([...recipes, updatedRecipe]);
    }
  };

  const filteredSuggestions = INGREDIENT_UNIT_SUGGESTIONS.filter(
    (u) => u.startsWith(inputUnit) && u !== inputUnit,
  );

  return (
    <div className="space-y-0">
      {/* ── 상단 섹션: 식자재 등록 ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">식자재 등록</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            사용하는 식자재 종류를 태그로 등록해주세요
          </p>
        </div>

        {/* 입력 행 */}
        <div className="flex gap-2">
          <Input
            placeholder="식자재 이름 (예: 원두)"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 flex-1"
          />
          <div className="relative">
            <Input
              placeholder="단위 (예: g)"
              value={inputUnit}
              onChange={(e) => {
                setInputUnit(e.target.value);
                setShowUnitSuggestions(true);
              }}
              onFocus={() => setShowUnitSuggestions(true)}
              onBlur={() => setTimeout(() => setShowUnitSuggestions(false), 150)}
              onKeyDown={handleKeyDown}
              className="h-9 w-24"
            />
            {/* 단위 자동완성 */}
            {showUnitSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 top-full z-20 mt-1 overflow-hidden rounded-lg border bg-popover shadow-md">
                {filteredSuggestions.slice(0, 6).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onMouseDown={() => {
                      setInputUnit(u);
                      setShowUnitSuggestions(false);
                    }}
                    className="flex w-full items-center px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleAddIngredient}
            disabled={!inputName.trim() || !inputUnit.trim()}
            className="h-9 gap-1 bg-baro-blue px-3 text-white hover:bg-baro-blue-dark"
          >
            <Plus className="size-4" />
            추가
          </Button>
        </div>

        {/* 식자재 태그 목록 */}
        {ingredients.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-5 text-center">
            <p className="text-xs text-muted-foreground">
              식자재를 입력하면 여기에 태그로 표시됩니다
            </p>
          </div>
        ) : (
          <div className="flex min-h-[48px] flex-wrap gap-2 rounded-xl border border-dashed border-gray-200 p-3">
            {ingredients.map((ing) => (
              <IngredientTag
                key={ing.id}
                ingredient={ing}
                onRemove={() => handleRemoveIngredient(ing.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 구분선 */}
      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center px-0">
          <div className="w-full border-t border-dashed border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs text-muted-foreground">레시피 등록</span>
        </div>
      </div>

      {/* ── 하단 섹션: 레시피 등록 ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">메뉴별 레시피</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            위에서 등록한 식자재를 클릭하거나 드래그해서 레시피를 구성하세요
          </p>
        </div>

        {menuItems.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center">
            <p className="text-sm text-muted-foreground">등록된 메뉴가 없습니다</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              이전 단계에서 메뉴를 먼저 등록해주세요
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {menuItems.map((menu) => (
              <RecipePanel
                key={menu.id}
                menu={menu}
                recipe={getRecipeForMenu(menu.id)}
                ingredients={ingredients}
                onRecipeChange={handleRecipeChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StepIngredientsAndRecipes;
