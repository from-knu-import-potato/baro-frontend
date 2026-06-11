import { useRef, useState } from 'react';

import { ArrowLeft, ImageOff, ImagePlus, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import type { MenuDto } from '@/features/store-settings/api/menus.api';
import { uploadMenuImage } from '@/features/store-settings/api/menus.api';
import {
  useMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
} from '@/features/store-settings/hooks/useMenus';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Skeleton } from '@/shadcn/ui/skeleton';

/* ── 모달 폼 타입 ── */
type MenuForm = {
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
};

const EMPTY_FORM: MenuForm = { name: '', description: '', price: '', imageUrl: null };

/* ── 메뉴 등록/수정 모달 ── */
const MenuModal = ({
  open,
  editing,
  isSaving,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: MenuDto | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Omit<MenuDto, 'id' | 'isAvailable'>) => void;
}) => {
  const storeId = useAuthStore((s) => s.storeId);
  const [form, setForm] = useState<MenuForm>(() =>
    editing
      ? {
          name: editing.name,
          description: editing.description ?? '',
          price: String(editing.price),
          imageUrl: editing.imageUrl,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<'name' | 'price', string>>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = '메뉴 이름을 입력해주세요';
    if (!form.price || isNaN(Number(form.price))) next.price = '올바른 가격을 입력해주세요';
    setErrors(next);
    return !Object.keys(next).length;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;
    setIsUploading(true);
    try {
      const url = await uploadMenuImage(storeId, file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      imageUrl: form.imageUrl,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{editing ? '메뉴 수정' : '메뉴 등록'}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-col">
          {/* 사진 업로드 */}
          <div className="space-y-1.5">
            <Label>메뉴 사진</Label>
            {isUploading ? (
              <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60">
                <Loader2 className="size-6 animate-spin text-baro-blue" />
                <span className="text-xs text-muted-foreground">업로드 중...</span>
              </div>
            ) : form.imageUrl ? (
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
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
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
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="h-10"
            />
          </div>

          {/* 가격 */}
          <div className="space-y-1.5">
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
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                aria-invalid={!!errors.price}
                className="h-10 pr-8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
            {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="bg-baro-blue hover:bg-baro-blue/80"
          >
            {editing ? '수정 완료' : '등록하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── 메뉴 카드 ── */
const MenuCard = ({
  menu,
  onEdit,
  onDelete,
}: {
  menu: MenuDto;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
    {/* 사진 영역 */}
    <div className="relative h-28 bg-gray-100 dark:bg-gray-800">
      {menu.imageUrl ? (
        <img src={menu.imageUrl} alt={menu.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageOff className="size-8 text-gray-300" />
        </div>
      )}

      {/* 액션 버튼 (호버 시) */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="flex size-6 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:text-baro-blue"
        >
          <Pencil className="size-3" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex size-6 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:text-red-500"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </div>

    {/* 정보 영역 */}
    <div className="px-3 py-2.5">
      <p className="truncate text-sm font-semibold">{menu.name}</p>
      {menu.description && (
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{menu.description}</p>
      )}
      <p className="mt-1 text-xs font-medium text-baro-blue">
        {Number(menu.price).toLocaleString()}원
      </p>
    </div>
  </div>
);

/* ── 메인 페이지 ── */
const SettingsMenusPage = () => {
  const navigate = useNavigate();
  const { data: menus, isLoading } = useMenus();
  const { mutate: createMenu, isPending: isCreating } = useCreateMenu();
  const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu();
  const { mutate: deleteMenu } = useDeleteMenu();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuDto | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const handleOpenNew = () => {
    setEditing(null);
    setModalKey((k) => k + 1);
    setOpen(true);
  };
  const handleOpenEdit = (menu: MenuDto) => {
    setEditing(menu);
    setModalKey((k) => k + 1);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSave = (data: Omit<MenuDto, 'id' | 'isAvailable'>) => {
    if (editing) {
      updateMenu({ menuId: editing.id, data }, { onSuccess: handleClose });
    } else {
      createMenu(data, { onSuccess: handleClose });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 border-b px-6 py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-sm font-semibold">메뉴 관리</p>
          <p className="text-xs text-muted-foreground">판매 메뉴를 등록하고 관리합니다.</p>
        </div>
        <Button
          size="sm"
          className="ml-auto bg-baro-blue hover:bg-baro-blue/80 text-white"
          onClick={handleOpenNew}
        >
          <Plus className="size-4 mr-1" /> 메뉴 추가
        </Button>
      </header>

      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : !menus?.length ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
              <Plus className="size-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">등록된 메뉴가 없습니다</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                아래 버튼으로 메뉴를 추가해주세요
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleOpenNew}
              className="gap-1.5 bg-baro-blue text-white hover:bg-baro-blue/80"
            >
              <Plus className="size-4" /> 메뉴 등록하기
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onEdit={() => handleOpenEdit(menu)}
                onDelete={() => deleteMenu(menu.id)}
              />
            ))}
          </div>
        )}
      </div>

      <MenuModal
        key={modalKey}
        open={open}
        editing={editing}
        isSaving={isCreating || isUpdating}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
};

export default SettingsMenusPage;
