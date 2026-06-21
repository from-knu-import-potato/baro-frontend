import type {
  BusinessOpenRequest,
  BusinessOpenResponse,
  BusinessOpenStatus,
  ClosingHistory,
  ClosingHistoryItem,
  ClosingPreview,
  ClosingRequest,
  ClosingResponse,
} from '@/features/closing/types/closing.types';
import axiosInstance from '@/shared/api/axiosInstance';

export const fetchClosingPreview = (storeId: string, date?: string): Promise<ClosingPreview> =>
  axiosInstance
    .get<{ success: boolean; data: ClosingPreview }>(`/stores/${storeId}/closing/preview`, {
      params: date ? { date } : undefined,
    })
    .then((res) => res.data.data);

export const submitClosing = (storeId: string, body: ClosingRequest): Promise<ClosingResponse> =>
  axiosInstance
    .post<{ success: boolean; data: ClosingResponse }>(`/stores/${storeId}/closing`, body)
    .then((res) => res.data.data);

export const fetchClosingHistory = (storeId: string): Promise<ClosingHistory> =>
  axiosInstance
    .get<{ success: boolean; data: ClosingHistoryItem[] }>(`/stores/${storeId}/closing`)
    .then((res) => ({ closings: res.data.data }));

export const cancelClosing = (storeId: string, id: string): Promise<void> =>
  axiosInstance.delete(`/stores/${storeId}/closing/${id}`).then(() => undefined);

export const openBusiness = (
  storeId: string,
  body: BusinessOpenRequest,
): Promise<BusinessOpenResponse> =>
  axiosInstance
    .post<{ success: boolean; data: BusinessOpenResponse }>(`/stores/${storeId}/open`, body)
    .then((res) => res.data.data);

export const fetchBusinessOpenStatus = (storeId: string): Promise<BusinessOpenStatus> =>
  axiosInstance
    .get<{ success: boolean; data: BusinessOpenStatus }>(`/stores/${storeId}/open/status`)
    .then((res) => res.data.data);
