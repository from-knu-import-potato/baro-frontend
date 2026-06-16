import { useMutation, useQueryClient } from '@tanstack/react-query';

import { generateOrderGuide } from '@/features/order-guide/api/orderGuide.api';

export const useGenerateOrderGuide = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => generateOrderGuide(storeId),
    onSuccess: (data) => {
      queryClient.setQueryData(['order-guide', storeId], data);
    },
  });
};
