import { useQuery } from '@tanstack/react-query';

import { fetchClosingPreview } from '@/features/closing/api/closing.api';

export const useClosingPreview = (storeId: string | null, date?: string) =>
  useQuery({
    queryKey: ['closing', 'preview', storeId, date],
    queryFn: () => fetchClosingPreview(storeId!, date),
    enabled: !!storeId,
  });
