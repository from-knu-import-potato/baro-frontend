export type UrgencyLevel = 'critical' | 'warning' | 'expiry' | 'recommend';

export interface DemandFactor {
  icon: string;
  label: string;
}

export interface AiDemandPrediction {
  summary: string;
  detail: string;
  factors: DemandFactor[];
  generatedAt: string;
}

export interface PurchaseConversion {
  purchaseUnit: string;
  factor: number;
  purchaseAmount: number;
}

export interface OrderGuideItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  currentStockUnit: string;
  safetyStock: number;
  safetyStockUnit: string;
  recommendedOrderQty: number;
  recommendedOrderUnit: string;
  purchaseConversions: PurchaseConversion[];
  reason: string;
  urgency: UrgencyLevel;
  lastOrderDate: string;
  expiryDate?: string;
}
