import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import {
  fetchMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  type MenuDto,
} from '@/features/store-settings/api/menus.api';

export function useMenus() {
  const storeId = useAuthStore((s) => s.storeId);
  return useQuery({
    queryKey: ['menus', storeId],
    queryFn: () => fetchMenus(storeId!),
    enabled: !!storeId,
  });
}

export function useCreateMenu() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MenuDto, 'id' | 'isAvailable'>) => createMenu(storeId!, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus', storeId] }),
  });
}

export function useUpdateMenu() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: string; data: Partial<MenuDto> }) =>
      updateMenu(storeId!, menuId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus', storeId] }),
  });
}

export function useDeleteMenu() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (menuId: string) => deleteMenu(storeId!, menuId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus', storeId] }),
  });
}
