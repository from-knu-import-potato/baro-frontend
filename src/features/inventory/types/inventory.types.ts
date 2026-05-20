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
  expiryDate?: string; // 'YYYY-MM-DD'
  lastUpdated: string; // 'YYYY-MM-DD'
  status: InventoryStatus;
}
