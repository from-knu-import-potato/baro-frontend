import { User } from 'lucide-react';

import {
  BUSINESS_TYPE_OPTIONS,
  STORE_CATEGORY_OPTIONS,
} from '@/features/initial-setup/constants/initialSetup.constants';
import type { StoreBasicInfo } from '@/features/initial-setup/types/initialSetup.types';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shadcn/ui/select';

interface StepBasicInfoProps {
  data: StoreBasicInfo;
  userName: string;
  onChange: (data: StoreBasicInfo) => void;
  errors: Partial<Record<keyof StoreBasicInfo, string>>;
}

const StepBasicInfo = ({ data, userName, onChange, errors }: StepBasicInfoProps) => {
  return (
    <div className="space-y-5">
      {/* 대표자 이름 — 카카오톡에서 가져온 정보 */}
      <div className="flex items-center gap-3 rounded-xl border border-[#FEE500]/60 bg-[#FEE500]/10 px-4 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FEE500]">
          <User className="size-4 text-[#3C1E1E]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-muted-foreground">카카오톡 계정</p>
          <p className="text-sm font-semibold text-foreground">{userName}</p>
        </div>
        <span className="rounded-full bg-[#FEE500]/60 px-2 py-0.5 text-[10px] font-medium text-[#3C1E1E]">
          대표자
        </span>
      </div>

      {/* 가게 이름 */}
      <div className="space-y-1.5">
        <Label htmlFor="storeName">
          가게 이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="storeName"
          placeholder="예: 바로 카페 강원대점"
          value={data.storeName}
          onChange={(e) => onChange({ ...data, storeName: e.target.value })}
          aria-invalid={!!errors.storeName}
          className="h-10 focus:bg-background"
        />
        {errors.storeName && <p className="text-xs text-destructive">{errors.storeName}</p>}
      </div>

      {/* 업종 타입 */}
      <div className="space-y-1.5">
        <Label>업종 타입</Label>
        <Select
          value={data.businessType}
          onValueChange={(val) =>
            val && onChange({ ...data, businessType: val as StoreBasicInfo['businessType'] })
          }
        >
          <SelectTrigger className="h-10 w-full">
            <span className="flex-1 text-left text-sm">
              {BUSINESS_TYPE_OPTIONS.find((opt) => opt.value === data.businessType)?.label ?? (
                <span className="text-muted-foreground">업종을 선택하세요</span>
              )}
            </span>
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

      {/* 가게 카테고리 */}
      <div className="space-y-1.5">
        <Label>가게 카테고리</Label>
        <Select
          value={data.category}
          onValueChange={(val) =>
            val && onChange({ ...data, category: val as StoreBasicInfo['category'] })
          }
        >
          <SelectTrigger className="h-10 w-full">
            <span className="flex-1 text-left text-sm">
              {STORE_CATEGORY_OPTIONS.find((opt) => opt.value === data.category)?.label ?? (
                <span className="text-muted-foreground">카테고리를 선택하세요</span>
              )}
            </span>
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
