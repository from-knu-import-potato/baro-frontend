import type {
  JoinStoreResult,
  MyStore,
} from '@/features/store-registration/types/storeRegistration.types';
import axiosInstance from '@/shared/api/axiosInstance';

export async function fetchMyStores(): Promise<MyStore[]> {
  const response = await axiosInstance.get('/users/me/stores');
  return response.data.data;
}

export async function joinStore(inviteCode: string): Promise<JoinStoreResult> {
  const response = await axiosInstance.post('/stores/join', { inviteCode });
  return response.data.data;
}

export async function regenerateInviteCode(storeId: string): Promise<string> {
  const response = await axiosInstance.post(`/stores/${storeId}/invite-code`);
  return response.data.data.inviteCode;
}
