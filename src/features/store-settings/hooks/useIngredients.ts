import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import {
  fetchIngredients,
  createIngredient,
  deleteIngredient,
  updateIngredient,
  type IngredientDto,
} from '@/features/store-settings/api/ingredients.api';

export type { IngredientDto };

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
    mutationFn: (data: Pick<IngredientDto, 'name' | 'unit'> & { safetyStock?: number }) =>
      createIngredient(storeId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredients', storeId] }),
  });
}

export function useUpdateIngredient() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IngredientDto> }) =>
      updateIngredient(storeId!, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredients', storeId] }),
  });
}

export function useArchivedIngredients() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['ingredients', storeId, 'archived'],
    queryFn: () => fetchIngredients(storeId!, true),
    enabled: !!storeId,
  });
}

export function useArchiveIngredient() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isArchived }: { id: string; isArchived: boolean }) =>
      updateIngredient(storeId!, id, { isArchived }),
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

export function useForceDeleteIngredient() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIngredient(storeId!, id, true),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ingredients', storeId] }),
  });
}

export function useToggleFavorite() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      updateIngredient(storeId!, id, { isFavorite }),
    onMutate: async ({ id, isFavorite }) => {
      await qc.cancelQueries({ queryKey: ['ingredients', storeId] });
      const previous = qc.getQueryData<IngredientDto[]>(['ingredients', storeId]);
      qc.setQueryData<IngredientDto[]>(['ingredients', storeId], (old) =>
        old?.map((item) => (item.id === id ? { ...item, isFavorite } : item)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(['ingredients', storeId], ctx.previous);
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['ingredients', storeId] }),
  });
}
