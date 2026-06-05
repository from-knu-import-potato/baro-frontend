import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import {
  fetchIngredients,
  createIngredient,
  deleteIngredient,
  type IngredientDto,
} from '@/features/store-settings/api/ingredients.api';

export function useIngredients() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['ingredients', storeId],
    queryFn: () => fetchIngredients(storeId!),
    enabled: !!storeId,
  });
}

export function useCreateIngredient() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<IngredientDto, 'name' | 'unit'>) => createIngredient(storeId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredients', storeId] }),
  });
}

export function useDeleteIngredient() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIngredient(storeId!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredients', storeId] }),
  });
}
