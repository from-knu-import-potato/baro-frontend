export type OcrUnit = 'g' | 'ml' | '개';

export interface OcrInboundItem {
  id: string;
  name: string;
  quantity: number;
  unit: OcrUnit;
  isMatched: boolean;
  matchedInventoryId?: string;
  newIngredientId?: string;
}

export interface ExistingIngredient {
  id: string;
  name: string;
  unit: OcrUnit;
}
