import { Monitor } from 'lucide-react';

import SettingRow from '@/features/settings/components/SettingRow';
import SettingsSection from '@/features/settings/components/SettingsSection';
import ThemeToggle from '@/features/theme/components/ThemeToggle';
import { useTheme } from '@/features/theme/hooks/useTheme';

const ThemeSection = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <SettingsSection
      title="화면"
      description="앱 화면의 테마를 설정합니다."
      icon={<Monitor className="h-4 w-4" />}
    >
      <SettingRow
        label="다크 모드"
        description={
          dark ? '다크 모드가 활성화되어 있습니다.' : '라이트 모드가 활성화되어 있습니다.'
        }
        action={<ThemeToggle dark={dark} toggleTheme={toggleTheme} />}
      />
    </SettingsSection>
  );
};

export default ThemeSection;
