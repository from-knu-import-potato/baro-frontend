import { ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import { APP_VERSION } from '@/features/account-settings/data/account-settings.mock';
import { Separator } from '@/shadcn/ui/separator';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const LinkRow = ({
  label,
  href,
  external,
}: {
  label: string;
  href?: string;
  external?: boolean;
}) => {
  const content = (
    <>
      <p className="text-sm font-medium">{label}</p>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </>
  );

  const className =
    'flex items-center justify-between gap-4 rounded-lg -mx-2 px-2 transition-colors hover:bg-muted/50';

  if (!href) return <div className="flex items-center justify-between gap-4">{content}</div>;

  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  );
};

const AppInfoSection = () => {
  return (
    <SettingsSection title="앱 정보" icon={<Info className="h-4 w-4" />}>
      <SettingRow
        label="버전"
        action={<span className="text-sm text-muted-foreground">{APP_VERSION}</span>}
      />
      <Separator />
      <LinkRow label="이용약관" href={routePaths.terms} />
      <Separator />
      <LinkRow label="개인정보처리방침" href={routePaths.privacy} />
      <Separator />
      <LinkRow label="오픈소스 라이선스" />
      <Separator />
      <LinkRow label="문의하기" href="https://naver.me/xM5slAyu" external />
    </SettingsSection>
  );
};

export default AppInfoSection;
