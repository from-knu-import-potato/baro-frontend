import { useQuery } from '@tanstack/react-query';

import { fetchOrderGuide } from '@/features/order-guide/api/orderGuide.api';

export const useOrderGuide = (storeId: string | null) =>
  useQuery({
    queryKey: ['order-guide', storeId],
    queryFn: () => fetchOrderGuide(storeId!),
    enabled: !!storeId,
  });
