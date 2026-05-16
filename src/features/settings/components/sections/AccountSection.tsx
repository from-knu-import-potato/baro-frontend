import { KeyRound, LogOut, UserCircle } from 'lucide-react';

import SettingRow from '@/features/settings/components/SettingRow';
import SettingsSection from '@/features/settings/components/SettingsSection';
import { MOCK_ACCOUNT_SETTINGS } from '@/features/settings/data/settings.mock';
import { Button } from '@/shadcn/ui/button';
import { Separator } from '@/shadcn/ui/separator';

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
        label="이메일"
        action={
          <span className="text-sm text-muted-foreground">{MOCK_ACCOUNT_SETTINGS.email}</span>
        }
      />
      <Separator />
      <SettingRow
        label="비밀번호"
        description="주기적으로 비밀번호를 변경하면 계정을 안전하게 보호할 수 있습니다."
        action={
          <Button variant="outline" size="sm" className="gap-1.5">
            <KeyRound className="h-3.5 w-3.5" />
            변경
          </Button>
        }
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
