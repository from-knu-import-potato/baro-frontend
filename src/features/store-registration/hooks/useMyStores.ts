import { useQuery } from '@tanstack/react-query';

import { fetchMyStores } from '@/features/store-registration/api/storeRegistration.api';

export function useMyStores() {
  return useQuery({
    queryKey: ['myStores'],
    queryFn: fetchMyStores,
  });
}
