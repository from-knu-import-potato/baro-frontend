import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';
import {
  fetchStoreSettings,
  resetStoreData,
  updateStoreSettings,
  updateOperatingHours,
} from '@/features/store-settings/api/storeSettings.api';
import type { StoreSettings } from '@/features/store-settings/types/store-settings.types';

export function useStoreSettings() {
  const storeId = useAuthStore((s) => s.storeId);

  return useQuery({
    queryKey: ['storeSettings', storeId],
    queryFn: () => fetchStoreSettings(storeId!),
    enabled: !!storeId,
  });
}

export function useUpdateStoreSettings() {
  const storeId = useAuthStore((s) => s.storeId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<StoreSettings, 'operatingHours'>>) =>
      updateStoreSettings(storeId!, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings', storeId] });
      // safetyStockPct 변경 시 백엔드가 전체 식자재 안전재고를 일괄 업데이트하므로 함께 무효화
      if (variables.safetyStockPct !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['ingredients', storeId] });
      }
    },
  });
}

export function useResetStoreData() {
  const storeId = useAuthStore((s) => s.storeId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetStoreData(storeId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings', storeId] });
      queryClient.invalidateQueries({ queryKey: ['ingredients', storeId] });
      queryClient.invalidateQueries({ queryKey: ['menus', storeId] });
      queryClient.invalidateQueries({ queryKey: ['recipes', storeId] });
    },
  });
}

export function useUpdateOperatingHours() {
  const storeId = useAuthStore((s) => s.storeId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (operatingHours: OperatingHour[]) => updateOperatingHours(storeId!, operatingHours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings', storeId] });
    },
  });
}
