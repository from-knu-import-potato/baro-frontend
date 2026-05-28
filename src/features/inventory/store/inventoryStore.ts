import { create } from 'zustand';

import { MOCK_INVENTORY_ITEMS } from '@/features/inventory/data/inventory.mock';
import type { InventoryItem, InventoryStatus } from '@/features/inventory/types/inventory.types';
import type { OcrInboundItem } from '@/features/ocr-inbound/types/ocrInbound.types';

function toBaseAmount(value: number, unit: string): number {
  if (unit === 'kg') return value * 1000;
  if (unit === 'L') return value * 1000;
  return value;
}

function fromBaseAmount(value: number, targetUnit: string): number {
  if (targetUnit === 'kg') return value / 1000;
  if (targetUnit === 'L') return value / 1000;
  return value;
}

function calcStatus(
  currentStock: number,
  unit: string,
  safetyStock: number,
  safetyStockUnit: string,
): InventoryStatus {
  const current = toBaseAmount(currentStock, unit);
  const safety = toBaseAmount(safetyStock, safetyStockUnit);
  if (current <= 0) return 'depleted';
  if (safety === 0) return 'normal';
  const ratio = current / safety;
  if (ratio < 0.5) return 'critical';
  if (ratio < 1.0) return 'warning';
  return 'normal';
}

interface InventoryStore {
  items: InventoryItem[];
  applyInbound: (inboundItems: OcrInboundItem[]) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [...MOCK_INVENTORY_ITEMS],

  applyInbound: (inboundItems) => {
    const today = new Date().toISOString().split('T')[0];

    set((state) => ({
      items: state.items.map((inv) => {
        const match = inboundItems.find(
          (ocr) => ocr.isMatched && ocr.matchedInventoryId === inv.id,
        );
        if (!match) return inv;

        const currentBase = toBaseAmount(inv.currentStock, inv.unit);
        const addedBase = toBaseAmount(match.quantity, match.unit);
        const newBase = currentBase + addedBase;
        const newStock = fromBaseAmount(newBase, inv.unit);
        const newStatus = calcStatus(newStock, inv.unit, inv.safetyStock, inv.safetyStockUnit);

        return {
          ...inv,
          currentStock: newStock,
          inboundDate: today,
          status: newStatus,
        };
      }),
    }));
  },
}));
