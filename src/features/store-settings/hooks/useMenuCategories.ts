import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import {
  fetchMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  reorderMenuCategories,
} from '@/features/store-settings/api/menuCategories.api';

export function useMenuCategories() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['menu-categories', storeId],
    queryFn: () => fetchMenuCategories(storeId!),
    enabled: !!storeId,
  });
}

export function useCreateMenuCategory() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createMenuCategory(storeId!, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu-categories', storeId] }),
  });
}

export function useUpdateMenuCategory() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, name }: { categoryId: string; name: string }) =>
      updateMenuCategory(storeId!, categoryId, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu-categories', storeId] }),
  });
}

export function useDeleteMenuCategory() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => deleteMenuCategory(storeId!, categoryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menu-categories', storeId] });
      qc.invalidateQueries({ queryKey: ['menus', storeId] });
    },
  });
}

export function useReorderMenuCategories() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (categoryIds: string[]) => reorderMenuCategories(storeId!, categoryIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu-categories', storeId] }),
  });
}
