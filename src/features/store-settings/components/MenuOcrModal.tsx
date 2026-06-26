import { useState } from 'react';

import { Loader2, ScanLine } from 'lucide-react';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import { uploadMenuOcrScan } from '@/features/store-settings/api/menus.api';
import MenuOcrReviewStep, {
  type OcrMenuReviewItem,
} from '@/features/store-settings/components/MenuOcrReviewStep';
import MenuOcrUploadStep from '@/features/store-settings/components/MenuOcrUploadStep';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { getApiErrorCode, getApiErrorMessage } from '@/shared/utils/apiError';

type OcrStep = 'upload' | 'analyzing' | 'review';

export interface OcrMenuConfirmItem {
  name: string;
  price: number;
  description: string | null;
  isFeatured: boolean;
  imageFile?: File;
}

interface MenuOcrModalProps {
  open: boolean;
  existingNames?: string[];
  onClose: () => void;
  onConfirm: (items: OcrMenuConfirmItem[]) => void;
  isConfirming?: boolean;
}

const MenuOcrModal = ({
  open,
  existingNames = [],
  onClose,
  onConfirm,
  isConfirming,
}: MenuOcrModalProps) => {
  const storeId = useAuthStore((s) => s.storeId);
  const [step, setStep] = useState<OcrStep>('upload');
  const [reviewItems, setReviewItems] = useState<OcrMenuReviewItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClose = () => {
    reviewItems.forEach((item) => {
      if (item.imageUrl?.startsWith('blob:')) URL.revokeObjectURL(item.imageUrl);
    });
    setStep('upload');
    setReviewItems([]);
    setErrorMsg(null);
    onClose();
  };

  const handleFileSelect = async (file: File) => {
    setStep('analyzing');
    setErrorMsg(null);
    try {
      const items = await uploadMenuOcrScan(storeId ?? 'temp', file);
      setReviewItems(
        items.map((item, i) => ({
          id: `ocr-${Date.now()}-${i}`,
          name: item.name,
          price: String(item.price),
          description: item.description ?? '',
          isFeatured: false,
        })),
      );
      setStep('review');
    } catch (err) {
      const msg = getApiErrorMessage(err, '메뉴 인식에 실패했습니다. 다시 시도해 주세요.');
      if (getApiErrorCode(err) === 'NOT_MENU') {
        toast.error(msg);
      } else {
        setErrorMsg(msg);
      }
      setStep('upload');
    }
  };

  const handleConfirm = () => {
    const existingNamesLower = new Set(existingNames.map((n) => n.trim().toLowerCase()));
    onConfirm(
      reviewItems
        .filter(
          (item) => item.name.trim() && !existingNamesLower.has(item.name.trim().toLowerCase()),
        )
        .map((item) => ({
          name: item.name.trim(),
          price: Number(item.price) || 0,
          description: item.description.trim() || null,
          isFeatured: item.isFeatured,
          imageFile: item.imageFile,
        })),
    );
    handleClose();
  };

  const titleMap: Record<OcrStep, string> = {
    upload: '메뉴판 이미지로 등록',
    analyzing: '메뉴 인식 중',
    review: '인식 결과 확인',
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90svh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="size-4 text-muted-foreground" />
            {titleMap[step]}
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <>
            {errorMsg && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {errorMsg}
              </div>
            )}
            <MenuOcrUploadStep onFileSelect={handleFileSelect} />
          </>
        )}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 min-h-80">
            <Loader2 className="w-10 h-10 animate-spin text-baro-blue" />
            <div className="text-center">
              <p className="text-sm font-semibold">메뉴를 인식하는 중입니다</p>
              <p className="text-xs text-muted-foreground mt-1">잠시만 기다려주세요...</p>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="flex-1 min-h-0 flex flex-col">
            <MenuOcrReviewStep
              items={reviewItems}
              existingNames={existingNames}
              onItemsChange={setReviewItems}
              onConfirm={handleConfirm}
              onReset={() => setStep('upload')}
            />
          </div>
        )}

        {isConfirming && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-baro-blue" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MenuOcrModal;
