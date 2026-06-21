import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import {
  deleteUnitConversion,
  fetchUnitConversions,
  saveUnitConversions,
  type UnitConversionSaveDto,
} from '@/features/ocr-inbound/api/unitConversions.api';
import type { UnitConversionDto } from '@/features/ocr-inbound/types/ocrInbound.api.types';

export type UnitConversionMap = Map<string, UnitConversionDto>;

export interface UnitConversionData {
  list: UnitConversionDto[];
  map: UnitConversionMap;
}

export const makeConversionKey = (ingredientId: string, purchaseUnit: string) =>
  `${ingredientId}:${purchaseUnit.toUpperCase()}`;

export function useUnitConversions() {
  const storeId = useAuthStore((s) => s.storeId);

  return useQuery({
    queryKey: ['unitConversions', storeId],
    queryFn: async (): Promise<UnitConversionData> => {
      if (!storeId) return { list: [], map: new Map() };
      const list = await fetchUnitConversions(storeId);
      const map: UnitConversionMap = new Map();
      list.forEach((conv) => {
        map.set(makeConversionKey(conv.ingredientId, conv.purchaseUnit), conv);
      });
      return { list, map };
    },
    enabled: !!storeId,
    staleTime: Infinity,
  });
}

export function useUpdateUnitConversion() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: UnitConversionSaveDto) => {
      if (!storeId) throw new Error('storeId 없음');
      return saveUnitConversions(storeId, [dto]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['unitConversions', storeId] });
    },
  });
}

export function useDeleteUnitConversion() {
  const storeId = useAuthStore((s) => s.storeId);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (conversionId: string) => {
      if (!storeId) throw new Error('storeId 없음');
      return deleteUnitConversion(storeId, conversionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['unitConversions', storeId] });
    },
  });
}
