export interface ClosingSoldMenu {
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ClosingInventoryDeduction {
  ingredientId: string;
  ingredientName: string;
  unit: 'g' | 'ml' | '개';
  theoreticalUsage: number;
  currentStock: number;
}

export interface ClosingPreview {
  date: string;
  totalRevenue: number;
  soldMenus: ClosingSoldMenu[];
  inventoryDeductions: ClosingInventoryDeduction[];
}

export interface ClosingDeductionItem {
  ingredientId: string;
  actualUsage: number;
}

export interface ClosingRequest {
  date: string;
  inventoryDeductions: ClosingDeductionItem[];
}

export interface ClosingDeductionResult {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  usedAmount: number;
  remainingStock: number;
}

export interface ClosingResponse {
  closingId: string;
  totalRevenue: number;
  deductedIngredients: ClosingDeductionResult[];
}
