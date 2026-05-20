import { create } from 'zustand';

import { MOCK_INITIAL_ORDERS } from '@/features/orders/data/order.mock';
import type { Order, OrderStatus } from '@/features/orders/types/order.types';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getTodayRevenue: () => number;
  getTodayOrderCount: () => number;
}

const generateOrderId = () =>
  `ord${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: MOCK_INITIAL_ORDERS,

  addOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },

  getTodayRevenue: () => {
    const today = new Date().toDateString();
    return get()
      .orders.filter(
        (o) => o.status === 'completed' && new Date(o.createdAt).toDateString() === today,
      )
      .reduce((sum, o) => sum + o.totalAmount, 0);
  },

  getTodayOrderCount: () => {
    const today = new Date().toDateString();
    return get().orders.filter((o) => new Date(o.createdAt).toDateString() === today).length;
  },
}));
