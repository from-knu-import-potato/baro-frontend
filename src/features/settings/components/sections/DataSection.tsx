import { Database, Trash2 } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';
import SettingRow from '@/shared/components/SettingRow';
import SettingsSection from '@/shared/components/SettingsSection';

const DataSection = () => {
  return (
    <SettingsSection
      title="데이터 관리"
      description="가게 데이터를 초기화합니다."
      icon={<Database className="h-4 w-4" />}
    >
      <SettingRow
        label="데이터 초기화"
        description="모든 재고 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        action={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-baro-red text-baro-red hover:bg-baro-red/10 hover:text-baro-red"
          >
            <Trash2 className="h-3.5 w-3.5" />
            초기화
          </Button>
        }
      />
    </SettingsSection>
  );
};

export default DataSection;
