export type OcrUnit = 'g' | 'ml' | '개';

export interface OcrInboundItem {
  id: string;
  name: string;
  quantity: number;
  unit: OcrUnit;
  unitPrice: number | null;
  supplyPrice: number | null;
  expiryDate: string | null;
  memo: string | null;
  isMatched: boolean;
  matchedInventoryId?: string;
  newIngredientId?: string;
  isWarning: boolean;
  warningReason: string | null;
  purchaseUnit?: string; // 명세서 원본 단위 (BOX, BTL 등 비표준 단위일 때만 세팅)
  purchaseQuantity?: number; // 명세서 원본 수량 (purchaseUnit과 함께 세팅)
  purchaseUnitPrice?: number; // 명세서 원본 단가 (1 purchaseUnit당 가격, factor 변경 시 재계산 기준)
  conversionFactor?: number; // 변환 계수: 1 purchaseUnit = conversionFactor baseUnit
}

export interface ExistingIngredient {
  id: string;
  name: string;
  unit: OcrUnit;
}
