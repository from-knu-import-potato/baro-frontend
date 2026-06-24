import { useState } from 'react';

import { ImageOff, Loader2, Pencil, Plus, ScanLine, Star, Trash2 } from 'lucide-react';

import useAuthStore from '@/features/auth/store/authStore';
import MenuRegistrationModal from '@/features/initial-setup/components/MenuRegistrationModal';
import type { MenuItem } from '@/features/initial-setup/types/initialSetup.types';
import { uploadMenuOcrScan } from '@/features/store-settings/api/menus.api';
import MenuOcrReviewStep, {
  type OcrMenuReviewItem,
} from '@/features/store-settings/components/MenuOcrReviewStep';
import MenuOcrUploadStep from '@/features/store-settings/components/MenuOcrUploadStep';
import { Button } from '@/shadcn/ui/button';
import { getApiErrorMessage } from '@/shared/utils/apiError';

type OcrStep = 'upload' | 'analyzing' | 'review';

interface StepMenuRegistrationProps {
  data: MenuItem[];
  onChange: (data: MenuItem[]) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const StepMenuRegistration = ({ data, onChange }: StepMenuRegistrationProps) => {
  const storeId = useAuthStore((s) => s.storeId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [ocrStep, setOcrStep] = useState<OcrStep | null>(null);
  const [ocrItems, setOcrItems] = useState<OcrMenuReviewItem[]>([]);
  const [ocrError, setOcrError] = useState<string | null>(null);

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

  const handleOcrFileSelect = async (file: File) => {
    setOcrStep('analyzing');
    setOcrError(null);
    try {
      const items = await uploadMenuOcrScan(storeId ?? 'temp', file);
      setOcrItems(
        items.map((item, i) => ({
          id: `ocr-${Date.now()}-${i}`,
          name: item.name,
          price: String(item.price),
          description: item.description ?? '',
          isFeatured: false,
        })),
      );
      setOcrStep('review');
    } catch (err) {
      setOcrError(getApiErrorMessage(err, '메뉴 인식에 실패했습니다. 다시 시도해 주세요.'));
      setOcrStep('upload');
    }
  };

  const handleOcrConfirm = () => {
    const existingNamesLower = new Set(data.map((m) => m.name.trim().toLowerCase()));
    const unique: MenuItem[] = ocrItems
      .filter((item) => item.name.trim() && !existingNamesLower.has(item.name.trim().toLowerCase()))
      .map((item) => ({
        id: generateId(),
        name: item.name.trim(),
        description: item.description.trim(),
        price: Number(item.price) || 0,
        isFeatured: item.isFeatured,
        imageUrl: item.imageUrl,
        imageFile: item.imageFile,
      }));

    onChange([...data, ...unique]);
    setOcrStep(null);
    setOcrItems([]);
  };

  /* OCR 플로우 활성 중 */
  if (ocrStep !== null) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        {ocrStep === 'upload' && (
          <>
            {ocrError && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-3">
                {ocrError}
              </div>
            )}
            <MenuOcrUploadStep
              onFileSelect={handleOcrFileSelect}
              onBack={() => {
                setOcrStep(null);
                setOcrError(null);
              }}
            />
          </>
        )}

        {ocrStep === 'analyzing' && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="w-10 h-10 animate-spin text-baro-blue" />
            <div className="text-center">
              <p className="text-sm font-semibold">메뉴를 인식하는 중입니다</p>
              <p className="text-xs text-muted-foreground mt-1">잠시만 기다려주세요...</p>
            </div>
          </div>
        )}

        {ocrStep === 'review' && (
          <MenuOcrReviewStep
            items={ocrItems}
            existingNames={data.map((m) => m.name)}
            onItemsChange={setOcrItems}
            onConfirm={handleOcrConfirm}
            onReset={() => setOcrStep('upload')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {data.length === 0 ? (
        /* 빈 상태 — 방법 선택 */
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Plus className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">등록된 메뉴가 없습니다</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              메뉴를 등록하는 방법을 선택해주세요
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOcrStep('upload')}
              className="gap-1.5"
            >
              <ScanLine className="size-4" />
              메뉴판으로 등록
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleOpenNew}
              className="gap-1.5 bg-baro-blue text-white hover:bg-baro-blue-dark"
            >
              <Plus className="size-4" />
              직접 입력하기
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* 메뉴 카드 그리드 — 스크롤 영역 */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {data.map((menu) => (
                <div
                  key={menu.id}
                  className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
                >
                  <div className="relative h-28 bg-muted">
                    {menu.imageUrl ? (
                      <img
                        src={menu.imageUrl}
                        alt={menu.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageOff className="size-8 text-muted-foreground/40" />
                      </div>
                    )}

                    {menu.isFeatured && (
                      <div className="absolute left-2 top-2 flex items-center gap-0.5 rounded-full bg-baro-yellow px-1.5 py-0.5">
                        <Star className="size-2.5 fill-white text-white" />
                        <span className="text-[10px] font-bold text-white">대표</span>
                      </div>
                    )}

                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(menu)}
                        className="flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground/70 shadow-sm transition-colors hover:text-baro-blue"
                      >
                        <Pencil className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(menu.id)}
                        className="flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground/70 shadow-sm transition-colors hover:text-baro-red"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>

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
          </div>

          {/* 하단 버튼 — 고정 */}
          <div className="flex shrink-0 gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOcrStep('upload')}
              className="flex-1 gap-1.5 border-dashed h-10"
            >
              <ScanLine className="size-4" />
              메뉴판으로 등록
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenNew}
              className="flex-1 gap-1.5 border-dashed h-10"
            >
              <Plus className="size-4" />
              직접 입력하기
            </Button>
          </div>
        </>
      )}

      <MenuRegistrationModal
        open={isModalOpen}
        editingMenu={editingMenu}
        existingNames={data.map((m) => m.name)}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default StepMenuRegistration;
