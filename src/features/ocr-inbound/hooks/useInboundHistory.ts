import { useQuery } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import {
  fetchInboundDetail,
  fetchInboundHistory,
} from '@/features/ocr-inbound/api/inboundHistory.api';

export function useInboundHistory() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['inboundHistory', storeId],
    queryFn: () => fetchInboundHistory(storeId!),
    enabled: !!storeId,
  });
}

export function useInboundDetail(recordId: string | null) {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['inboundDetail', storeId, recordId],
    queryFn: () => fetchInboundDetail(storeId!, recordId!),
    enabled: !!storeId && !!recordId,
  });
}
