import axiosInstance from '@/shared/api/axiosInstance';

export interface IngredientDto {
  id: string;
  name: string;
  unit: 'g' | 'ml' | '개';
  currentStock: string;
  safetyStock: string;
  nearestExpiryDate: string | null;
  lastInboundDate: string | null;
  relatedMenus: string[];
  isFavorite: boolean;
  isArchived: boolean;
}

export interface DeleteConflictDetail {
  inboundCount: number;
  closingCount: number;
}

export async function fetchIngredients(
  storeId: string,
  archived = false,
): Promise<IngredientDto[]> {
  const res = await axiosInstance.get(`/stores/${storeId}/ingredients`, {
    params: archived ? { archived: true } : undefined,
  });
  return res.data.data;
}

export async function createIngredient(
  storeId: string,
  data: { name: string; unit: 'g' | 'ml' | '개'; safetyStock?: number },
): Promise<IngredientDto> {
  const res = await axiosInstance.post(`/stores/${storeId}/ingredients`, data);
  return res.data.data;
}

export async function confirmInbound(
  storeId: string,
  items: { ingredientId: string; amount: number; unitPrice?: number | null }[],
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

export async function deleteIngredient(storeId: string, id: string, force = false): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/ingredients/${id}`, {
    params: force ? { force: true } : undefined,
  });
}
