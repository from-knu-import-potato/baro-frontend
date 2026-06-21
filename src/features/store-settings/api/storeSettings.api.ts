import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';
import type { StoreSettings } from '@/features/store-settings/types/store-settings.types';
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
    operatingHours: d.operatingHours ?? [],
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

export async function updateOperatingHours(
  storeId: string,
  operatingHours: OperatingHour[],
): Promise<OperatingHour[]> {
  const response = await axiosInstance.patch(`/stores/${storeId}/operating-hours`, {
    operatingHours,
  });
  return response.data.data.operatingHours;
}
