import { useQuery } from '@tanstack/react-query';

import { fetchClosingPreview } from '@/features/closing/api/closing.api';

export const useClosingPreview = (storeId: string | null) =>
  useQuery({
    queryKey: ['closing', 'preview', storeId],
    queryFn: () => fetchClosingPreview(storeId!),
    enabled: !!storeId,
  });
