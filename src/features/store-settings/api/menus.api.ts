import axiosInstance from '@/shared/api/axiosInstance';

export interface MenuDto {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
}

export async function fetchMenus(storeId: string): Promise<MenuDto[]> {
  const res = await axiosInstance.get(`/stores/${storeId}/menus`);
  return res.data.data;
}

export async function createMenu(
  storeId: string,
  data: Omit<MenuDto, 'id' | 'isAvailable'>,
): Promise<MenuDto> {
  const res = await axiosInstance.post(`/stores/${storeId}/menus`, data);
  return res.data.data;
}

export async function updateMenu(
  storeId: string,
  menuId: string,
  data: Partial<MenuDto>,
): Promise<MenuDto> {
  const res = await axiosInstance.patch(`/stores/${storeId}/menus/${menuId}`, data);
  return res.data.data;
}

export async function deleteMenu(storeId: string, menuId: string): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/menus/${menuId}`);
}

export async function uploadMenuImage(storeId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosInstance.post(`/stores/${storeId}/menus/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.url;
}
