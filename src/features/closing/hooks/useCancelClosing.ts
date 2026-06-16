import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelClosing } from '@/features/closing/api/closing.api';

export const useCancelClosing = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (closingId: string) => cancelClosing(storeId, closingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['closing-history', storeId] });
    },
  });
};
