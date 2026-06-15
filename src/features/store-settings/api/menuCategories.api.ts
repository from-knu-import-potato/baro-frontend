import axiosInstance from '@/shared/api/axiosInstance';

export interface MenuCategoryDto {
  id: string;
  name: string;
  order: number;
}

export async function fetchMenuCategories(storeId: string): Promise<MenuCategoryDto[]> {
  const res = await axiosInstance.get(`/stores/${storeId}/menu-categories`);
  return res.data.data;
}

export async function createMenuCategory(storeId: string, name: string): Promise<MenuCategoryDto> {
  const res = await axiosInstance.post(`/stores/${storeId}/menu-categories`, { name });
  return res.data.data;
}

export async function updateMenuCategory(
  storeId: string,
  categoryId: string,
  name: string,
): Promise<MenuCategoryDto> {
  const res = await axiosInstance.patch(`/stores/${storeId}/menu-categories/${categoryId}`, {
    name,
  });
  return res.data.data;
}

export async function deleteMenuCategory(storeId: string, categoryId: string): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/menu-categories/${categoryId}`);
}

export async function reorderMenuCategories(storeId: string, categoryIds: string[]): Promise<void> {
  await axiosInstance.patch(`/stores/${storeId}/menu-categories/reorder`, { categoryIds });
}
