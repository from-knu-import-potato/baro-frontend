import { ChevronRight, Palette, QrCode, Smartphone } from 'lucide-react';
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

const CustomerOrderSection = () => {
  const navigate = useNavigate();

  return (
    <SettingsSection
      title="손님 주문 설정"
      description="손님이 보는 메뉴판과 테이블 QR 코드를 관리합니다."
      icon={<Smartphone className="h-4 w-4" />}
    >
      <div className="divide-y overflow-hidden rounded-lg border">
        <NavRow
          icon={<Palette className="h-4 w-4" />}
          label="메뉴판 설정"
          description="손님 메뉴판의 테마 색상, 레이아웃, 배너 이미지를 설정합니다."
          onClick={() => navigate(routePaths.storeSettingsMenuBoard)}
        />
        <NavRow
          icon={<QrCode className="h-4 w-4" />}
          label="테이블 관리"
          description="테이블 수를 설정하고 손님 주문용 QR 코드를 생성합니다."
          onClick={() => navigate(routePaths.storeSettingsTable)}
        />
      </div>
    </SettingsSection>
  );
};

export default CustomerOrderSection;
