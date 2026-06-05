import axiosInstance from '@/shared/api/axiosInstance';

export interface RecipeDto {
  id: string;
  menuId: string;
  menuName: string;
  ingredientId: string;
  ingredientName: string;
  ingredientUnit: string;
  amount: string;
}

export async function fetchRecipes(storeId: string): Promise<RecipeDto[]> {
  const res = await axiosInstance.get(`/stores/${storeId}/recipes`);
  return res.data.data;
}

export async function createRecipe(
  storeId: string,
  data: { menuId: string; ingredientId: string; amount: number },
): Promise<RecipeDto> {
  const res = await axiosInstance.post(`/stores/${storeId}/recipes`, data);
  return res.data.data;
}

export async function deleteRecipe(storeId: string, recipeId: string): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/recipes/${recipeId}`);
}
