import { useCallback, useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { uploadOcrImage } from '@/features/ocr-inbound/api/ocr.api';
import OcrReviewStep from '@/features/ocr-inbound/components/OcrReviewStep';
import OcrUploadStep from '@/features/ocr-inbound/components/OcrUploadStep';
import type { OcrMetadata } from '@/features/ocr-inbound/types/ocrInbound.api.types';
import type { OcrInboundItem } from '@/features/ocr-inbound/types/ocrInbound.types';
import { confirmInbound } from '@/features/store-settings/api/ingredients.api';
import { updateStoreSettings } from '@/features/store-settings/api/storeSettings.api';
import { useStoreSettings } from '@/features/store-settings/hooks/useStoreSettings';

type Step = 'upload' | 'analyzing' | 'review';

const SESSION_KEY = 'ocr-review-draft';

interface SessionDraft {
  imageBase64: string;
  metadata: OcrMetadata | null;
  items: OcrInboundItem[];
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const saveDraft = (draft: SessionDraft) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(draft));
  } catch {
    // 이미지 용량 초과 시 무시
  }
};

const clearDraft = () => sessionStorage.removeItem(SESSION_KEY);

const loadDraft = (): SessionDraft | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionDraft) : null;
  } catch {
    return null;
  }
};

const OcrInboundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  const { data: storeSettings } = useStoreSettings();
  const safetyStockPct = storeSettings?.safetyStockPct ?? 0;

  const locationState = location.state as { file?: File } | null;
  const hasNewFile = !!locationState?.file;

  // 새 파일이 없는 경우에만 sessionStorage에서 초기 상태 복원 (lazy 초기화로 setState-in-effect 회피)
  const [{ initialImageBase64, initialStep, initialItems, initialMetadata }] = useState(() => {
    if (hasNewFile) {
      return {
        initialImageBase64: null,
        initialStep: 'upload' as Step,
        initialItems: [] as OcrInboundItem[],
        initialMetadata: null,
      };
    }
    const draft = loadDraft();
    if (draft) {
      return {
        initialImageBase64: draft.imageBase64,
        initialStep: 'review' as Step,
        initialItems: draft.items,
        initialMetadata: draft.metadata,
      };
    }
    return {
      initialImageBase64: null,
      initialStep: 'upload' as Step,
      initialItems: [] as OcrInboundItem[],
      initialMetadata: null,
    };
  });

  const [imageUrl, setImageUrl] = useState<string | null>(initialImageBase64);
  const [imageBase64, setImageBase64] = useState<string | null>(initialImageBase64);
  const [step, setStep] = useState<Step>(initialStep);
  const [items, setItems] = useState<OcrInboundItem[]>(initialItems);
  const [metadata, setMetadata] = useState<OcrMetadata | null>(initialMetadata);
  const [isConfirming, setIsConfirming] = useState(false);
  const handledInitialFile = useRef(false);

  // 검수 중 아이템·메타데이터 변경 시 sessionStorage 동기화
  useEffect(() => {
    if (step !== 'review' || !imageBase64) return;
    saveDraft({ imageBase64, metadata, items });
  }, [items, metadata, step, imageBase64]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!storeId) {
        toast.error('가게 정보를 불러올 수 없습니다.');
        return;
      }
      const blobUrl = URL.createObjectURL(file);
      setImageUrl(blobUrl);
      setStep('analyzing');
      try {
        const [result, base64] = await Promise.all([
          uploadOcrImage(storeId, file),
          fileToBase64(file),
        ]);
        setImageBase64(base64);
        setMetadata(result.metadata);
        setItems(result.items);
        setStep('review');
        saveDraft({ imageBase64: base64, metadata: result.metadata, items: result.items });
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.error?.message
            ? err.response.data.error.message
            : 'OCR 처리에 실패했습니다. 잠시 후 다시 시도해주세요.';
        toast.error(message);
        URL.revokeObjectURL(blobUrl);
        setStep('upload');
        setImageUrl(null);
      }
    },
    [storeId],
  );

  useEffect(() => {
    if (locationState?.file && !handledInitialFile.current && storeId) {
      handledInitialFile.current = true;
      handleFileSelect(locationState.file);
    }
  }, [locationState, handleFileSelect, storeId]);

  const handleReset = () => {
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    clearDraft();
    setStep('upload');
    setImageUrl(null);
    setImageBase64(null);
    setItems([]);
    setMetadata(null);
  };

  const handleConfirm = async () => {
    const unmatched = items.filter((item) => !item.isMatched);
    if (unmatched.length > 0) {
      toast.warning(
        `미등록 식자재 ${unmatched.length}개가 있습니다. 모든 항목을 재고에 연결한 후 입고 확정해 주세요.`,
      );
      return;
    }
    if (!storeId) return;

    const inboundItems = items.map((item) => ({
      ingredientId: (item.matchedInventoryId ?? item.newIngredientId)!,
      amount: item.quantity,
      unitPrice: item.unitPrice ?? null,
      supplyPrice: item.supplyPrice ?? null,
      expiryDate: item.expiryDate ?? null,
      memo: item.memo ?? null,
    }));

    setIsConfirming(true);
    try {
      await confirmInbound(storeId, inboundItems, metadata ?? undefined);

      // 입고 완료 후 PATCH /stores/:storeId { safetyStockPct } 한 번으로
      // 백엔드가 전체 식자재 안전재고를 현재 재고 기준으로 일괄 재계산
      if (safetyStockPct > 0) {
        try {
          await updateStoreSettings(storeId, { safetyStockPct });
        } catch {
          // 안전재고 갱신 실패는 입고 완료를 막지 않음
        }
      }

      clearDraft();
      setImageBase64(null);
      qc.invalidateQueries({ queryKey: ['ingredients', storeId] });
      qc.invalidateQueries({ queryKey: ['storeSettings', storeId] });
      toast.success('재고 등록이 완료되었습니다.');
      navigate(routePaths.storeSettings);
    } catch {
      toast.error('입고 확정에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleBack = () => {
    if (step === 'upload') {
      navigate(-1);
    } else {
      handleReset();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* 헤더 */}
      <header className="shrink-0 h-14 border-b bg-card px-5 flex items-center gap-3">
        <button
          onClick={handleBack}
          disabled={step === 'analyzing' || isConfirming}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-baro-blue" />
          <span className="text-sm font-semibold">OCR 입고 처리</span>
        </div>
        {step === 'review' && (
          <p className="ml-auto text-xs text-muted-foreground">
            인식 결과를 확인·수정한 후 입고 확정해주세요
          </p>
        )}
      </header>

      {/* 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {step === 'upload' && <OcrUploadStep onFileSelect={handleFileSelect} />}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-baro-blue border-t-transparent animate-spin" />
            <p className="text-sm font-medium">거래명세서를 분석하는 중...</p>
            <p className="text-xs text-muted-foreground">잠시만 기다려 주세요</p>
          </div>
        )}

        {step === 'review' && imageUrl && (
          <OcrReviewStep
            imageUrl={imageUrl}
            items={items}
            metadata={metadata}
            onItemsChange={setItems}
            onConfirm={handleConfirm}
            onReset={handleReset}
            isConfirming={isConfirming}
          />
        )}
      </div>
    </div>
  );
};

export default OcrInboundPage;
