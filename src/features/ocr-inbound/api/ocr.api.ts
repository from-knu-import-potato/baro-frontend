import type {
  OcrApiResponse,
  OcrMetadata,
} from '@/features/ocr-inbound/types/ocrInbound.api.types';
import type { OcrInboundItem } from '@/features/ocr-inbound/types/ocrInbound.types';
import axiosInstance from '@/shared/api/axiosInstance';

export interface OcrUploadResult {
  metadata: OcrMetadata;
  items: OcrInboundItem[];
}

export async function uploadOcrImage(storeId: string, file: File): Promise<OcrUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post<{ success: boolean; data: OcrApiResponse }>(
    `/stores/${storeId}/ocr/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  const { metadata, items } = res.data.data;

  return {
    metadata,
    items: items.map((item, i) => {
      const isNonStandard = item.amount === null;
      return {
        id: `ocr-${Date.now()}-${i}`,
        name: item.name,
        quantity: item.amount ?? 0,
        unit: item.unit ?? 'g',
        unitPrice: item.unitPrice ?? null,
        supplyPrice: item.supplyPrice ?? null,
        expiryDate: null,
        memo: item.memo ?? null,
        isMatched: item.ingredientId !== null,
        matchedInventoryId: item.ingredientId ?? undefined,
        isWarning: item.is_warning,
        warningReason: item.warningReason,
        // 비표준 단위: 사용자가 변환 계수 직접 입력
        ...(isNonStandard && {
          purchaseUnit: item.purchaseUnit,
          purchaseQuantity: item.purchaseAmount,
          purchaseUnitPrice: item.unitPrice ?? undefined,
        }),
      };
    }),
  };
}
