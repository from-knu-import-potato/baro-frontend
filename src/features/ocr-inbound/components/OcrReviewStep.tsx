import { useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  Building2,
  CalendarIcon,
  FileText,
  Hash,
  Link,
  Plus,
  RotateCcw,
  Trash2,
  TriangleAlert,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import IngredientLinkModal from '@/features/ocr-inbound/components/IngredientLinkModal';
import type { OcrMetadata } from '@/features/ocr-inbound/types/ocrInbound.api.types';
import type {
  ExistingIngredient,
  OcrInboundItem,
  OcrUnit,
} from '@/features/ocr-inbound/types/ocrInbound.types';
import { deleteIngredient } from '@/features/store-settings/api/ingredients.api';
import { useIngredients } from '@/features/store-settings/hooks/useIngredients';
import { cn } from '@/lib/utils';
import { Button } from '@/shadcn/ui/button';
import { Calendar } from '@/shadcn/ui/calendar';
import { Input } from '@/shadcn/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shadcn/ui/tooltip';
import IngredientRegisterModal from '@/shared/components/IngredientRegisterModal';

const UNITS: OcrUnit[] = ['g', 'ml', '개'];

interface OcrReviewStepProps {
  imageUrl: string;
  items: OcrInboundItem[];
  metadata: OcrMetadata | null;
  onItemsChange: (items: OcrInboundItem[]) => void;
  onConfirm: () => void;
  onReset: () => void;
  isConfirming?: boolean;
}

const OcrReviewStep = ({
  imageUrl,
  items,
  metadata,
  onItemsChange,
  onConfirm,
  onReset,
  isConfirming = false,
}: OcrReviewStepProps) => {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
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
    currentIngredientId?: string;
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

  const handleChange = (id: string, field: keyof OcrInboundItem, value: string | number | null) => {
    onItemsChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleFactorChange = (id: string, value: string) => {
    const factor = value === '' ? undefined : Math.max(0, Number(value));
    onItemsChange(
      items.map((item) => {
        if (item.id !== id || !item.purchaseUnit) return item;
        const quantity =
          factor !== undefined && item.purchaseQuantity !== undefined
            ? item.purchaseQuantity * factor
            : 0;
        return { ...item, conversionFactor: factor, quantity };
        // unitPrice는 state에 저장하지 않고 렌더 시 purchaseUnitPrice / factor로 계산
      }),
    );
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const handleUnlink = (id: string) => {
    onItemsChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              name: item.originalName || item.name,
              isMatched: false,
              matchedInventoryId: undefined,
            }
          : item,
      ),
    );
  };

  const handleCancelRegistration = async (id: string, ingredientId: string) => {
    if (!storeId) return;
    try {
      await deleteIngredient(storeId, ingredientId);
      qc.invalidateQueries({ queryKey: ['ingredients', storeId] });
      onItemsChange(
        items.map((item) =>
          item.id === id ? { ...item, isMatched: false, newIngredientId: undefined } : item,
        ),
      );
    } catch {
      toast.error('등록 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleAdd = () => {
    onItemsChange([
      ...items,
      {
        id: `new-${Date.now()}`,
        name: '',
        originalName: '',
        quantity: 0,
        unit: 'g',
        unitPrice: null,
        supplyPrice: null,
        expiryDate: null,
        memo: null,
        isMatched: false,
        isWarning: false,
        warningReason: null,
      },
    ]);
  };

  const matchedCount = items.filter((i) => i.isMatched).length;
  const newCount = items.length - matchedCount;
  const needsFactorCount = items.filter(
    (i) => i.purchaseUnit && i.conversionFactor === undefined,
  ).length;
  const warningCount = items.filter((i) => i.isWarning).length;

  const metadataFields = metadata
    ? (
        [
          { label: '거래일자', value: metadata.transactionDate },
          {
            label: '공급업체',
            value: metadata.supplierName,
            icon: <Building2 className="w-3 h-3" />,
          },
          {
            label: '명세서 번호',
            value: metadata.invoiceNumber,
            icon: <Hash className="w-3 h-3" />,
          },
          {
            label: '총 거래금액',
            value:
              metadata.totalAmount != null ? `${metadata.totalAmount.toLocaleString()}원` : null,
          },
          {
            label: '공급가액 합계',
            value:
              metadata.totalSupplyAmount != null
                ? `${metadata.totalSupplyAmount.toLocaleString()}원`
                : null,
          },
        ] as { label: string; value: string | null; icon?: React.ReactNode }[]
      ).filter((f) => f.value != null)
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden md:flex-row">
      {/* 이미지 뷰어 — 모바일: 상단 고정 높이 / 데스크탑: 왼쪽 38% */}
      <div className="h-56 border-b shrink-0 flex flex-col overflow-hidden md:h-auto md:w-[38%] md:border-b-0 md:border-r">
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

      {/* 인식 결과 편집 */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="px-4 border-b shrink-0">
          {/* 데스크탑: 원래 단일 h-11 라인 */}
          <div className="hidden md:flex h-11 items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-baro-blue" />
                <p className="text-sm font-semibold">OCR 인식 결과</p>
              </div>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                총 {items.length}개
              </span>
              {matchedCount > 0 && (
                <span className="text-xs bg-blue-50 text-baro-blue px-2 py-0.5 rounded-full border border-blue-200/60 dark:bg-blue-950/40 dark:border-blue-800/40">
                  기존 재고 {matchedCount}개
                </span>
              )}
              {newCount > 0 && (
                <span className="text-xs bg-green-50 text-baro-green px-2 py-0.5 rounded-full border border-green-200/60 dark:bg-green-950/40 dark:border-green-800/40">
                  신규 {newCount}개
                </span>
              )}
              {needsFactorCount > 0 && (
                <span className="text-xs bg-baro-yellow/10 text-baro-yellow-text px-2 py-0.5 rounded-full border border-baro-yellow/30">
                  변환 필요 {needsFactorCount}개
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200/60 flex items-center gap-1 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40">
                  <TriangleAlert className="w-3 h-3" />
                  확인 필요 {warningCount}개
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
          {/* 모바일: 제목+버튼 / 배지 두 줄 */}
          <div className="md:hidden py-2 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-baro-blue" />
                <p className="text-sm font-semibold">OCR 인식 결과</p>
              </div>
              <button
                onClick={onReset}
                className="text-xs text-muted-foreground hover:text-foreground underline shrink-0"
              >
                다시 업로드
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                총 {items.length}개
              </span>
              {matchedCount > 0 && (
                <span className="text-xs bg-blue-50 text-baro-blue px-2 py-0.5 rounded-full border border-blue-200/60 dark:bg-blue-950/40 dark:border-blue-800/40">
                  기존 재고 {matchedCount}개
                </span>
              )}
              {newCount > 0 && (
                <span className="text-xs bg-green-50 text-baro-green px-2 py-0.5 rounded-full border border-green-200/60 dark:bg-green-950/40 dark:border-green-800/40">
                  신규 {newCount}개
                </span>
              )}
              {needsFactorCount > 0 && (
                <span className="text-xs bg-baro-yellow/10 text-baro-yellow-text px-2 py-0.5 rounded-full border border-baro-yellow/30">
                  변환 필요 {needsFactorCount}개
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-200/60 flex items-center gap-1 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/40">
                  <TriangleAlert className="w-3 h-3" />
                  확인 필요 {warningCount}개
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 거래 메타데이터 카드 */}
        {metadataFields.length > 0 && (
          <div className="px-4 py-2.5 border-b bg-muted/20 shrink-0">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {metadataFields.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="font-medium text-foreground/70">{f.label}</span>
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hidden md:grid grid-cols-[24px_2fr_1.2fr_80px_1fr_1.4fr_1fr_1.2fr_36px] gap-3 px-4 py-2 bg-muted/40 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
          <span />
          <span>식자재명</span>
          <span>수량</span>
          <span>단위</span>
          <span>단가(원)</span>
          <span>유통기한</span>
          <span className="text-center">상태</span>
          <span>비고</span>
          <span />
        </div>

        <div className="flex-1 overflow-y-auto">
          <TooltipProvider>
            {items.map((item, index) => {
              const derivedUnitPrice =
                item.purchaseUnit &&
                item.conversionFactor !== undefined &&
                item.conversionFactor > 0 &&
                item.purchaseUnitPrice !== undefined
                  ? Math.round((item.purchaseUnitPrice / item.conversionFactor) * 10) / 10
                  : null;

              const rowBg = item.isWarning
                ? 'bg-red-50/60 dark:bg-red-950/20'
                : item.purchaseUnit && !item.conversionFactor
                  ? 'bg-baro-yellow/10'
                  : !item.isMatched
                    ? 'bg-baro-green/10 dark:bg-baro-green/5'
                    : '';

              const warningIcon = item.isWarning ? (
                <Tooltip>
                  <TooltipTrigger className="flex items-center justify-center cursor-default">
                    <TriangleAlert className="w-3.5 h-3.5 text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.warningReason ?? '인식 결과가 불확실합니다. 내용을 확인해 주세요.'}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="text-xs text-muted-foreground/50">{index + 1}</span>
              );

              const quantityField = item.purchaseUnit ? (
                <div className="h-8 flex items-center px-3 rounded-md border bg-muted text-sm text-muted-foreground tabular-nums">
                  {item.quantity > 0 ? item.quantity.toLocaleString() : '—'}
                </div>
              ) : (
                <Input
                  type="number"
                  value={item.quantity || ''}
                  onChange={(e) => handleChange(item.id, 'quantity', Number(e.target.value))}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="0"
                />
              );

              const unitField = item.isMatched ? (
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
              );

              const priceField = (
                <Input
                  type="number"
                  value={derivedUnitPrice ?? item.unitPrice ?? ''}
                  onChange={(e) => {
                    if (derivedUnitPrice !== null) return;
                    onItemsChange(
                      items.map((i) =>
                        i.id === item.id
                          ? {
                              ...i,
                              unitPrice: e.target.value === '' ? null : Number(e.target.value),
                            }
                          : i,
                      ),
                    );
                  }}
                  readOnly={derivedUnitPrice !== null}
                  className="h-8 text-sm"
                  min={0}
                  placeholder="미입력"
                />
              );

              const expiryField = (
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      'h-8 w-full flex items-center gap-1.5 px-2.5 rounded-md border text-sm transition-colors hover:bg-muted/50',
                      item.expiryDate ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.expiryDate ?? '미입력'}</span>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.expiryDate ? new Date(item.expiryDate) : undefined}
                      onSelect={(date) =>
                        handleChange(
                          item.id,
                          'expiryDate',
                          date ? date.toLocaleDateString('sv') : null,
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
              );

              const registerBtn = (
                <button
                  onClick={() =>
                    setRegisterModal({
                      open: true,
                      itemId: item.id,
                      name: item.name,
                      unit: item.unit,
                    })
                  }
                  className="inline-flex items-center gap-0.5 text-xs text-baro-green bg-green-50 hover:bg-green-100 px-1.5 py-0.5 rounded-full border border-green-200/60 whitespace-nowrap transition-colors cursor-pointer dark:bg-green-950/40 dark:border-green-800/40 dark:hover:bg-green-950/60"
                >
                  <Plus className="w-3 h-3" />
                  신규
                </button>
              );
              const linkBtn = (
                <button
                  onClick={() => setLinkModal({ open: true, itemId: item.id, name: item.name })}
                  className="inline-flex items-center gap-0.5 text-xs text-baro-blue bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded-full border border-blue-200/60 whitespace-nowrap transition-colors cursor-pointer dark:bg-blue-950/40 dark:border-blue-800/40 dark:hover:bg-blue-950/60"
                >
                  <Link className="w-3 h-3" />
                  연결
                </button>
              );
              const relinkBtn = (
                <button
                  onClick={() =>
                    setLinkModal({
                      open: true,
                      itemId: item.id,
                      name: item.name,
                      currentIngredientId: item.matchedInventoryId,
                    })
                  }
                  className="inline-flex items-center gap-0.5 text-xs text-baro-blue bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded-full border border-blue-200/60 whitespace-nowrap transition-colors cursor-pointer dark:bg-blue-950/40 dark:border-blue-800/40 dark:hover:bg-blue-950/60"
                >
                  <RotateCcw className="w-3 h-3" />
                  재연결
                </button>
              );
              const unlinkBtn = (
                <button
                  onClick={() => handleUnlink(item.id)}
                  className="inline-flex items-center gap-0.5 text-xs text-muted-foreground bg-muted hover:bg-muted/70 px-1.5 py-0.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  연결 해제
                </button>
              );
              const cancelRegistrationBtn = (
                <button
                  onClick={() =>
                    item.newIngredientId && handleCancelRegistration(item.id, item.newIngredientId)
                  }
                  className="inline-flex items-center gap-0.5 text-xs text-baro-red bg-red-50 hover:bg-red-100 px-1.5 py-0.5 rounded-full border border-red-200/60 whitespace-nowrap transition-colors cursor-pointer dark:bg-red-950/40 dark:border-red-800/40 dark:hover:bg-red-950/60"
                >
                  <X className="w-3 h-3" />
                  등록 취소
                </button>
              );
              const statusField = item.matchedInventoryId ? (
                <div className="flex flex-col gap-1">
                  {relinkBtn}
                  {unlinkBtn}
                </div>
              ) : item.newIngredientId ? (
                cancelRegistrationBtn
              ) : (
                <div className="flex flex-col gap-1">
                  {registerBtn}
                  {linkBtn}
                </div>
              );
              const mobileStatusField = statusField;

              const nameField =
                item.matchedInventoryId || item.newIngredientId ? (
                  <span className="h-8 flex items-center px-3 rounded-md border bg-muted text-sm text-muted-foreground truncate">
                    {item.name}
                  </span>
                ) : (
                  <Input
                    value={item.name}
                    onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                    className="h-8 text-sm"
                    placeholder="식자재명"
                  />
                );

              const deleteBtn = (
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-baro-red hover:bg-red-50 transition-colors"
                  aria-label="항목 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              );

              return (
                <div key={item.id} className="border-b">
                  {/* 데스크탑 행 */}
                  <div
                    className={cn(
                      'hidden md:grid grid-cols-[24px_2fr_1.2fr_80px_1fr_1.4fr_1fr_1.2fr_36px] gap-3 px-4 py-2.5 items-center hover:bg-muted/10 transition-colors',
                      rowBg,
                    )}
                  >
                    <div className="flex items-center justify-center">{warningIcon}</div>
                    {nameField}
                    {quantityField}
                    {unitField}
                    {priceField}
                    {expiryField}
                    <div className="flex items-center gap-1 justify-center flex-wrap">
                      {statusField}
                    </div>
                    <span
                      className="text-xs text-muted-foreground truncate"
                      title={item.memo ?? ''}
                    >
                      {item.memo ?? '—'}
                    </span>
                    {deleteBtn}
                  </div>

                  {/* 모바일 카드 */}
                  <div className={cn('md:hidden px-4 py-3 space-y-2.5', rowBg)}>
                    {/* 이름 + 상태 + 삭제 */}
                    <div className="flex items-center gap-2">
                      <div className="w-5 shrink-0 flex justify-center">{warningIcon}</div>
                      <div className="flex-1 min-w-0">{nameField}</div>
                      <div className="shrink-0">{mobileStatusField}</div>
                      {deleteBtn}
                    </div>
                    {/* 수량 + 단위 */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">수량</p>
                        {quantityField}
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">단위</p>
                        {unitField}
                      </div>
                    </div>
                    {/* 단가 + 유통기한 */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">단가(원)</p>
                        {priceField}
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">유통기한</p>
                        {expiryField}
                      </div>
                    </div>
                    {/* 비고 (있을 때만) */}
                    {item.memo && (
                      <p className="text-xs text-muted-foreground">비고: {item.memo}</p>
                    )}
                  </div>

                  {/* 비표준 단위 변환 계수 입력 행 (공통) */}
                  {item.purchaseUnit && (
                    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-baro-yellow/10 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-baro-yellow-dark shrink-0" />
                      <span className="text-muted-foreground">명세서 원본:</span>
                      <span className="font-medium text-foreground">
                        {item.purchaseQuantity} {item.purchaseUnit}
                      </span>
                      <span className="text-muted-foreground">→ 1 {item.purchaseUnit} =</span>
                      <Input
                        type="number"
                        value={item.conversionFactor ?? ''}
                        onChange={(e) => handleFactorChange(item.id, e.target.value)}
                        className="h-6 w-24 text-xs"
                        min={0.001}
                        step="any"
                        placeholder="변환 계수"
                      />
                      <span className="text-muted-foreground">{item.unit}</span>
                      {item.conversionFactor !== undefined &&
                        item.purchaseQuantity !== undefined && (
                          <>
                            <span className="text-baro-yellow-text font-medium">
                              → 합계{' '}
                              {(item.purchaseQuantity * item.conversionFactor).toLocaleString()}{' '}
                              {item.unit}
                            </span>
                            {item.purchaseUnitPrice !== undefined && (
                              <span className="text-muted-foreground">
                                (단가 {item.purchaseUnitPrice.toLocaleString()}원/
                                {item.purchaseUnit}
                                {' → '}
                                {(
                                  Math.round(
                                    (item.purchaseUnitPrice / item.conversionFactor) * 10,
                                  ) / 10
                                ).toLocaleString()}
                                원/{item.unit})
                              </span>
                            )}
                          </>
                        )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="px-4 py-3">
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                항목 직접 추가
              </button>
            </div>
          </TooltipProvider>
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
          currentIngredientId={linkModal.currentIngredientId}
          onClose={() => setLinkModal(null)}
          onConfirm={(ingredient: ExistingIngredient) => {
            onItemsChange(
              items.map((item) =>
                item.id === linkModal.itemId
                  ? {
                      ...item,
                      // 첫 연결 시에만 originalName 저장 (재연결 시 덮어쓰지 않음)
                      ...(!item.matchedInventoryId && {
                        originalName: item.originalName || item.name,
                      }),
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
