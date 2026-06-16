import { useMutation, useQueryClient } from '@tanstack/react-query';

import { generateOrderGuide } from '@/features/order-guide/api/orderGuide.api';

export const useGenerateOrderGuide = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (closingId: string) => generateOrderGuide(storeId, { closingId }),
    onSuccess: (data) => {
      queryClient.setQueryData(['order-guide', storeId], data);
    },
  });
};
