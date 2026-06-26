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
  purchaseUnit: string; // 명세서 원본 단위 (KG, BOX, BTL 등)
  purchaseAmount: number; // 명세서 원본 수량
  amount: number | null; // 변환된 수량 (null = 비표준 단위, 변환 계수 필요)
  unit: OcrUnit | null; // 변환된 기본 단위 (null = 비표준 단위)
  spec: string | null; // 1구매단위당 내용물 정보 (예: "20개", "1000ml")
  unitPrice: number | null;
  supplyPrice: number | null;
  memo: string | null;
  ingredientId: string | null;
  is_warning: boolean;
  warningReason: string | null;
}

export interface OcrApiResponse {
  metadata: OcrMetadata;
  items: OcrApiItem[];
  rawText: string;
  imageUrl: string | null;
}

export interface InboundRecord {
  id: string;
  transactionDate: string | null;
  supplierName: string | null;
  invoiceNumber: string | null;
  totalSupplyAmount: string | null;
  totalTax: string | null;
  totalAmount: string | null;
  invoiceImageUrl: string | null;
  createdAt: string;
  itemCount: number;
}

export interface InboundRecordItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: 'g' | 'ml' | '개';
  amount: string;
  unitPrice: string | null;
  supplyPrice: string | null;
  expiryDate: string | null;
  memo: string | null;
}

export interface InboundRecordDetail extends Omit<InboundRecord, 'itemCount'> {
  items: InboundRecordItem[];
}

export interface UnitConversionDto {
  id: string;
  ingredientId: string;
  purchaseUnit: string;
  baseUnit: OcrUnit;
  factor: number;
}
