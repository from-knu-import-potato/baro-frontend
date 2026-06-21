import { useMutation } from '@tanstack/react-query';

import { joinStore } from '@/features/store-registration/api/storeRegistration.api';

export function useJoinStore() {
  return useMutation({
    mutationFn: (inviteCode: string) => joinStore(inviteCode),
  });
}
