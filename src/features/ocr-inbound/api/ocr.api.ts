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
    items: items.map((item, i) => ({
      id: `ocr-${Date.now()}-${i}`,
      name: item.name,
      quantity: item.amount,
      unit: item.unit,
      unitPrice: item.unitPrice ?? null,
      supplyPrice: item.supplyPrice ?? null,
      expiryDate: null,
      memo: item.memo ?? null,
      isMatched: item.ingredientId !== null,
      matchedInventoryId: item.ingredientId ?? undefined,
    })),
  };
}
