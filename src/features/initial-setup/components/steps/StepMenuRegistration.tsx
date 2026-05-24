import { useState } from 'react';

import { ImageOff, Pencil, Plus, Star, Trash2 } from 'lucide-react';

import MenuRegistrationModal from '@/features/initial-setup/components/MenuRegistrationModal';
import type { MenuItem } from '@/features/initial-setup/types/initialSetup.types';
import { Button } from '@/shadcn/ui/button';

interface StepMenuRegistrationProps {
  data: MenuItem[];
  onChange: (data: MenuItem[]) => void;
}

const StepMenuRegistration = ({ data, onChange }: StepMenuRegistrationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  const handleOpenNew = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleSave = (menu: MenuItem) => {
    if (editingMenu) {
      onChange(data.map((item) => (item.id === menu.id ? menu : item)));
    } else {
      onChange([...data, menu]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  return (
    <>
      {data.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
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
            type="button"
            size="sm"
            onClick={handleOpenNew}
            className="mt-1 gap-1.5 bg-baro-blue text-white hover:bg-baro-blue-dark"
          >
            <Plus className="size-4" />
            메뉴 등록하기
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 메뉴 카드 그리드 */}
          <div className="grid grid-cols-2 gap-3">
            {data.map((menu) => (
              <div
                key={menu.id}
                className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
              >
                {/* 사진 영역 */}
                <div className="relative h-28 bg-gray-100 dark:bg-gray-800">
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageOff className="size-8 text-gray-300" />
                    </div>
                  )}

                  {/* 대표 배지 */}
                  {menu.isFeatured && (
                    <div className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-yellow-400 px-1.5 py-0.5">
                      <Star className="size-2.5 fill-white text-white" />
                      <span className="text-[10px] font-bold text-white">대표</span>
                    </div>
                  )}

                  {/* 액션 버튼 (호버 시) */}
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(menu)}
                      className="flex size-6 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:text-baro-blue"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(menu.id)}
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
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {menu.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs font-medium text-baro-blue">
                    {menu.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 메뉴 추가 버튼 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenNew}
            className="w-full gap-1.5 border-dashed"
          >
            <Plus className="size-4" />
            메뉴 등록하기
          </Button>
        </div>
      )}

      <MenuRegistrationModal
        open={isModalOpen}
        editingMenu={editingMenu}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default StepMenuRegistration;
