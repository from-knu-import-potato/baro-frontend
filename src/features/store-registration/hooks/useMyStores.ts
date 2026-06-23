import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteStore,
  fetchMyStores,
  leaveStore,
} from '@/features/store-registration/api/storeRegistration.api';

export function useMyStores() {
  return useQuery({
    queryKey: ['myStores'],
    queryFn: fetchMyStores,
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStores'] });
    },
  });
}

export function useLeaveStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaveStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStores'] });
    },
  });
}
