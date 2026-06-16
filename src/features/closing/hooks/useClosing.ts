import { useMutation } from '@tanstack/react-query';

import { submitClosing } from '@/features/closing/api/closing.api';
import type { ClosingRequest } from '@/features/closing/types/closing.types';

export const useClosing = (storeId: string) =>
  useMutation({
    mutationFn: (body: ClosingRequest) => submitClosing(storeId, body),
  });
