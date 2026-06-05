import type { InitialSetupData } from '@/features/initial-setup/types/initialSetup.types';
import axiosInstance from '@/shared/api/axiosInstance';

export async function fetchMe(): Promise<{ id: string; name: string; email: string | null }> {
  const response = await axiosInstance.get('/users/me');
  return response.data.data;
}

export async function submitInitialSetup(data: InitialSetupData): Promise<{ storeId: string }> {
  const response = await axiosInstance.post('/stores/setup', data);
  return response.data.data;
}
