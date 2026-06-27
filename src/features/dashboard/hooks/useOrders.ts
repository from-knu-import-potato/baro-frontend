import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { UpdateOrderStatusRequest } from '@/features/customer-order/types/customerOrder.api.types';
import { fetchOrders, updateOrderStatus } from '@/features/dashboard/api/order.api';
import useOrderWarningsStore from '@/features/dashboard/store/orderWarningsStore';

export const useOrders = (storeId: string | null) => {
  const setWarnings = useOrderWarningsStore((s) => s.setWarnings);
  const clearWarnings = useOrderWarningsStore((s) => s.clearWarnings);

  const query = useQuery({
    queryKey: ['orders', storeId],
    queryFn: () => fetchOrders(storeId!),
    enabled: !!storeId,
  });

  useEffect(() => {
    if (!query.data) return;
    query.data.forEach((order) => {
      if (order.stockWarnings?.length) {
        setWarnings(order.id, order.stockWarnings);
      } else {
        clearWarnings(order.id);
      }
    });
  }, [query.data, setWarnings, clearWarnings]);

  return query;
};

export const useUpdateOrderStatus = (storeId: string | null) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      restoreStock,
    }: {
      orderId: string;
      status: UpdateOrderStatusRequest['status'];
      restoreStock?: boolean;
    }) => updateOrderStatus(storeId!, orderId, status, restoreStock),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders', storeId] }),
  });
};
