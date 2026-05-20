import type { MenuItem } from '@/features/initial-setup/types/initialSetup.types';
import type { Order } from '@/features/orders/types/order.types';

/** 고객용 주문 페이지에 표시할 메뉴 (초기 세팅 데이터가 연동되기 전 목업) */
export const MOCK_SHOP_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: '아메리카노',
    description: '에스프레소에 물을 더해 깔끔하게 즐기는 커피',
    price: 4500,
    isFeatured: true,
  },
  {
    id: 'm2',
    name: '카페라떼',
    description: '부드러운 우유와 에스프레소의 조화',
    price: 5000,
    isFeatured: false,
  },
  {
    id: 'm3',
    name: '카푸치노',
    description: '풍성한 우유 거품이 올라간 에스프레소',
    price: 5000,
    isFeatured: false,
  },
  {
    id: 'm4',
    name: '바닐라 라떼',
    description: '달콤한 바닐라 시럽과 라떼의 조화',
    price: 5500,
    isFeatured: true,
  },
  {
    id: 'm5',
    name: '카라멜 마키아토',
    description: '카라멜 시럽이 더해진 달콤한 라떼',
    price: 5500,
    isFeatured: false,
  },
  {
    id: 'm6',
    name: '녹차 라떼',
    description: '진한 말차 파우더로 만든 라떼',
    price: 5500,
    isFeatured: false,
  },
  {
    id: 'm7',
    name: '초코 스무디',
    description: '진한 초콜릿과 우유의 블렌드',
    price: 6000,
    isFeatured: false,
  },
  {
    id: 'm8',
    name: '딸기 스무디',
    description: '신선한 딸기로 만든 상큼한 스무디',
    price: 6000,
    isFeatured: false,
  },
];

const now = Date.now();

export const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord001',
    shopId: 'shop1',
    items: [
      { menuItemId: 'm1', name: '아메리카노', price: 4500, quantity: 2 },
      { menuItemId: 'm4', name: '바닐라 라떼', price: 5500, quantity: 1 },
    ],
    totalAmount: 14500,
    status: 'pending',
    tableNumber: '3번 테이블',
    createdAt: new Date(now - 2 * 60_000).toISOString(),
  },
  {
    id: 'ord002',
    shopId: 'shop1',
    items: [{ menuItemId: 'm2', name: '카페라떼', price: 5000, quantity: 1 }],
    totalAmount: 5000,
    status: 'pending',
    tableNumber: '6번 테이블',
    createdAt: new Date(now - 4 * 60_000).toISOString(),
  },
  {
    id: 'ord003',
    shopId: 'shop1',
    items: [
      { menuItemId: 'm3', name: '카푸치노', price: 5000, quantity: 1 },
      { menuItemId: 'm7', name: '초코 스무디', price: 6000, quantity: 1 },
    ],
    totalAmount: 11000,
    status: 'preparing',
    tableNumber: '1번 테이블',
    createdAt: new Date(now - 8 * 60_000).toISOString(),
  },
  {
    id: 'ord004',
    shopId: 'shop1',
    items: [{ menuItemId: 'm5', name: '카라멜 마키아토', price: 5500, quantity: 2 }],
    totalAmount: 11000,
    status: 'completed',
    tableNumber: '2번 테이블',
    createdAt: new Date(now - 20 * 60_000).toISOString(),
  },
  {
    id: 'ord005',
    shopId: 'shop1',
    items: [
      { menuItemId: 'm6', name: '녹차 라떼', price: 5500, quantity: 1 },
      { menuItemId: 'm8', name: '딸기 스무디', price: 6000, quantity: 1 },
    ],
    totalAmount: 11500,
    status: 'completed',
    tableNumber: '4번 테이블',
    createdAt: new Date(now - 35 * 60_000).toISOString(),
  },
];
