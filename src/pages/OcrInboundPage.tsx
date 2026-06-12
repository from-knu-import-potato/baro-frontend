import { useCallback, useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { routePaths } from '@/app/routes/routePaths';
import useAuthStore from '@/features/auth/store/authStore';
import { uploadOcrImage } from '@/features/ocr-inbound/api/ocr.api';
import OcrReviewStep from '@/features/ocr-inbound/components/OcrReviewStep';
import OcrUploadStep from '@/features/ocr-inbound/components/OcrUploadStep';
import type { OcrInboundItem } from '@/features/ocr-inbound/types/ocrInbound.types';
import { confirmInbound } from '@/features/store-settings/api/ingredients.api';

type Step = 'upload' | 'analyzing' | 'review';

const OcrInboundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();

  const locationState = location.state as { file?: File } | null;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('upload');
  const [items, setItems] = useState<OcrInboundItem[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const handledInitialFile = useRef(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!storeId) {
        toast.error('가게 정보를 불러올 수 없습니다.');
        return;
      }
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setStep('analyzing');
      try {
        const result = await uploadOcrImage(storeId, file);
        setItems(result);
        setStep('review');
      } catch {
        toast.error('OCR 처리에 실패했습니다. 다시 시도해주세요.');
        URL.revokeObjectURL(url);
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
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setStep('upload');
    setImageUrl(null);
    setItems([]);
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
    }));

    setIsConfirming(true);
    try {
      await confirmInbound(storeId, inboundItems);
      qc.invalidateQueries({ queryKey: ['ingredients', storeId] });
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
