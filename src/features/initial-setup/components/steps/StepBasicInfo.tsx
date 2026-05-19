import {
  BUSINESS_TYPE_OPTIONS,
  STORE_CATEGORY_OPTIONS,
} from '@/features/initial-setup/constants/initialSetup.constants';
import type { StoreBasicInfo } from '@/features/initial-setup/types/initialSetup.types';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';

interface StepBasicInfoProps {
  data: StoreBasicInfo;
  onChange: (data: StoreBasicInfo) => void;
  errors: Partial<Record<keyof StoreBasicInfo, string>>;
}

const StepBasicInfo = ({ data, onChange, errors }: StepBasicInfoProps) => {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="storeName">
          가게 이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="storeName"
          placeholder="예: 바로 카페 홍대점"
          value={data.storeName}
          onChange={(e) => onChange({ ...data, storeName: e.target.value })}
          aria-invalid={!!errors.storeName}
          className="h-10"
        />
        {errors.storeName && <p className="text-xs text-destructive">{errors.storeName}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ownerName">대표자 이름</Label>
        <Input
          id="ownerName"
          placeholder="예: 홍길동"
          value={data.ownerName}
          onChange={(e) => onChange({ ...data, ownerName: e.target.value })}
          className="h-10"
        />
        <p className="text-xs text-muted-foreground">
          카카오 계정 이름으로 자동 입력되며, 수정이 가능합니다.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>업종 타입</Label>
        <Select
          value={data.businessType}
          onValueChange={(val) =>
            val && onChange({ ...data, businessType: val as StoreBasicInfo['businessType'] })
          }
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>가게 카테고리</Label>
        <Select
          value={data.category}
          onValueChange={(val) =>
            val && onChange({ ...data, category: val as StoreBasicInfo['category'] })
          }
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STORE_CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StepBasicInfo;
