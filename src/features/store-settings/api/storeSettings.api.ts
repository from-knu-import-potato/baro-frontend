import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';
import type {
  StoreMember,
  StoreSettings,
} from '@/features/store-settings/types/store-settings.types';
import axiosInstance from '@/shared/api/axiosInstance';

export async function fetchStoreSettings(storeId: string): Promise<StoreSettings & { id: string }> {
  const response = await axiosInstance.get(`/stores/${storeId}`);
  const d = response.data.data;
  return {
    id: d.id,
    storeName: d.name,
    owner: {
      id: d.owner.id,
      name: d.owner.name,
      profileImage: d.owner.profileImage ?? null,
    },
    myRole: d.myRole ?? null,
    businessType: d.businessType,
    category: d.category,
    memo: d.memo ?? '',
    safetyStockPct: d.safetyStockPct ?? null,
    tableCount: d.tableCount ?? null,
    operatingHours: d.operatingHours ?? [],
    inviteCode: d.inviteCode ?? null,
  };
}

export async function updateStoreSettings(
  storeId: string,
  data: Partial<Omit<StoreSettings, 'operatingHours'>>,
): Promise<void> {
  await axiosInstance.patch(`/stores/${storeId}`, data);
}

export async function resetStoreData(storeId: string): Promise<void> {
  await axiosInstance.post(`/stores/${storeId}/reset`);
}

export async function fetchStoreMembers(storeId: string): Promise<StoreMember[]> {
  const response = await axiosInstance.get(`/stores/${storeId}/members`);
  return response.data.data;
}

export async function removeMember(storeId: string, targetUserId: string): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/members/${targetUserId}`);
}

export async function updateOperatingHours(
  storeId: string,
  operatingHours: OperatingHour[],
): Promise<OperatingHour[]> {
  const response = await axiosInstance.patch(`/stores/${storeId}/operating-hours`, {
    operatingHours,
  });
  return response.data.data.operatingHours;
}
