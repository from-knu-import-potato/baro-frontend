export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  shopId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  tableNumber?: string;
  customerNote?: string;
  createdAt: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
