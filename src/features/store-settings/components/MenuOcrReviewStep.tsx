import { useRef, useState } from 'react';

import { ImagePlus, Plus, Star, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';

export interface OcrMenuReviewItem {
  id: string;
  name: string;
  price: string;
  description: string;
  isFeatured: boolean;
  imageUrl?: string;
  imageFile?: File;
}

interface MenuOcrReviewStepProps {
  items: OcrMenuReviewItem[];
  existingNames?: string[];
  onItemsChange: (items: OcrMenuReviewItem[]) => void;
  onConfirm: () => void;
  onReset: () => void;
}

const MenuOcrReviewStep = ({
  items,
  existingNames = [],
  onItemsChange,
  onConfirm,
  onReset,
}: MenuOcrReviewStepProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  const existingNamesLower = new Set(existingNames.map((n) => n.trim().toLowerCase()));
  const isDuplicate = (name: string) =>
    !!name.trim() && existingNamesLower.has(name.trim().toLowerCase());

  const handleChange = <K extends keyof OcrMenuReviewItem>(
    id: string,
    field: K,
    value: OcrMenuReviewItem[K],
  ) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (target?.imageUrl?.startsWith('blob:')) URL.revokeObjectURL(target.imageUrl);
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    onItemsChange([
      ...items,
      { id: `new-${Date.now()}`, name: '', price: '0', description: '', isFeatured: false },
    ]);
  };

  const handleImageClick = (itemId: string) => {
    setUploadingItemId(itemId);
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingItemId) return;
    const url = URL.createObjectURL(file);
    onItemsChange(
      items.map((item) =>
        item.id === uploadingItemId ? { ...item, imageUrl: url, imageFile: file } : item,
      ),
    );
    setUploadingItemId(null);
    e.target.value = '';
  };

  const confirmableCount = items.filter(
    (item) => item.name.trim() && !isDuplicate(item.name),
  ).length;
  const duplicateCount = items.filter((item) => item.name.trim() && isDuplicate(item.name)).length;

  return (
    <div className="flex flex-col h-full">
      {/* 스크롤 영역: 헤더 + 항목 목록 + 추가 버튼 */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pb-2 pr-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">내용을 확인하고 수정한 후 등록해주세요</p>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors shrink-0"
          >
            다시 업로드
          </button>
        </div>

        {/* 중복 안내 */}
        {duplicateCount > 0 && (
          <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
            이미 등록된 메뉴 <strong>{duplicateCount}개</strong>는 등록하지 않습니다. 이름을
            수정하거나 해당 항목을 삭제해주세요.
          </p>
        )}

        {/* 데스크탑 컬럼 헤더 */}
        <div className="hidden md:grid grid-cols-[36px_2fr_100px_2fr_36px_36px] gap-2 px-2 py-2 bg-muted/40 rounded-lg text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <span>사진</span>
          <span>메뉴명 *</span>
          <span>가격 *</span>
          <span>설명</span>
          <span className="text-center">대표</span>
          <span />
        </div>

        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const dup = isDuplicate(item.name);

            const thumbnail = (
              <button
                type="button"
                onClick={() => handleImageClick(item.id)}
                className="w-9 h-9 rounded-lg border overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors shrink-0"
                title="사진 추가"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="w-3.5 h-3.5 text-gray-300" />
                )}
              </button>
            );

            const nameField = (
              <div className="relative">
                <Input
                  value={item.name}
                  onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                  placeholder="메뉴명"
                  className={cn(
                    'h-8 text-sm',
                    dup && 'border-orange-400 bg-orange-50 focus-visible:ring-orange-300 pr-14',
                  )}
                />
                {dup && (
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-orange-600 bg-orange-100 border border-orange-300 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    이미 등록됨
                  </span>
                )}
              </div>
            );

            const priceField = (
              <div className="relative">
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleChange(item.id, 'price', e.target.value)}
                  placeholder="0"
                  min={0}
                  className="h-8 text-sm pr-6"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  원
                </span>
              </div>
            );

            const descField = (
              <Input
                value={item.description}
                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                placeholder="설명 (선택)"
                className="h-8 text-sm"
              />
            );

            const starBtn = (
              <button
                type="button"
                onClick={() => handleChange(item.id, 'isFeatured', !item.isFeatured)}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-baro-yellow/10 transition-colors"
                title={item.isFeatured ? '대표 메뉴 해제' : '대표 메뉴 설정'}
              >
                <Star
                  className={cn(
                    'w-4 h-4',
                    item.isFeatured
                      ? 'fill-baro-yellow text-baro-yellow'
                      : 'text-gray-300 hover:text-baro-yellow/50',
                  )}
                />
              </button>
            );

            const deleteBtn = (
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-baro-red hover:bg-red-50 transition-colors"
                aria-label="항목 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            );

            return (
              <div
                key={item.id}
                className={cn('rounded-lg transition-colors', dup && 'bg-orange-50/60')}
              >
                {/* 데스크탑 행 */}
                <div className="hidden md:grid grid-cols-[36px_2fr_100px_2fr_36px_36px] gap-2 items-center px-1 py-0.5">
                  {thumbnail}
                  {nameField}
                  {priceField}
                  {descField}
                  {starBtn}
                  {deleteBtn}
                </div>

                {/* 모바일 카드 */}
                <div className="md:hidden flex flex-col gap-2 px-1 py-2">
                  {/* 이름 + 대표 + 삭제 */}
                  <div className="flex items-center gap-2">
                    {thumbnail}
                    <div className="flex-1 min-w-0">{nameField}</div>
                    {starBtn}
                    {deleteBtn}
                  </div>
                  {/* 가격 + 설명 */}
                  <div className="grid grid-cols-2 gap-2 pl-11">
                    {priceField}
                    {descField}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 py-2.5 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          항목 직접 추가
        </button>
      </div>
      {/* /스크롤 영역 끝 */}

      <div className="shrink-0 flex justify-end border-t pt-3 pb-1">
        <Button
          type="button"
          onClick={onConfirm}
          disabled={confirmableCount === 0}
          className="bg-baro-blue hover:bg-baro-blue/90 text-white"
        >
          {confirmableCount}개 메뉴 등록하기
        </Button>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default MenuOcrReviewStep;
