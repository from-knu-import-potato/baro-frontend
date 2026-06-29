import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelClosing, fetchBusinessOpenStatus } from '@/features/closing/api/closing.api';
import useClosingStore from '@/features/closing/store/closingStore';

export const useCancelClosing = (storeId: string) => {
  const queryClient = useQueryClient();
  const setBusinessSession = useClosingStore((s) => s.setBusinessSession);

  return useMutation({
    mutationFn: (closingId: string) => cancelClosing(storeId, closingId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['closing-history', storeId] });
      try {
        const status = await fetchBusinessOpenStatus(storeId);
        setBusinessSession({ isOpen: status.isOpen, businessDate: status.businessDate });
      } catch {
        // 동기화 실패 시에도 마감 취소 자체는 성공이므로 무시
      }
    },
  });
};
