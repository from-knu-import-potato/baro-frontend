export interface ApiMenu {
  id: string;
  storeId: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrderItem {
  id: string;
  orderId: string;
  menuId: string;
  quantity: number;
  unitPrice: number;
  menu: ApiMenu;
}

export type ApiOrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface ApiOrder {
  id: string;
  storeId: string;
  tableNumber: number;
  status: ApiOrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items?: ApiOrderItem[];
}

export interface CreateOrderRequest {
  tableNumber: number;
  items: { menuId: string; quantity: number }[];
}

export interface UpdateOrderStatusRequest {
  status: 'preparing' | 'completed' | 'cancelled';
}
