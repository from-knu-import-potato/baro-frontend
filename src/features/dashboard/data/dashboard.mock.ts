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
  '지난 매출과 오늘 날씨 정보를 파악해보니 뜨거운 국물 요리가 많이 나갈 것 같아요. (지난 주 대비 기온 4°C 하락, 동일 조건 주간 찌개류 매출 +31% 근거)';

export const MOCK_RECOMMENDATIONS: OrderRecommendationItem[] = [
  {
    id: '1',
    name: '감자',
    aiReason:
      '유통기한이 2일밖에 남지 않았고, 이번 주 메뉴에 가장 많이 쓰이는 식자재예요. 지금 남은 재고(5kg)를 소진하기 전에 미리 발주해 두는 걸 권장해요.',
  },
  {
    id: '2',
    name: '돼지고기',
    aiReason:
      '현재 재고(600g)가 주간 평균 소비량(3.5kg)의 17% 수준이에요. 이 추세라면 2~3일 내 재고가 바닥날 가능성이 높으니 빠른 발주가 필요해요.',
  },
  {
    id: '3',
    name: '두부',
    aiReason:
      '유통기한이 내일까지로 급박해요. 된장찌개·김치찌개 모두에 쓰이는 핵심 재료라 오늘 영업 중 소진될 수 있으니, 신선한 제품을 당일 발주하는 것을 강력 추천해요.',
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
