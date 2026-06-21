import type {
  ApiOrder,
  CreateOrderRequest,
} from '@/features/customer-order/types/customerOrder.api.types';
import publicAxiosInstance from '@/shared/api/publicAxiosInstance';

export const createOrder = (storeId: string, data: CreateOrderRequest): Promise<ApiOrder> =>
  publicAxiosInstance
    .post<{ success: boolean; data: ApiOrder }>(`/stores/${storeId}/orders`, data)
    .then((res) => res.data.data);
