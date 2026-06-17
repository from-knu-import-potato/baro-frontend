import type { UserInfo } from '@/features/account-settings/types/account-settings.types';
import axiosInstance from '@/shared/api/axiosInstance';

export async function fetchUserInfo(): Promise<UserInfo> {
  const response = await axiosInstance.get('/users/me');
  const d = response.data.data;
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    profileImage: d.profileImage ?? null,
  };
}

export const withdrawUser = (): Promise<void> => {
  return axiosInstance.delete('/users/me').then(() => undefined);
};
