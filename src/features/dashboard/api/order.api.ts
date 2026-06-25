import type {
  ApiOrder,
  UpdateOrderStatusRequest,
} from '@/features/customer-order/types/customerOrder.api.types';
import axiosInstance from '@/shared/api/axiosInstance';

export const fetchOrders = (storeId: string): Promise<ApiOrder[]> =>
  axiosInstance
    .get<{ success: boolean; data: ApiOrder[] }>(`/stores/${storeId}/orders`)
    .then((res) => res.data.data);

export const updateOrderStatus = (
  storeId: string,
  orderId: string,
  status: UpdateOrderStatusRequest['status'],
  restoreStock?: boolean,
): Promise<ApiOrder> =>
  axiosInstance
    .patch<{
      success: boolean;
      data: ApiOrder;
    }>(`/stores/${storeId}/orders/${orderId}/status`, {
      status,
      ...(restoreStock !== undefined && { restoreStock }),
    })
    .then((res) => res.data.data);
