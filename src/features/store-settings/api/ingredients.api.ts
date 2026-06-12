import axiosInstance from '@/shared/api/axiosInstance';

export interface IngredientDto {
  id: string;
  name: string;
  unit: 'g' | 'ml' | '개';
  currentStock: string;
  safetyStock: string;
}

export async function fetchIngredients(storeId: string): Promise<IngredientDto[]> {
  const res = await axiosInstance.get(`/stores/${storeId}/ingredients`);
  return res.data.data;
}

export async function createIngredient(
  storeId: string,
  data: Omit<IngredientDto, 'id' | 'currentStock' | 'safetyStock'> & { safetyStock?: number },
): Promise<IngredientDto> {
  const res = await axiosInstance.post(`/stores/${storeId}/ingredients`, data);
  return res.data.data;
}

export async function confirmInbound(
  storeId: string,
  items: { ingredientId: string; amount: number }[],
): Promise<void> {
  await axiosInstance.post(`/stores/${storeId}/ingredients/inbound`, { items });
}

export async function updateIngredient(
  storeId: string,
  id: string,
  data: Partial<IngredientDto>,
): Promise<IngredientDto> {
  const res = await axiosInstance.patch(`/stores/${storeId}/ingredients/${id}`, data);
  return res.data.data;
}

export async function deleteIngredient(storeId: string, id: string): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/ingredients/${id}`);
}
