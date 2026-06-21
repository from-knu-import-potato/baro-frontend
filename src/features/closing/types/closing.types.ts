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
  isClosed: boolean;
  closingId: string | null;
  totalRevenue: number;
  soldMenus: ClosingSoldMenu[];
  inventoryDeductions: ClosingInventoryDeduction[];
}

export interface ClosingDeductionItem {
  ingredientId: string;
  actualUsage: number;
}

export interface ClosingRequest {
  date?: string;
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
