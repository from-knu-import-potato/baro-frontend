import type { UnitConversionDto } from '@/features/ocr-inbound/types/ocrInbound.api.types';
import type { OcrUnit } from '@/features/ocr-inbound/types/ocrInbound.types';
import axiosInstance from '@/shared/api/axiosInstance';

export interface UnitConversionSaveDto {
  ingredientId: string;
  purchaseUnit: string;
  baseUnit: OcrUnit;
  factor: number;
}

export async function fetchUnitConversions(storeId: string): Promise<UnitConversionDto[]> {
  const res = await axiosInstance.get<{ success: boolean; data: UnitConversionDto[] }>(
    `/stores/${storeId}/unit-conversions`,
  );
  return res.data.data;
}

export async function saveUnitConversions(
  storeId: string,
  conversions: UnitConversionSaveDto[],
): Promise<void> {
  await axiosInstance.put(`/stores/${storeId}/unit-conversions`, conversions);
}

export async function deleteUnitConversion(storeId: string, conversionId: string): Promise<void> {
  await axiosInstance.delete(`/stores/${storeId}/unit-conversions/${conversionId}`);
}
