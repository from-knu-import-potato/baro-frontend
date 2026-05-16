import { Plus, Star, Trash2 } from 'lucide-react';

import type { MenuItem } from '@/features/initial-setup/types/initialSetup.types';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

interface StepMenuRegistrationProps {
  data: MenuItem[];
  onChange: (data: MenuItem[]) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const StepMenuRegistration = ({ data, onChange }: StepMenuRegistrationProps) => {
  const addMenu = () => {
    onChange([...data, { id: generateId(), name: '', price: 0, isFeatured: false }]);
  };

  const removeMenu = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const updateMenu = (id: string, updated: Partial<MenuItem>) => {
    onChange(data.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-10 text-center">
          <p className="text-sm text-muted-foreground">등록된 메뉴가 없습니다</p>
          <p className="text-xs text-muted-foreground">아래 버튼으로 메뉴를 추가해주세요</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_110px_36px_36px] items-center gap-2 px-2">
            <Label className="text-xs text-muted-foreground">메뉴 이름</Label>
            <Label className="text-xs text-muted-foreground">가격 (원)</Label>
            <Label className="text-center text-xs text-muted-foreground">대표</Label>
            <span />
          </div>

          {data.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_110px_36px_36px] items-center gap-2 rounded-lg border px-2 py-1.5"
            >
              <Input
                placeholder="메뉴 이름"
                value={item.name}
                onChange={(e) => updateMenu(item.id, { name: e.target.value })}
                className="h-8 bg-white"
              />
              <Input
                type="number"
                placeholder="0"
                min={0}
                value={item.price === 0 ? '' : item.price}
                onChange={(e) => updateMenu(item.id, { price: parseInt(e.target.value) || 0 })}
                className="h-8 bg-white"
              />
              <button
                type="button"
                onClick={() => updateMenu(item.id, { isFeatured: !item.isFeatured })}
                title={item.isFeatured ? '대표 메뉴 해제' : '대표 메뉴 설정'}
                className="flex items-center justify-center"
              >
                <Star
                  className={
                    item.isFeatured
                      ? 'size-5 fill-yellow-400 text-yellow-400'
                      : 'size-5 text-gray-300 transition-colors hover:text-yellow-300'
                  }
                />
              </button>
              <button
                type="button"
                onClick={() => removeMenu(item.id)}
                className="flex items-center justify-center rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addMenu}
        className="w-full gap-1.5 border-dashed"
      >
        <Plus className="size-4" />
        메뉴 추가
      </Button>
    </div>
  );
};

export default StepMenuRegistration;
