import { useQuery } from '@tanstack/react-query';

import { fetchDashboardSales } from '@/features/dashboard/api/dashboard.api';

export const useDashboardSales = (storeId: string | null) =>
  useQuery({
    queryKey: ['dashboard', 'sales', storeId],
    queryFn: () => fetchDashboardSales(storeId!),
    enabled: !!storeId,
  });
