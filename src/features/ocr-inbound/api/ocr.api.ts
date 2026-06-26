import type {
  OcrApiResponse,
  OcrMetadata,
} from '@/features/ocr-inbound/types/ocrInbound.api.types';
import type { OcrInboundItem, OcrUnit } from '@/features/ocr-inbound/types/ocrInbound.types';
import axiosInstance from '@/shared/api/axiosInstance';

const parseSpec = (spec: string | null): { factor: number; unit: OcrUnit } | undefined => {
  if (!spec) return undefined;
  const match = spec.match(/(\d+(?:\.\d+)?)\s*(개|g|ml|l|kg)/i);
  if (!match) return undefined;
  const num = Number(match[1]);
  const rawUnit = match[2].toLowerCase();
  if (rawUnit === '개') return { factor: num, unit: '개' };
  if (rawUnit === 'g') return { factor: num, unit: 'g' };
  if (rawUnit === 'ml') return { factor: num, unit: 'ml' };
  if (rawUnit === 'l') return { factor: num * 1000, unit: 'ml' };
  if (rawUnit === 'kg') return { factor: num * 1000, unit: 'g' };
  return undefined;
};

export interface OcrUploadResult {
  metadata: OcrMetadata;
  items: OcrInboundItem[];
  invoiceImageUrl: string | null;
}

export async function uploadOcrImage(storeId: string, file: File): Promise<OcrUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axiosInstance.post<{ success: boolean; data: OcrApiResponse }>(
    `/stores/${storeId}/ocr/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  const { metadata, items, imageUrl } = res.data.data;

  return {
    metadata,
    invoiceImageUrl: imageUrl ?? null,
    items: items.map((item, i) => {
      const isNonStandard = item.amount === null;
      const parsedSpec = isNonStandard ? parseSpec(item.spec) : undefined;
      return {
        id: `ocr-${Date.now()}-${i}`,
        name: item.name,
        originalName: item.name,
        quantity: parsedSpec ? item.purchaseAmount * parsedSpec.factor : (item.amount ?? 0),
        unit: parsedSpec?.unit ?? item.unit ?? 'g',
        unitPrice: item.unitPrice ?? null,
        supplyPrice: item.supplyPrice ?? null,
        expiryDate: null,
        memo: item.memo ?? null,
        isMatched: item.ingredientId !== null,
        matchedInventoryId: item.ingredientId ?? undefined,
        isWarning: item.is_warning,
        warningReason: item.warningReason,
        // 비표준 단위: spec에서 변환 계수·단위를 추출하거나 사용자가 직접 입력
        ...(isNonStandard && {
          purchaseUnit: item.purchaseUnit,
          purchaseQuantity: item.purchaseAmount,
          purchaseUnitPrice: item.unitPrice ?? undefined,
          ...(parsedSpec !== undefined && { conversionFactor: parsedSpec.factor }),
        }),
      };
    }),
  };
}

export async function deleteInvoiceImage(storeId: string, imageUrl: string): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/ocr/invoice-image`, {
    params: { imageUrl },
  });
}
