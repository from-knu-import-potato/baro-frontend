import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import useAuthStore from '@/features/auth/store/authStore';
import type { SseNewOrderPayload } from '@/features/customer-order/types/customerOrder.api.types';
import useOrderWarningsStore from '@/features/dashboard/store/orderWarningsStore';

// EventSource는 커스텀 헤더를 지원하지 않으므로 fetch + ReadableStream으로 SSE 연결
export const useOrderSSE = (storeId: string | null) => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!storeId || !accessToken) return;

    const controller = new AbortController();

    const connect = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/stores/${storeId}/orders/stream`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            signal: controller.signal,
          },
        );

        if (!response.ok || !response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let eventType = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              if (eventType === 'new-order') {
                try {
                  const payload = JSON.parse(line.slice(6)) as SseNewOrderPayload;
                  if (payload.stockWarnings?.length) {
                    useOrderWarningsStore.getState().setWarnings(payload.id, payload.stockWarnings);
                  }
                } catch {
                  // 파싱 실패 시 무시
                }
                queryClient.invalidateQueries({ queryKey: ['orders', storeId] });
              } else if (eventType === 'order-status-changed') {
                queryClient.invalidateQueries({ queryKey: ['orders', storeId] });
              }
              eventType = '';
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        // 연결 끊김 시 3초 후 재연결
        setTimeout(connect, 3_000);
      }
    };

    connect();

    return () => controller.abort();
  }, [storeId, accessToken, queryClient]);
};
