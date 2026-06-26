export interface ApiMenuCategory {
  id: string;
  name: string;
  order: number;
}

export interface ApiStoreTheme {
  themeColor:
    | 'navy'
    | 'slate'
    | 'teal'
    | 'charcoal'
    | 'mauve'
    | 'sage'
    | 'lavender'
    | 'terra'
    | 'warmgray'
    | 'coolgray'
    | 'blue'
    | 'green';
  layout: 'list' | 'grid';
  bannerImageUrl: string | null;
  bannerPosition: string;
}

export interface ApiMenu {
  id: string;
  storeId: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string | null;
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
  customerNote?: string;
  createdAt: string;
  updatedAt: string;
  items?: ApiOrderItem[];
  stockWarnings?: StockWarning[];
}

export interface CreateOrderRequest {
  tableNumber: number;
  items: { menuId: string; quantity: number }[];
  customerNote?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'preparing' | 'completed' | 'cancelled';
  restoreStock?: boolean;
}

export interface StockWarning {
  ingredientName: string;
  required: number;
  currentStock: number;
  unit: 'g' | 'ml' | '개';
}

export interface SseNewOrderPayload {
  id: string;
  storeId: string;
  tableNumber: number;
  status: ApiOrderStatus;
  totalPrice: number;
  items?: ApiOrderItem[];
  stockWarnings: StockWarning[];
}
