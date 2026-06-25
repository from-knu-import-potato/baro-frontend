import { create } from 'zustand';

import type { StockWarning } from '@/features/customer-order/types/customerOrder.api.types';

interface OrderWarningsState {
  warnings: Record<string, StockWarning[]>;
  setWarnings: (orderId: string, warnings: StockWarning[]) => void;
  clearWarnings: (orderId: string) => void;
}

const useOrderWarningsStore = create<OrderWarningsState>((set) => ({
  warnings: {},
  setWarnings: (orderId, warnings) =>
    set((state) => ({ warnings: { ...state.warnings, [orderId]: warnings } })),
  clearWarnings: (orderId) =>
    set((state) => {
      const next = { ...state.warnings };
      delete next[orderId];
      return { warnings: next };
    }),
}));

export default useOrderWarningsStore;
