import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import useAuthStore from '@/features/auth/store/authStore';
import {
  fetchStoreTheme,
  updateStoreTheme,
  type StoreThemeDto,
} from '@/features/store-settings/api/storeTheme.api';

export function useStoreTheme() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['store-theme', storeId],
    queryFn: () => fetchStoreTheme(storeId!),
    enabled: !!storeId,
  });
}

export function useUpdateStoreTheme() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: StoreThemeDto) => updateStoreTheme(storeId!, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['store-theme', storeId] });
      toast.success('저장이 완료되었습니다.');
    },
  });
}
