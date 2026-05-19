import { useState } from 'react';

import { ChevronRight, ClipboardList, Layers, UtensilsCrossed } from 'lucide-react';

import StepMenuRegistration from '@/features/initial-setup/components/steps/StepMenuRegistration';
import StepRecipeInfo from '@/features/initial-setup/components/steps/StepRecipeInfo';
import type { MenuItem, Recipe } from '@/features/initial-setup/types/initialSetup.types';
import { MOCK_MENU_ITEMS, MOCK_RECIPES } from '@/features/settings/data/settings.mock';
import { Button } from '@/shadcn/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shadcn/ui/sheet';
import SettingsSection from '@/shared/components/SettingsSection';

interface NavRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

const NavRow = ({ icon, label, description, onClick }: NavRowProps) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 px-3 py-3.5 text-left transition-colors hover:bg-accent"
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
  </button>
);

const StoreOperationSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);

  const handleMenuSave = () => {
    // TODO: API 연동 후 실제 저장 로직으로 교체
    setMenuOpen(false);
  };

  const handleRecipeSave = () => {
    // TODO: API 연동 후 실제 저장 로직으로 교체
    setRecipeOpen(false);
  };

  return (
    <>
      <SettingsSection
        title="운영 정보 관리"
        description="초기 세팅에서 입력한 메뉴와 레시피를 수정합니다."
        icon={<Layers className="h-4 w-4" />}
      >
        <div className="divide-y overflow-hidden rounded-lg border">
          <NavRow
            icon={<ClipboardList className="h-4 w-4" />}
            label="메뉴 관리"
            description="판매 중인 메뉴 목록을 추가·수정·삭제합니다."
            onClick={() => setMenuOpen(true)}
          />
          <NavRow
            icon={<UtensilsCrossed className="h-4 w-4" />}
            label="레시피 관리"
            description="각 메뉴의 재료 구성과 사용량을 관리합니다."
            onClick={() => setRecipeOpen(true)}
          />
        </div>
      </SettingsSection>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          showCloseButton={false}
          className="flex flex-col gap-0 p-0 data-[side=right]:sm:max-w-lg"
        >
          <SheetHeader className="flex flex-row justify-between border-b pb-1">
            <SheetTitle>메뉴 관리</SheetTitle>
            <Button
              onClick={handleMenuSave}
              className="rounded-full bg-baro-blue text-white hover:bg-baro-blue-dark px-3"
            >
              저장
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-5">
            <StepMenuRegistration data={menuItems} onChange={setMenuItems} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={recipeOpen} onOpenChange={setRecipeOpen}>
        <SheetContent
          showCloseButton={false}
          className="flex flex-col gap-0 p-0 data-[side=right]:sm:max-w-lg"
        >
          <SheetHeader className="flex flex-row justify-between border-b pb-1">
            <SheetTitle>레시피 관리</SheetTitle>
            <Button
              onClick={handleRecipeSave}
              className="rounded-full bg-baro-blue text-white hover:bg-baro-blue-dark px-3"
            >
              저장
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-5">
            <StepRecipeInfo menuItems={menuItems} recipes={recipes} onChange={setRecipes} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default StoreOperationSection;
