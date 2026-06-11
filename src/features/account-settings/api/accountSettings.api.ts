import axiosInstance from '@/shared/api/axiosInstance';

export const withdrawUser = (): Promise<void> => {
  return axiosInstance.delete('/users/me').then(() => undefined);
};
