import type {
  ApiMenu,
  ApiMenuCategory,
  ApiStoreTheme,
} from '@/features/customer-order/types/customerOrder.api.types';
import publicAxiosInstance from '@/shared/api/publicAxiosInstance';

export const fetchPublicStoreOpenStatus = (storeId: string): Promise<{ isOpen: boolean }> =>
  publicAxiosInstance
    .get<{ success: boolean; data: { isOpen: boolean } }>(`/stores/${storeId}/open/status`)
    .then((res) => res.data.data);

// ⚠️ GET /stores/:storeId/menus 는 현재 백엔드에서 인증 필수.
// 손님(비회원) 접근을 위해 백엔드에 공개 엔드포인트 추가 필요.
export const fetchStoreMenus = (storeId: string): Promise<ApiMenu[]> =>
  publicAxiosInstance
    .get<{ success: boolean; data: ApiMenu[] }>(`/stores/${storeId}/menus`)
    .then((res) => res.data.data);

export const fetchStoreMenuCategories = (storeId: string): Promise<ApiMenuCategory[]> =>
  publicAxiosInstance
    .get<{ success: boolean; data: ApiMenuCategory[] }>(`/stores/${storeId}/menu-categories`)
    .then((res) => res.data.data);

export const fetchStoreTheme = (storeId: string): Promise<ApiStoreTheme> =>
  publicAxiosInstance
    .get<{ success: boolean; data: ApiStoreTheme }>(`/stores/${storeId}/theme`)
    .then((res) => res.data.data);
