import { useState } from 'react';

import { Clock, Store } from 'lucide-react';

import {
  BUSINESS_TYPE_OPTIONS,
  DAY_OF_WEEK_CONFIG,
  STORE_CATEGORY_OPTIONS,
} from '@/features/initial-setup/constants/initialSetup.constants';
import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';
import { MOCK_STORE_SETTINGS } from '@/features/settings/data/settings.mock';
import type { StoreSettings } from '@/features/settings/types/settings.types';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Switch } from '@/shadcn/ui/switch';
import SettingsSection from '@/shared/components/SettingsSection';

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-4 py-1">
    <span className="w-24 shrink-0 text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const TimeInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="relative flex items-center">
    <Clock className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-36 rounded-lg border border-input pl-8 pr-3 text-sm outline-none transition-colors focus:border-baro-blue focus:ring-2 focus:ring-baro-blue/20"
    />
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

  const handleHourUpdate = (index: number, updated: Partial<OperatingHour>) => {
    setForm((f) => ({
      ...f,
      operatingHours: f.operatingHours.map((h, i) => (i === index ? { ...h, ...updated } : h)),
    }));
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
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">가게 이름</Label>
              <Input
                value={form.storeName}
                onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">대표자 이름</Label>
              <Input
                value={form.ownerName}
                onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">업종 타입</Label>
              <Select
                value={form.businessType}
                onValueChange={(val) =>
                  setForm((f) => ({ ...f, businessType: val as StoreSettings['businessType'] }))
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
              <Label className="text-xs text-muted-foreground">가게 카테고리</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm((f) => ({ ...f, category: val as string }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STORE_CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">영업 시간</Label>
            <div className="mt-1.5 space-y-2">
              {DAY_OF_WEEK_CONFIG.map((day, index) => {
                const hour = form.operatingHours[index];
                const isSat = day.value === 'saturday';
                const isSun = day.value === 'sunday';
                return (
                  <div
                    key={day.value}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                      hour.isOpen
                        ? 'border-baro-blue/25 bg-baro-blue/5 dark:border-baro-blue-dark/15 dark:bg-baro-blue-dark/3'
                        : 'border-gray-100 bg-gray-50/80 dark:bg-baro-black/80 dark:border-baro-black',
                    )}
                  >
                    <span
                      className={cn(
                        'w-14 shrink-0 text-sm font-medium',
                        isSat ? 'text-blue-500' : isSun ? 'text-red-500' : 'text-foreground',
                      )}
                    >
                      {day.label}
                    </span>
                    <Switch
                      checked={hour.isOpen}
                      onCheckedChange={(checked) => handleHourUpdate(index, { isOpen: checked })}
                    />
                    {hour.isOpen ? (
                      <div className="flex flex-1 items-center gap-2">
                        <TimeInput
                          value={hour.openTime}
                          onChange={(v) => handleHourUpdate(index, { openTime: v })}
                        />
                        <span className="text-xs text-muted-foreground">~</span>
                        <TimeInput
                          value={hour.closeTime}
                          onChange={(v) => handleHourUpdate(index, { closeTime: v })}
                        />
                      </div>
                    ) : (
                      <span className="flex-1 text-sm text-muted-foreground">휴무</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <InfoRow label="가게 이름" value={saved.storeName} />
          <InfoRow label="대표자 이름" value={saved.ownerName} />
          <InfoRow label="업종 타입" value={labelOf(BUSINESS_TYPE_OPTIONS, saved.businessType)} />
          <InfoRow label="가게 카테고리" value={labelOf(STORE_CATEGORY_OPTIONS, saved.category)} />

          <div className="flex items-start gap-4 py-1">
            <span className="w-24 shrink-0 text-sm text-muted-foreground">영업 시간</span>
            <div className="grid flex-1 grid-cols-7 gap-1.5">
              {DAY_OF_WEEK_CONFIG.map((day, index) => {
                const hour = saved.operatingHours[index];
                const isSat = day.value === 'saturday';
                const isSun = day.value === 'sunday';
                return (
                  <div
                    key={day.value}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-center',
                      !hour.isOpen && 'opacity-40',
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs font-bold leading-none',
                        isSat ? 'text-blue-500' : isSun ? 'text-red-500' : 'text-foreground',
                      )}
                    >
                      {day.label[0]}
                    </span>
                    {hour.isOpen ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-medium tabular-nums leading-none">
                          {hour.openTime}
                        </span>
                        <div className="h-px w-4 bg-border" />
                        <span className="text-[10px] font-medium tabular-nums leading-none">
                          {hour.closeTime}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">휴무</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </SettingsSection>
  );
};

export default StoreInfoSection;
