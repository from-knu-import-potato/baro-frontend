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
  };
}

export async function updateStoreSettings(
  storeId: string,
  data: Partial<StoreSettings>,
): Promise<void> {
  await axiosInstance.patch(`/stores/${storeId}`, data);
}
