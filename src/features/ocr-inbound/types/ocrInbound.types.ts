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
}

export interface ExistingIngredient {
  id: string;
  name: string;
  unit: OcrUnit;
}
