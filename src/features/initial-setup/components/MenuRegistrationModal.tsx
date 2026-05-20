import { useEffect, useRef, useState } from 'react';

import { ImagePlus, Star, X } from 'lucide-react';

import type { MenuItem } from '@/features/initial-setup/types/initialSetup.types';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

interface MenuRegistrationModalProps {
  open: boolean;
  editingMenu: MenuItem | null;
  onClose: () => void;
  onSave: (menu: MenuItem) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  isFeatured: false,
  imageUrl: undefined as string | undefined,
};

type FormState = typeof EMPTY_FORM;

const MenuRegistrationModal = ({
  open,
  editingMenu,
  onClose,
  onSave,
}: MenuRegistrationModalProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<'name' | 'price', string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* 편집 모드 진입 시 폼 초기화 */
  useEffect(() => {
    if (open) {
      if (editingMenu) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          name: editingMenu.name,
          description: editingMenu.description,
          price: editingMenu.price === 0 ? '' : String(editingMenu.price),
          isFeatured: editingMenu.isFeatured,
          imageUrl: editingMenu.imageUrl,
        });
      } else {
        setForm(EMPTY_FORM);
      }

      setErrors({});
    }
  }, [open, editingMenu]);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = '메뉴 이름을 입력해주세요';
    if (!form.price || isNaN(Number(form.price))) next.price = '올바른 가격을 입력해주세요';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageUrl: objectUrl }));
  };

  const handleRemoveImage = () => {
    if (form.imageUrl) URL.revokeObjectURL(form.imageUrl);
    setForm((prev) => ({ ...prev, imageUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: editingMenu?.id ?? generateId(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      isFeatured: form.isFeatured,
      imageUrl: form.imageUrl,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b px-6 pt-4">
          <DialogTitle className="text-base">{editingMenu ? '메뉴 수정' : '메뉴 등록'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          {/* 사진 업로드 */}
          <div className="space-y-1.5">
            <Label>메뉴 사진</Label>
            {form.imageUrl ? (
              <div className="relative overflow-hidden rounded-xl border">
                <img src={form.imageUrl} alt="메뉴 미리보기" className="h-40 w-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 transition-colors hover:border-baro-blue/40 hover:bg-baro-blue/5 dark:bg-transparent"
              >
                <ImagePlus className="size-8 text-gray-300" />
                <span className="text-xs text-muted-foreground">사진을 추가해주세요 (선택)</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* 메뉴 이름 */}
          <div className="space-y-1.5">
            <Label htmlFor="menu-name">
              메뉴 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="menu-name"
              placeholder="예: 아메리카노"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              aria-invalid={!!errors.name}
              className="h-10"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* 메뉴 설명 */}
          <div className="space-y-1.5">
            <Label htmlFor="menu-desc">메뉴 설명</Label>
            <Input
              id="menu-desc"
              placeholder="예: 에스프레소에 물을 더해 부드럽게 즐기는 커피"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="h-10"
            />
          </div>

          {/* 가격 + 대표 메뉴 */}
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="menu-price">
                가격 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="menu-price"
                  type="number"
                  placeholder="0"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  aria-invalid={!!errors.price}
                  className="h-10 pr-8"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  원
                </span>
              </div>
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>

            {/* 대표 메뉴 토글 */}
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
              className="mb-0.5 flex h-10 items-center gap-1.5 rounded-lg border px-3 transition-colors hover:bg-yellow-50"
            >
              <Star
                className={
                  form.isFeatured
                    ? 'size-4 fill-yellow-400 text-yellow-400'
                    : 'size-4 text-gray-300'
                }
              />
              <span className="text-xs font-medium text-muted-foreground">대표 메뉴</span>
            </button>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 border-t p-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="bg-baro-blue text-white hover:bg-baro-blue-dark"
          >
            {editingMenu ? '수정 완료' : '등록하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MenuRegistrationModal;
