import { useState } from 'react';

import { Store } from 'lucide-react';

import { MOCK_STORE_SETTINGS } from '@/features/store-settings/data/store-settings.mock';
import type { StoreSettings } from '@/features/store-settings/types/store-settings.types';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import SettingsSection from '@/shared/components/SettingsSection';

const BUSINESS_TYPE_OPTIONS = [
  { value: 'individual', label: '개인' },
  { value: 'franchise', label: '프랜차이즈' },
  { value: 'directly-operated', label: '직영' },
];

const CATEGORY_OPTIONS = [
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'cafe', label: '카페' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' },
  { value: 'bunsik', label: '분식' },
  { value: 'fastfood', label: '패스트푸드' },
  { value: 'other', label: '기타' },
];

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-4 py-1">
    <span className="w-24 shrink-0 text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const StoreInfoSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<StoreSettings>(MOCK_STORE_SETTINGS);
  const [saved, setSaved] = useState<StoreSettings>(MOCK_STORE_SETTINGS);

  const handleSave = () => {
    setSaved(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm(saved);
    setIsEditing(false);
  };

  const labelOf = (options: { value: string; label: string }[], val: string) =>
    options.find((o) => o.value === val)?.label ?? val;

  const headerAction = isEditing ? (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCancel}>
        취소
      </Button>
      <Button size="sm" className="bg-baro-blue hover:bg-baro-blue/80" onClick={handleSave}>
        저장
      </Button>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
      수정
    </Button>
  );

  return (
    <SettingsSection
      title="가게 정보"
      description="가게의 기본 정보를 관리합니다."
      icon={<Store className="h-4 w-4" />}
      headerAction={headerAction}
    >
      {isEditing ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">가게명</Label>
              <Input
                value={form.storeName}
                onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">대표자명</Label>
              <Input
                value={form.ownerName}
                onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">사업 유형</Label>
              <Select
                value={form.businessType}
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, businessType: val as StoreSettings['businessType'] }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: string) =>
                      BUSINESS_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">업종</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm((f) => ({ ...f, category: val as string }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value: string) =>
                      CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <InfoRow label="가게명" value={saved.storeName} />
          <InfoRow label="대표자명" value={saved.ownerName} />
          <InfoRow label="사업 유형" value={labelOf(BUSINESS_TYPE_OPTIONS, saved.businessType)} />
          <InfoRow label="업종" value={labelOf(CATEGORY_OPTIONS, saved.category)} />
        </div>
      )}
    </SettingsSection>
  );
};

export default StoreInfoSection;
