import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TodayClosingRecord {
  closingId: string;
  closingDate: string; // YYYY-MM-DD
  totalRevenue: number;
}

interface BusinessSession {
  isOpen: boolean;
  businessDate: string | null; // YYYY-MM-DD
}

interface ClosingStoreState {
  todayClosing: TodayClosingRecord | null;
  setTodayClosing: (record: TodayClosingRecord) => void;
  clearTodayClosing: () => void;

  businessSession: BusinessSession;
  setBusinessSession: (session: BusinessSession) => void;
  clearBusinessSession: () => void;
}

const useClosingStore = create<ClosingStoreState>()(
  persist(
    (set) => ({
      todayClosing: null,
      setTodayClosing: (record) => set({ todayClosing: record }),
      clearTodayClosing: () => set({ todayClosing: null }),

      businessSession: { isOpen: false, businessDate: null },
      setBusinessSession: (session) => set({ businessSession: session }),
      clearBusinessSession: () => set({ businessSession: { isOpen: false, businessDate: null } }),
    }),
    { name: 'baro-closing' },
  ),
);

export default useClosingStore;
