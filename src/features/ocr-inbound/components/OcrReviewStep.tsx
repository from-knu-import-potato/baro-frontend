import { useEffect, useRef, useState } from 'react';

import {
  CheckCircle2,
  FileText,
  Link,
  Plus,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import IngredientLinkModal from '@/features/ocr-inbound/components/IngredientLinkModal';
import IngredientRegisterModal from '@/features/ocr-inbound/components/IngredientRegisterModal';
import type {
  ExistingIngredient,
  OcrInboundItem,
  OcrUnit,
} from '@/features/ocr-inbound/types/ocrInbound.types';
import { useIngredients } from '@/features/store-settings/hooks/useIngredients';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';

const UNITS: OcrUnit[] = ['g', 'ml', '개'];

interface OcrReviewStepProps {
  imageUrl: string;
  items: OcrInboundItem[];
  onItemsChange: (items: OcrInboundItem[]) => void;
  onConfirm: () => void;
  onReset: () => void;
  isConfirming?: boolean;
}

const OcrReviewStep = ({
  imageUrl,
  items,
  onItemsChange,
  onConfirm,
  onReset,
  isConfirming = false,
}: OcrReviewStepProps) => {
  const { data: ingredientList = [] } = useIngredients();
  const existingIngredients: ExistingIngredient[] = ingredientList.map((ing) => ({
    id: ing.id,
    name: ing.name,
    unit: ing.unit,
  }));
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [registerModal, setRegisterModal] = useState<{
    open: boolean;
    itemId: string;
    name: string;
    unit: OcrUnit;
  } | null>(null);
  const [linkModal, setLinkModal] = useState<{
    open: boolean;
    itemId: string;
    name: string;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  // 마우스 휠 줌 (passive: false 필요)
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      setScale((s) => Math.max(0.3, Math.min(5, s * factor)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: pos.x, posY: pos.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: dragRef.current.posX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.posY + (e.clientY - dragRef.current.startY),
    });
  };

  const handleMouseUp = () => setDragging(false);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.3));
  const handleResetView = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const handleChange = (id: string, field: keyof OcrInboundItem, value: string | number) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    onItemsChange([
      ...items,
      { id: `new-${Date.now()}`, name: '', quantity: 0, unit: 'g', unitPrice: null, isMatched: false },
    ]);
  };

  const matchedCount = items.filter((i) => i.isMatched).length;
  const newCount = items.length - matchedCount;

  return (
    <div className="flex h-full overflow-hidden">
      {/* 왼쪽: 이미지 뷰어 */}
      <div className="w-[45%] border-r flex flex-col overflow-hidden">
        {/* 뷰어 툴바 */}
        <div className="h-11 px-4 border-b shrink-0 flex items-center justify-between">
          <p className="text-sm font-semibold">원본 거래명세서</p>
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-muted-foreground w-12 text-center tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={handleResetView}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 이미지 뷰어 — 드래그 패닝 */}
        <div
          ref={viewerRef}
          className={cn(
            'flex-1 overflow-hidden bg-muted/30 flex items-center justify-center select-none',
            dragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={imageUrl}
            alt="거래명세서"
            draggable={false}
            className="rounded-lg border shadow-sm max-w-none"
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: dragging ? 'none' : 'transform 0.15s ease',
              pointerEvents: 'none',
              width: '85%',
            }}
          />
        </div>
      </div>

      {/* 오른쪽: 인식 결과 편집 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-11 px-4 border-b shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-baro-blue" />
              <p className="text-sm font-semibold">OCR 인식 결과</p>
            </div>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              총 {items.length}개
            </span>
            {matchedCount > 0 && (
              <span className="text-xs bg-blue-50 text-baro-blue px-2 py-0.5 rounded-full border border-blue-200/60">
                기존 재고 {matchedCount}개
              </span>
            )}
            {newCount > 0 && (
              <span className="text-xs bg-green-50 text-baro-green px-2 py-0.5 rounded-full border border-green-200/60">
                신규 {newCount}개
              </span>
            )}
          </div>
          <button
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground underline shrink-0"
          >
            다시 업로드
          </button>
        </div>

        <div className="grid grid-cols-[24px_2fr_1.2fr_80px_1fr_1fr_36px] gap-3 px-4 py-2 bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
          <span />
          <span>식자재명</span>
          <span>수량</span>
          <span>단위</span>
          <span>단가(원)</span>
          <span className="text-center">상태</span>
          <span />
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'grid grid-cols-[24px_2fr_1.2fr_80px_1fr_1fr_36px] gap-3 px-4 py-2.5 items-center border-b hover:bg-muted/10 transition-colors',
                !item.isMatched && 'bg-green-50/20',
              )}
            >
              <span className="text-xs text-muted-foreground/50 text-center">{index + 1}</span>
              <Input
                value={item.name}
                onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                className="h-8 text-sm"
                placeholder="식자재명"
              />
              <Input
                type="number"
                value={item.quantity || ''}
                onChange={(e) => handleChange(item.id, 'quantity', Number(e.target.value))}
                className="h-8 text-sm"
                min={0}
                placeholder="0"
              />
              {item.isMatched ? (
                <span className="h-8 flex items-center px-3 rounded-md border bg-muted text-sm text-muted-foreground">
                  {item.unit}
                </span>
              ) : (
                <Select
                  value={item.unit}
                  onValueChange={(v) => handleChange(item.id, 'unit', v as OcrUnit)}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Input
                type="number"
                value={item.unitPrice ?? ''}
                onChange={(e) =>
                  onItemsChange(
                    items.map((i) =>
                      i.id === item.id
                        ? { ...i, unitPrice: e.target.value === '' ? null : Number(e.target.value) }
                        : i,
                    ),
                  )
                }
                className="h-8 text-sm"
                min={0}
                placeholder="미입력"
              />
              <div className="flex items-center gap-1 justify-center flex-wrap">
                {item.isMatched ? (
                  <span className="inline-flex items-center gap-1 text-xs text-baro-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" />
                    기존
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setRegisterModal({
                          open: true,
                          itemId: item.id,
                          name: item.name,
                          unit: item.unit,
                        })
                      }
                      className="inline-flex items-center gap-0.5 text-xs text-baro-green bg-green-50 hover:bg-green-100 px-1.5 py-0.5 rounded-full border border-green-200/60 whitespace-nowrap transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      신규
                    </button>
                    <button
                      onClick={() => setLinkModal({ open: true, itemId: item.id, name: item.name })}
                      className="inline-flex items-center gap-0.5 text-xs text-baro-blue bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded-full border border-blue-200/60 whitespace-nowrap transition-colors cursor-pointer"
                    >
                      <Link className="w-3 h-3" />
                      연결
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-baro-red hover:bg-red-50 transition-colors"
                aria-label="항목 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <div className="px-4 py-3">
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              항목 직접 추가
            </button>
          </div>
        </div>

        <div className="border-t px-4 py-3 shrink-0 flex items-center justify-between bg-card">
          <p className="text-xs text-muted-foreground">
            내용을 확인·수정한 후 입고 확정을 눌러주세요
          </p>
          <Button
            onClick={onConfirm}
            disabled={items.length === 0 || isConfirming}
            className="bg-baro-blue hover:bg-baro-blue/90 text-white"
          >
            {isConfirming ? '처리 중...' : '입고 확정'}
          </Button>
        </div>
      </div>

      {registerModal && (
        <IngredientRegisterModal
          open={registerModal.open}
          initialName={registerModal.name}
          initialUnit={registerModal.unit}
          onClose={() => setRegisterModal(null)}
          onConfirm={(ingredientId) => {
            onItemsChange(
              items.map((item) =>
                item.id === registerModal.itemId
                  ? { ...item, isMatched: true, newIngredientId: ingredientId }
                  : item,
              ),
            );
            setRegisterModal(null);
          }}
        />
      )}

      {linkModal && (
        <IngredientLinkModal
          open={linkModal.open}
          ocrName={linkModal.name}
          ingredients={existingIngredients}
          onClose={() => setLinkModal(null)}
          onConfirm={(ingredient: ExistingIngredient) => {
            onItemsChange(
              items.map((item) =>
                item.id === linkModal.itemId
                  ? {
                      ...item,
                      name: ingredient.name,
                      unit: ingredient.unit,
                      isMatched: true,
                      matchedInventoryId: ingredient.id,
                    }
                  : item,
              ),
            );
            setLinkModal(null);
          }}
        />
      )}
    </div>
  );
};

export default OcrReviewStep;
