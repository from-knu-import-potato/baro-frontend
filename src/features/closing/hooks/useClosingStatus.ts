import useAuthStore from '@/features/auth/store/authStore';
import { useClosingHistory } from '@/features/closing/hooks/useClosingHistory';
import { getBusinessDate } from '@/shared/utils/businessDate';

export const useClosingStatus = (storeId: string | null) => {
  const operatingHours = useAuthStore((s) => s.operatingHours);
  const { data: history, isLoading, refetch } = useClosingHistory(storeId);

  const businessDate = getBusinessDate(operatingHours);
  const todayClosing = history?.closings.find((c) => c.date.startsWith(businessDate)) ?? null;

  return {
    isCompleted: !!todayClosing,
    todayClosing,
    businessDate,
    isLoading,
    refetch,
  };
};
