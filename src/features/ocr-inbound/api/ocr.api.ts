import type { OcrApiResponse } from '@/features/ocr-inbound/types/ocrInbound.api.types';
import type { OcrInboundItem } from '@/features/ocr-inbound/types/ocrInbound.types';
import axiosInstance from '@/shared/api/axiosInstance';

export async function uploadOcrImage(storeId: string, file: File): Promise<OcrInboundItem[]> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post<{ success: boolean; data: OcrApiResponse }>(
    `/stores/${storeId}/ocr/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return res.data.data.items.map((item, i) => ({
    id: `ocr-${Date.now()}-${i}`,
    name: item.name,
    quantity: item.amount,
    unit: item.unit,
    isMatched: false,
  }));
}
