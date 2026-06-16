import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TodayClosingRecord {
  closingId: string;
  closingDate: string; // YYYY-MM-DD
  totalRevenue: number;
}

interface ClosingStoreState {
  todayClosing: TodayClosingRecord | null;
  setTodayClosing: (record: TodayClosingRecord) => void;
  clearTodayClosing: () => void;
}

const useClosingStore = create<ClosingStoreState>()(
  persist(
    (set) => ({
      todayClosing: null,
      setTodayClosing: (record) => set({ todayClosing: record }),
      clearTodayClosing: () => set({ todayClosing: null }),
    }),
    { name: 'baro-closing' },
  ),
);

export default useClosingStore;
