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
  openingStock: number;
  orderDeductedAmount: number;
  currentStock: number;
  isNegative: boolean;
}

export interface ClosingPreview {
  date: string;
  isClosed: boolean;
  closingId: string | null;
  totalRevenue: number;
  soldMenus: ClosingSoldMenu[];
  inventoryDeductions: ClosingInventoryDeduction[];
}

export interface ClosingDeductionItem {
  ingredientId: string;
  remainingStock: number;
}

export interface ClosingRequest {
  date?: string;
  inventoryDeductions: ClosingDeductionItem[];
}

export interface ClosingDeductionResult {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  orderDeductedAmount: number;
  actualUsage: number;
  adjustmentAmount: number;
  remainingStock: number;
}

export interface ClosingResponse {
  closingId: string;
  date: string;
  totalRevenue: number;
  deductedIngredients: ClosingDeductionResult[];
}

export interface ClosingStatus {
  isCompleted: boolean;
  closingDate?: string;
  closingId?: string;
}

export interface BusinessOpenRequest {
  businessDate: string; // YYYY-MM-DD
}

export interface BusinessOpenResponse {
  businessDate: string;
  openedAt: string;
}

export interface BusinessOpenStatus {
  isOpen: boolean;
  businessDate: string | null;
  openedAt: string | null;
}

export interface ClosingHistoryItem {
  id: string;
  date: string;
  totalRevenue: number;
  createdAt: string;
}

export interface ClosingHistory {
  closings: ClosingHistoryItem[];
}

export interface ClosingDetailSoldMenu {
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ClosingDetailInventoryDeduction {
  ingredientId: string;
  ingredientName: string;
  unit: 'g' | 'ml' | '개';
  orderDeductedAmount: number;
  actualUsage: number;
  adjustmentAmount: number;
  remainingStock: number;
}

export interface ClosingDetail {
  id: string;
  date: string;
  totalRevenue: number;
  createdAt: string;
  soldMenus: ClosingDetailSoldMenu[];
  inventoryDeductions: ClosingDetailInventoryDeduction[];
}
