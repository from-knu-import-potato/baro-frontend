import type { ApiMenu } from '@/features/customer-order/types/customerOrder.api.types';
import publicAxiosInstance from '@/shared/api/publicAxiosInstance';

// ⚠️ GET /stores/:storeId/menus 는 현재 백엔드에서 인증 필수.
// 손님(비회원) 접근을 위해 백엔드에 공개 엔드포인트 추가 필요.
export const fetchStoreMenus = (storeId: string): Promise<ApiMenu[]> =>
  publicAxiosInstance
    .get<{ success: boolean; data: ApiMenu[] }>(`/stores/${storeId}/menus`)
    .then((res) => res.data.data);
