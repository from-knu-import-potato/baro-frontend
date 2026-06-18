import type { OcrUnit } from '@/features/ocr-inbound/types/ocrInbound.types';

export interface OcrMetadata {
  transactionDate: string | null;
  supplierName: string | null;
  invoiceNumber: string | null;
  totalSupplyAmount: number | null;
  totalTax: number | null;
  totalAmount: number | null;
}

export interface OcrApiItem {
  name: string;
  amount: number;
  unit: OcrUnit;
  unitPrice: number | null;
  supplyPrice: number | null;
  memo: string | null;
  ingredientId: string | null;
}

export interface OcrApiResponse {
  metadata: OcrMetadata;
  items: OcrApiItem[];
  rawText: string;
}
