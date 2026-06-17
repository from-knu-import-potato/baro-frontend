import { useQuery } from '@tanstack/react-query';

import { fetchUserInfo } from '@/features/account-settings/api/accountSettings.api';

export function useUserInfo() {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
  });
}
