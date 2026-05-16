import type {
  DashboardStats,
  MonthlySalesData,
  OrderRecommendationItem,
} from '@/features/dashboard/types/dashboard.types';

export const MOCK_STORE = {
  name: '임포트 감자 식당',
  category: '춘천 | 한식 | 개인',
};

export const MOCK_USER = {
  name: '유다연',
  role: '사장',
};

export const MOCK_STATS: DashboardStats = {
  totalInventory: 81,
  expiringItems: 8,
  aiOrderRecommendations: 3,
  monthlyConsumption: 1132171,
  monthlyConsumptionChange: -4.3,
  lastUpdated: '2026-05-03 18:38:12',
};

export const MOCK_DEMAND_PREDICTION =
  '지난 매출과 오늘 날씨 정보를 파악해보니 따뜻한 음료가 많이 나갈 것 같아요. (지난 주 대비 기온 4°C 하락, 동일 조건 주간 핫 음료 매출 +28% 근거)';

export const MOCK_RECOMMENDATIONS: OrderRecommendationItem[] = [
  {
    id: '1',
    name: '감자',
    reason: 'expiring',
    detail: '유통기한 2일 남음 · 현재 재고 5kg',
  },
  {
    id: '2',
    name: '버터',
    reason: 'low_stock',
    detail: '현재 재고 200g · 주간 평균 소비 1.2kg',
  },
  {
    id: '3',
    name: '우유',
    reason: 'expiring',
    detail: '유통기한 1일 남음 · 현재 재고 2L',
  },
  {
    id: '4',
    name: '밀가루',
    reason: 'low_stock',
    detail: '현재 재고 500g · 주간 평균 소비 3kg',
  },
  {
    id: '5',
    name: '토마토 소스',
    reason: 'low_stock',
    detail: '현재 재고 1병 · 일평균 소비 0.5병',
  },
];

export const MOCK_SALES_DATA: MonthlySalesData[] = [
  { month: '1월', consumption: 820000, sales: 1100000 },
  { month: '2월', consumption: 760000, sales: 980000 },
  { month: '3월', consumption: 910000, sales: 1230000 },
  { month: '4월', consumption: 870000, sales: 1180000 },
  { month: '5월', consumption: 950000, sales: 1320000 },
  { month: '6월', consumption: 1010000, sales: 1400000 },
  { month: '7월', consumption: 1120000, sales: 1550000 },
  { month: '8월', consumption: 1080000, sales: 1490000 },
  { month: '9월', consumption: 990000, sales: 1360000 },
  { month: '10월', consumption: 920000, sales: 1250000 },
  { month: '11월', consumption: 1050000, sales: 1430000 },
  { month: '12월', consumption: 1132171, sales: 1580000 },
];
