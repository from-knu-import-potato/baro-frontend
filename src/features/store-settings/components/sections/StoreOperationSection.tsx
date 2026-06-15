import { ChevronRight, ClipboardList, Layers, Palette, Salad, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
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
  const navigate = useNavigate();

  return (
    <SettingsSection
      title="운영 정보 관리"
      description="초기 세팅에서 입력한 메뉴·레시피·주요 식자재를 수정합니다."
      icon={<Layers className="h-4 w-4" />}
    >
      <div className="divide-y overflow-hidden rounded-lg border">
        <NavRow
          icon={<ClipboardList className="h-4 w-4" />}
          label="메뉴 관리"
          description="판매 중인 메뉴 목록을 추가·수정·삭제합니다."
          onClick={() => navigate(routePaths.storeSettingsMenus)}
        />
        <NavRow
          icon={<Palette className="h-4 w-4" />}
          label="메뉴판 설정"
          description="손님 메뉴판의 테마 색상, 레이아웃, 배너 이미지를 설정합니다."
          onClick={() => navigate(routePaths.storeSettingsMenuBoard)}
        />
        <NavRow
          icon={<UtensilsCrossed className="h-4 w-4" />}
          label="레시피 관리"
          description="각 메뉴의 재료 구성과 사용량을 관리합니다."
          onClick={() => navigate(routePaths.storeSettingsRecipes)}
        />
        <NavRow
          icon={<Salad className="h-4 w-4" />}
          label="주요 식자재 관리"
          description="재고 알림 기준이 되는 주요 식자재를 설정합니다."
          onClick={() => navigate(routePaths.storeSettingsIngredients)}
        />
      </div>
    </SettingsSection>
  );
};

export default StoreOperationSection;
