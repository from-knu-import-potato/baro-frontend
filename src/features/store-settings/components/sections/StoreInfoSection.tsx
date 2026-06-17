import { useState } from 'react';

import { Store } from 'lucide-react';

import {
  useStoreSettings,
  useUpdateStoreSettings,
} from '@/features/store-settings/hooks/useStoreSettings';
import type { StoreSettings } from '@/features/store-settings/types/store-settings.types';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Skeleton } from '@/shadcn/ui/skeleton';
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

const labelOf = (options: { value: string; label: string }[], val: string) =>
  options.find((o) => o.value === val)?.label ?? val;

const StoreInfoSection = () => {
  const { data, isLoading } = useStoreSettings();
  const { mutate: updateStore, isPending } = useUpdateStoreSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<StoreSettings | null>(null);

  const handleEdit = () => {
    if (data) setForm(data);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!form) return;
    updateStore(form, { onSuccess: () => setIsEditing(false) });
  };

  const handleCancel = () => {
    if (data) setForm(data);
    setIsEditing(false);
  };

  const headerAction = isEditing ? (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleCancel}>
        취소
      </Button>
      <Button
        size="sm"
        className="bg-baro-blue hover:bg-baro-blue/80"
        onClick={handleSave}
        disabled={isPending}
      >
        저장
      </Button>
    </div>
  ) : (
    <Button variant="outline" size="sm" onClick={handleEdit}>
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
      {isLoading || !data ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-40" />
        </div>
      ) : isEditing && form ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">가게명</Label>
            <Input
              value={form.storeName}
              onChange={(e) => setForm((f) => f && { ...f, storeName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">대표자명</Label>
            <Input value={form.owner.name} disabled />
            <p className="text-[11px] text-muted-foreground">
              직원 추가 기능 오픈 후 변경 가능합니다.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">사업 유형</Label>
            <Select
              value={form.businessType}
              onValueChange={(val) =>
                setForm((f) => f && { ...f, businessType: val as StoreSettings['businessType'] })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
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
              onValueChange={(val) => setForm((f) => f && { ...f, category: val ?? f.category })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
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
      ) : (
        <div className="space-y-1">
          <InfoRow label="가게명" value={data.storeName} />
          <InfoRow label="대표자명" value={data.owner.name} />
          <InfoRow label="사업 유형" value={labelOf(BUSINESS_TYPE_OPTIONS, data.businessType)} />
          <InfoRow label="업종" value={labelOf(CATEGORY_OPTIONS, data.category)} />
        </div>
      )}
    </SettingsSection>
  );
};

export default StoreInfoSection;
