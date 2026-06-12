import type {
  DashboardStats,
  MonthlySalesData,
} from '@/features/dashboard/types/dashboard.types';
import axiosInstance from '@/shared/api/axiosInstance';

export const fetchDashboardStats = (storeId: string): Promise<DashboardStats> =>
  axiosInstance
    .get<{ success: boolean; data: DashboardStats }>(`/stores/${storeId}/dashboard/stats`)
    .then((res) => res.data.data);

export const fetchDashboardSales = (storeId: string): Promise<MonthlySalesData[]> =>
  axiosInstance
    .get<{ success: boolean; data: MonthlySalesData[] }>(`/stores/${storeId}/dashboard/sales`)
    .then((res) => res.data.data);
