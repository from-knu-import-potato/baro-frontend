import type { OcrUnit } from '@/features/ocr-inbound/types/ocrInbound.types';

export interface OcrApiItem {
  name: string;
  amount: number;
  unit: OcrUnit;
  unitPrice: number | null;
  ingredientId: string | null;
}

export interface OcrApiResponse {
  items: OcrApiItem[];
  rawText: string;
}
