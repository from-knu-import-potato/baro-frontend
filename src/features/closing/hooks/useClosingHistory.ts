import { useQuery } from '@tanstack/react-query';

import { fetchClosingHistory } from '@/features/closing/api/closing.api';

export const useClosingHistory = (storeId: string | null) =>
  useQuery({
    queryKey: ['closing-history', storeId],
    queryFn: () => fetchClosingHistory(storeId!),
    enabled: !!storeId,
  });
