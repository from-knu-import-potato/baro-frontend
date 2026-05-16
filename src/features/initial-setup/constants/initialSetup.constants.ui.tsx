import { Clock, Package, TrendingUp } from 'lucide-react';

import type { AlertKey } from '@/features/initial-setup/types/initialSetup.types';

export const ALERT_TYPE_CONFIG: {
  key: AlertKey;
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    key: 'lowStockAlert',
    icon: Package,
    title: '재고 부족 알림',
    description: '설정한 최소 재고 기준 이하로 떨어지면 알림을 보내드려요',
  },
  {
    key: 'expiryAlert',
    icon: Clock,
    title: '유통기한 임박 알림',
    description: '유통기한이 3일 이내로 남은 식자재가 있을 때 알림을 보내드려요',
  },
  {
    key: 'orderRecommendationAlert',
    icon: TrendingUp,
    title: '발주 추천 알림',
    description: 'AI가 분석한 소비 패턴을 기반으로 발주 시점을 알려드려요',
  },
];
