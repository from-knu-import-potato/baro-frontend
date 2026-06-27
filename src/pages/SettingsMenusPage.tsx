import { useMemo, useRef, useState } from 'react';

import {
  ArrowLeft,
  Ban,
  ChevronDown,
  ChevronUp,
  ImageOff,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  ScanLine,
  Search,
  Star,
  Trash2,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import type { MenuCategoryDto } from '@/features/store-settings/api/menuCategories.api';
import type { MenuDto } from '@/features/store-settings/api/menus.api';
import { uploadMenuImage } from '@/features/store-settings/api/menus.api';
import MenuOcrModal, {
  type OcrMenuConfirmItem,
} from '@/features/store-settings/components/MenuOcrModal';
import {
  useMenuCategories,
  useCreateMenuCategory,
  useUpdateMenuCategory,
  useDeleteMenuCategory,
  useReorderMenuCategories,
} from '@/features/store-settings/hooks/useMenuCategories';
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
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shadcn/ui/select';
import { Skeleton } from '@/shadcn/ui/skeleton';

/* ── 모달 폼 타입 ── */
type MenuForm = {
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  categoryId: string;
  isFeatured: boolean;
};

const EMPTY_FORM: MenuForm = {
  name: '',
  description: '',
  price: '',
  imageUrl: null,
  categoryId: '',
  isFeatured: false,
};

/* ── 메뉴 등록/수정 모달 ── */
const MenuModal = ({
  open,
  editing,
  categories,
  existingNames = [],
  isSaving,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: MenuDto | null;
  categories: MenuCategoryDto[];
  existingNames?: string[];
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
          categoryId: editing.categoryId ?? '',
          isFeatured: editing.isFeatured,
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
    if (
      !editing &&
      existingNames.some((n) => n.trim().toLowerCase() === form.name.trim().toLowerCase())
    ) {
      next.name = '이미 등록된 메뉴 이름입니다';
    }
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
      categoryId: form.categoryId || null,
      isFeatured: form.isFeatured,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent showCloseButton={false} className="max-h-[calc(100svh-4rem)] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <UtensilsCrossed className="size-4 text-muted-foreground" />
            {editing ? '메뉴 수정' : '메뉴 등록'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto min-h-0">
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

          {/* 카테고리 */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="menu-category">카테고리</Label>
              <Select
                value={form.categoryId}
                onValueChange={(val) => setForm((p) => ({ ...p, categoryId: val ?? '' }))}
              >
                <SelectTrigger id="menu-category" className="h-10! w-full">
                  {form.categoryId ? (
                    <span className="text-sm">
                      {categories.find((c) => c.id === form.categoryId)?.name ?? '미분류'}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">카테고리 선택 (선택)</span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">미분류</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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

            {/* 대표 메뉴 토글 */}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))}
              className="mb-0.5 flex h-10 items-center gap-1.5 rounded-lg border px-3 transition-colors hover:bg-baro-yellow/10"
            >
              <Star
                className={
                  form.isFeatured
                    ? 'size-4 fill-baro-yellow text-baro-yellow'
                    : 'size-4 text-gray-300'
                }
              />
              <span className="text-xs font-medium text-muted-foreground">대표 메뉴</span>
            </button>
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="shrink-0">
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="shrink-0 bg-baro-blue hover:bg-baro-blue/80"
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
  onToggleFeatured,
  onToggleAvailable,
}: {
  menu: MenuDto;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onToggleAvailable: () => void;
}) => (
  <div
    className={`group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md${!menu.isAvailable ? ' opacity-60' : ''}`}
  >
    <div className="relative h-28 bg-gray-100 dark:bg-gray-800">
      {menu.imageUrl ? (
        <img src={menu.imageUrl} alt={menu.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageOff className="size-8 text-gray-300" />
        </div>
      )}
      {!menu.isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white">
            품절
          </span>
        </div>
      )}
      {/* 모바일: 항상 표시 / 데스크탑: hover 시 표시 */}
      <div className="absolute right-2 top-2 flex gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={onToggleFeatured}
          title={menu.isFeatured ? '대표 메뉴 해제' : '대표 메뉴 설정'}
          className="flex size-6 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-baro-yellow/10"
        >
          <Star
            className={
              menu.isFeatured ? 'size-3 fill-baro-yellow text-baro-yellow' : 'size-3 text-gray-400'
            }
          />
        </button>
        <button
          type="button"
          onClick={onToggleAvailable}
          title={menu.isAvailable ? '품절 처리' : '품절 해제'}
          className="flex size-6 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-red-50"
        >
          <Ban className={menu.isAvailable ? 'size-3 text-gray-400' : 'size-3 text-baro-red'} />
        </button>
        <button
          type="button"
          onClick={onEdit}
          title="메뉴 수정"
          className="flex size-6 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:text-baro-blue"
        >
          <Pencil className="size-3" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="메뉴 삭제"
          className="flex size-6 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:text-red-500"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </div>
    <div className="px-3 py-2.5">
      <p className="flex items-center gap-1 truncate text-sm font-semibold">
        {menu.isFeatured && <Star className="size-3 shrink-0 fill-baro-yellow text-baro-yellow" />}
        {menu.name}
      </p>
      {menu.description && (
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{menu.description}</p>
      )}
      <p className="mt-1 text-xs font-medium text-baro-blue">
        {Number(menu.price).toLocaleString()}원
      </p>
    </div>
  </div>
);

/* ── 카테고리 관리 섹션 ── */
const CategorySection = () => {
  const { data: categories = [], isLoading } = useMenuCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateMenuCategory();
  const { mutate: updateCategory } = useUpdateMenuCategory();
  const { mutate: deleteCategory } = useDeleteMenuCategory();
  const { mutate: reorder } = useReorderMenuCategories();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    createCategory(newName.trim(), {
      onSuccess: () => {
        setNewName('');
        setIsAdding(false);
      },
    });
  };

  const handleEditSave = (categoryId: string) => {
    if (!editName.trim()) return;
    updateCategory({ categoryId, name: editName.trim() }, { onSuccess: () => setEditingId(null) });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const ids = categories.map((c) => c.id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const [removed] = ids.splice(index, 1);
    ids.splice(newIndex, 0, removed);
    reorder(ids);
  };

  return (
    <div className="mb-6 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold">카테고리 관리</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            메뉴를 그룹으로 묶어 메뉴판을 구성합니다.
          </p>
        </div>
        {!isAdding && (
          <Button size="sm" variant="outline" onClick={() => setIsAdding(true)}>
            <Plus className="size-3.5 mr-1" /> 카테고리 추가
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {categories.length === 0 && !isAdding && (
            <div className="rounded-lg border-2 border-dashed border-gray-200 py-6 text-center">
              <p className="text-xs text-muted-foreground">
                카테고리를 추가하면 메뉴판을 섹션별로 구성할 수 있어요
              </p>
            </div>
          )}

          {categories.map((cat, index) =>
            editingId === cat.id ? (
              <div key={cat.id} className="flex items-center gap-2 rounded-lg bg-baro-blue/5 p-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(cat.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => handleEditSave(cat.id)}
                  className="h-8 shrink-0 bg-baro-blue text-white hover:bg-baro-blue/80"
                >
                  저장
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                  className="h-8 shrink-0"
                >
                  취소
                </Button>
              </div>
            ) : (
              <div key={cat.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50">
                <div className="flex flex-col">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="flex size-4 items-center justify-center text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-20"
                  >
                    <ChevronUp className="size-3" />
                  </button>
                  <button
                    disabled={index === categories.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="flex size-4 items-center justify-center text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-20"
                  >
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <p className="flex-1 text-sm">{cat.name}</p>
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                  }}
                  className="flex size-6 items-center justify-center text-gray-400 transition-colors hover:text-baro-blue"
                >
                  <Pencil className="size-3" />
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="flex size-6 items-center justify-center text-gray-400 transition-colors hover:text-red-500"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ),
          )}

          {isAdding && (
            <div className="flex items-center gap-2 rounded-lg bg-baro-blue/5 p-2">
              <Input
                placeholder="새 카테고리 이름"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAdd();
                  if (e.key === 'Escape') {
                    setIsAdding(false);
                    setNewName('');
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={isCreating}
                className="h-8 shrink-0 bg-baro-blue text-white hover:bg-baro-blue/80"
              >
                추가
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewName('');
                }}
                className="h-8 shrink-0"
              >
                취소
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── 메뉴 그리드 (카테고리별 그룹화) ── */
const MenuGrid = ({
  menus,
  categories,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleAvailable,
}: {
  menus: MenuDto[];
  categories: MenuCategoryDto[];
  onEdit: (menu: MenuDto) => void;
  onDelete: (menuId: string) => void;
  onToggleFeatured: (menu: MenuDto) => void;
  onToggleAvailable: (menu: MenuDto) => void;
}) => {
  const grouped = useMemo(() => {
    const result: { category: MenuCategoryDto | null; items: MenuDto[] }[] = [];

    if (categories.length === 0) {
      return [{ category: null, items: menus }];
    }

    for (const cat of categories) {
      const items = menus.filter((m) => m.categoryId === cat.id);
      if (items.length > 0) result.push({ category: cat, items });
    }

    const uncategorized = menus.filter(
      (m) => !m.categoryId || !categories.find((c) => c.id === m.categoryId),
    );
    if (uncategorized.length > 0) result.push({ category: null, items: uncategorized });

    return result;
  }, [menus, categories]);

  return (
    <div className="space-y-6">
      {grouped.map(({ category, items }) => (
        <div key={category?.id ?? 'uncategorized'}>
          {category && <p className="mb-3 text-sm font-semibold text-gray-700">{category.name}</p>}
          {!category && categories.length > 0 && (
            <p className="mb-3 text-sm font-semibold text-gray-400">미분류</p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onEdit={() => onEdit(menu)}
                onDelete={() => onDelete(menu.id)}
                onToggleFeatured={() => onToggleFeatured(menu)}
                onToggleAvailable={() => onToggleAvailable(menu)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── 메인 페이지 ── */
const SettingsMenusPage = () => {
  const navigate = useNavigate();
  const storeId = useAuthStore((s) => s.storeId);
  const { data: menus, isLoading } = useMenus();
  const { data: categories = [] } = useMenuCategories();
  const {
    mutate: createMenu,
    mutateAsync: createMenuAsync,
    isPending: isCreating,
  } = useCreateMenu();
  const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu();
  const { mutate: deleteMenu, isPending: isDeleting } = useDeleteMenu();

  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuDto | null>(null);
  const [modalKey, setModalKey] = useState(0);
  const [ocrOpen, setOcrOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredMenus = menus?.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const deleteTargetName = menus?.find((m) => m.id === deleteTargetId)?.name;

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

  const handleToggleFeatured = (menu: MenuDto) => {
    updateMenu({ menuId: menu.id, data: { isFeatured: !menu.isFeatured } });
  };

  const handleToggleAvailable = (menu: MenuDto) => {
    updateMenu({ menuId: menu.id, data: { isAvailable: !menu.isAvailable } });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteMenu(deleteTargetId, { onSuccess: () => setDeleteTargetId(null) });
  };

  const handleOcrConfirm = async (items: OcrMenuConfirmItem[]) => {
    for (const item of items) {
      let imageUrl: string | null = null;
      if (item.imageFile && storeId) {
        try {
          imageUrl = await uploadMenuImage(storeId, item.imageFile);
        } catch {
          // 이미지 업로드 실패 시 이미지 없이 메뉴 등록 진행
        }
      }
      await createMenuAsync({
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl,
        categoryId: null,
        isFeatured: item.isFeatured,
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <header className="shrink-0 flex flex-wrap items-center gap-3 border-b px-4 py-3 bg-background md:px-6 md:py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(routePaths.storeSettings)}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">메뉴 관리</p>
          <p className="text-xs text-muted-foreground">판매 메뉴를 등록하고 관리합니다.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="메뉴 이름 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-sm w-full"
            />
          </div>
          <Button size="sm" variant="outline" onClick={() => setOcrOpen(true)}>
            <ScanLine className="size-4 mr-1" /> 메뉴판으로 등록
          </Button>
          <Button
            size="sm"
            className="bg-baro-blue hover:bg-baro-blue/80 text-white"
            onClick={handleOpenNew}
          >
            <Plus className="size-4 mr-1" /> 메뉴 추가
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <CategorySection />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : !menus?.length ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
              <Plus className="size-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">등록된 메뉴가 없습니다</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                메뉴를 등록하는 방법을 선택해주세요
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOcrOpen(true)}
                className="gap-1.5"
              >
                <ScanLine className="size-4" /> 메뉴판으로 등록
              </Button>
              <Button
                size="sm"
                onClick={handleOpenNew}
                className="gap-1.5 bg-baro-blue text-white hover:bg-baro-blue/80"
              >
                <Plus className="size-4" /> 직접 등록하기
              </Button>
            </div>
          </div>
        ) : !filteredMenus?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <MenuGrid
            menus={filteredMenus}
            categories={categories}
            onEdit={handleOpenEdit}
            onDelete={setDeleteTargetId}
            onToggleFeatured={handleToggleFeatured}
            onToggleAvailable={handleToggleAvailable}
          />
        )}
      </div>

      <MenuModal
        key={modalKey}
        open={open}
        editing={editing}
        categories={categories}
        existingNames={(menus ?? []).map((m) => m.name)}
        isSaving={isCreating || isUpdating}
        onClose={handleClose}
        onSave={handleSave}
      />

      <MenuOcrModal
        open={ocrOpen}
        existingNames={(menus ?? []).map((m) => m.name)}
        onClose={() => setOcrOpen(false)}
        onConfirm={handleOcrConfirm}
        isConfirming={isCreating}
      />

      {/* 삭제 확인 모달 */}
      <Dialog open={!!deleteTargetId} onOpenChange={(v) => !v && setDeleteTargetId(null)}>
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="size-4 text-destructive" />
              메뉴 삭제
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{deleteTargetName}</span> 메뉴를
            삭제하시겠습니까?
            <br />
            삭제 후에는 복구할 수 없습니다.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTargetId(null)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsMenusPage;
