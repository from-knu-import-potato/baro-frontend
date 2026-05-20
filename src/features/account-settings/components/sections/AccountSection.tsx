import { KeyRound, LogOut, UserCircle } from 'lucide-react';

import { MOCK_ACCOUNT_SETTINGS } from '@/features/account-settings/data/account-settings.mock';
import { Button } from '@/shadcn/ui/button';
import { Separator } from '@/shadcn/ui/separator';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const AccountSection = () => {
  return (
    <SettingsSection
      title="계정"
      description="계정 정보 및 보안 설정을 관리합니다."
      icon={<UserCircle className="h-4 w-4" />}
    >
      <SettingRow
        label="이름"
        action={<span className="text-sm text-muted-foreground">{MOCK_ACCOUNT_SETTINGS.name}</span>}
      />
      <Separator />
      <SettingRow
        label="로그아웃"
        description="현재 기기에서 로그아웃합니다."
        action={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-baro-red text-baro-red hover:bg-baro-red/10 hover:text-baro-red"
          >
            <LogOut className="h-3.5 w-3.5" />
            로그아웃
          </Button>
        }
      />
    </SettingsSection>
  );
};

export default AccountSection;
