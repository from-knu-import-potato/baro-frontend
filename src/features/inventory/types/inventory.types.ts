export type InventoryStatus = 'normal' | 'warning' | 'critical' | 'depleted';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  safetyStock: number;
  safetyStockUnit: string;
  recipeCount: number;
  inboundDate: string; // 'YYYY-MM-DD' 입고날짜
  expiryDate?: string; // 'YYYY-MM-DD' 유통기한
  status: InventoryStatus;
}
