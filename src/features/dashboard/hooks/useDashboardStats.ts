import { useQuery } from '@tanstack/react-query';

import { fetchDashboardStats } from '@/features/dashboard/api/dashboard.api';

export const useDashboardStats = (storeId: string | null) =>
  useQuery({
    queryKey: ['dashboard', 'stats', storeId],
    queryFn: () => fetchDashboardStats(storeId!),
    enabled: !!storeId,
  });
