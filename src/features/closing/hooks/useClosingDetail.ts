import { useQuery } from '@tanstack/react-query';

import { fetchClosingDetail } from '@/features/closing/api/closing.api';

export const useClosingDetail = (storeId: string | null, closingId: string | null) =>
  useQuery({
    queryKey: ['closing-detail', storeId, closingId],
    queryFn: () => fetchClosingDetail(storeId!, closingId!),
    enabled: !!storeId && !!closingId,
  });
