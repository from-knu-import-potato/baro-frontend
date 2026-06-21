export interface DashboardStats {
  totalInventory: number;
  expiringItems: number;
  aiOrderRecommendations: number;
  monthlyConsumption: number;
  monthlyConsumptionChange: number;
  missedClosing: boolean;
  lastUpdated: string;
}

export interface OrderRecommendationItem {
  id: string;
  name: string;
  aiReason: string;
}

export interface MonthlySalesData {
  month: string;
  consumption: number;
  sales: number;
}
