import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import {
  fetchRecipes,
  createRecipe,
  deleteRecipe,
} from '@/features/store-settings/api/recipes.api';

export function useRecipes() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['recipes', storeId],
    queryFn: () => fetchRecipes(storeId!),
    enabled: !!storeId,
  });
}

export function useCreateRecipe() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { menuId: string; ingredientId: string; amount: number }) =>
      createRecipe(storeId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes', storeId] }),
  });
}

export function useDeleteRecipe() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: string) => deleteRecipe(storeId!, recipeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes', storeId] }),
  });
}
