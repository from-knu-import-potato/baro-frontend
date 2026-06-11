import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { UpdateOrderStatusRequest } from '@/features/customer-order/types/customerOrder.api.types';
import { fetchOrders, updateOrderStatus } from '@/features/dashboard/api/order.api';

export const useOrders = (storeId: string | null) =>
  useQuery({
    queryKey: ['orders', storeId],
    queryFn: () => fetchOrders(storeId!),
    enabled: !!storeId,
  });

export const useUpdateOrderStatus = (storeId: string | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: UpdateOrderStatusRequest['status'];
    }) => updateOrderStatus(storeId!, orderId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders', storeId] }),
  });
};
