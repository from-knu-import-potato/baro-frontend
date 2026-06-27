import type {
  InboundRecord,
  InboundRecordDetail,
} from '@/features/ocr-inbound/types/ocrInbound.api.types';
import axiosInstance from '@/shared/api/axiosInstance';

export async function fetchInboundHistory(storeId: string): Promise<InboundRecord[]> {
  const res = await axiosInstance.get<{ success: boolean; data: InboundRecord[] }>(
    `/stores/${storeId}/ingredients/inbound`,
  );
  return res.data.data;
}

export async function fetchInboundDetail(
  storeId: string,
  recordId: string,
): Promise<InboundRecordDetail> {
  const res = await axiosInstance.get<{ success: boolean; data: InboundRecordDetail }>(
    `/stores/${storeId}/ingredients/inbound/${recordId}`,
  );
  return res.data.data;
}
