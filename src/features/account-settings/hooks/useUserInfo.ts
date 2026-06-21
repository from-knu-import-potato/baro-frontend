import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchUserInfo, updateUserName } from '@/features/account-settings/api/accountSettings.api';

export function useUserInfo() {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: fetchUserInfo,
  });
}

export function useUpdateUserName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => updateUserName(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
}
