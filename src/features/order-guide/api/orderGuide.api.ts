import type { OrderGuideItem, UrgencyLevel } from '@/features/order-guide/types/orderGuide.types';
import axiosInstance from '@/shared/api/axiosInstance';

interface BackendOrderGuideItem {
  ingredientId: string;
  ingredientName: string;
  unit: string;
  currentStock: number;
  safetyStock: number;
  status: 'critical' | 'warning' | 'expiry';
  recommendedOrderAmount: number;
  reason: string;
}

interface BackendOrderGuideResponse {
  generatedAt: string | null;
  summary: string | null;
  items: BackendOrderGuideItem[];
}

export interface OrderGuideResponse {
  generatedAt: string | null;
  summary: string | null;
  items: OrderGuideItem[];
}

const mapStatus = (status: BackendOrderGuideItem['status']): UrgencyLevel => {
  if (status === 'expiry') return 'warning';
  return status;
};

const mapItem = (item: BackendOrderGuideItem): OrderGuideItem => ({
  id: item.ingredientId,
  name: item.ingredientName,
  category: '',
  currentStock: item.currentStock,
  currentStockUnit: item.unit,
  safetyStock: item.safetyStock,
  safetyStockUnit: item.unit,
  recommendedOrderQty: item.recommendedOrderAmount,
  recommendedOrderUnit: item.unit,
  reason: item.reason,
  urgency: mapStatus(item.status),
  lastOrderDate: '',
});

const mapResponse = (data: BackendOrderGuideResponse): OrderGuideResponse => ({
  generatedAt: data.generatedAt,
  summary: data.summary,
  items: data.items.map(mapItem),
});

export const fetchOrderGuide = (storeId: string): Promise<OrderGuideResponse> =>
  axiosInstance
    .get<{ success: boolean; data: BackendOrderGuideResponse }>(`/stores/${storeId}/order-guide`)
    .then((res) => mapResponse(res.data.data));

export const generateOrderGuide = (
  storeId: string,
  body: { closingId: string },
): Promise<OrderGuideResponse> =>
  axiosInstance
    .post<{
      success: boolean;
      data: BackendOrderGuideResponse;
    }>(`/stores/${storeId}/order-guide/generate`, body)
    .then((res) => mapResponse(res.data.data));
