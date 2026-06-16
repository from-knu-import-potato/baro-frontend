import type { OrderGuideItem } from '@/features/order-guide/types/orderGuide.types';
import axiosInstance from '@/shared/api/axiosInstance';

export interface OrderGuideResponse {
  items: OrderGuideItem[];
}

export const fetchOrderGuide = (storeId: string): Promise<OrderGuideResponse> =>
  axiosInstance
    .get<{ success: boolean; data: OrderGuideResponse }>(`/stores/${storeId}/order-guide`)
    .then((res) => res.data.data);

export const generateOrderGuide = (storeId: string): Promise<OrderGuideResponse> =>
  axiosInstance
    .post<{ success: boolean; data: OrderGuideResponse }>(`/stores/${storeId}/order-guide/generate`)
    .then((res) => res.data.data);
