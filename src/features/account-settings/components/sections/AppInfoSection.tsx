import { ChevronRight, Info } from 'lucide-react';

import { APP_VERSION } from '@/features/account-settings/data/account-settings.mock';
import { Separator } from '@/shadcn/ui/separator';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const LinkRow = ({ label }: { label: string }) => (
  <SettingRow label={label} action={<ChevronRight className="h-4 w-4 text-muted-foreground" />} />
);

const AppInfoSection = () => {
  return (
    <SettingsSection title="앱 정보" icon={<Info className="h-4 w-4" />}>
      <SettingRow
        label="버전"
        action={<span className="text-sm text-muted-foreground">{APP_VERSION}</span>}
      />
      <Separator />
      <LinkRow label="이용약관" />
      <Separator />
      <LinkRow label="개인정보처리방침" />
      <Separator />
      <LinkRow label="오픈소스 라이선스" />
      <Separator />
      <LinkRow label="문의하기" />
    </SettingsSection>
  );
};

export default AppInfoSection;
