import { Camera, BarChart3, TrendingUp, Zap } from 'lucide-react';

import type { Feature } from '@/features/landing/types/landing.types.ui';

export const features: Feature[] = [
  {
    icon: <Camera size={32} />,
    title: 'OCR 기반 입고 자동화',
    description: '거래명세서를 촬영하면 AI가 품목, 수량, 가격을 자동으로 인식하여 등록합니다.',
    color: 'text-baro-blue',
    bgColor: 'bg-baro-blue/5',
  },
  {
    icon: <BarChart3 size={32} />,
    title: 'AI 수요 예측 & 발주 가이드',
    description: '가게의 소비 패턴을 분석하여 적정 발주량을 추천하고 품절을 방지합니다.',
    color: 'text-baro-green',
    bgColor: 'bg-baro-green/5',
  },
  {
    icon: <TrendingUp size={32} />,
    title: '식자재 시세 변동 분석',
    description: '매일 변하는 도소매 시장 가격 정보를 제공하여 합리적인 구매를 돕습니다.',
    color: 'text-baro-red',
    bgColor: 'bg-baro-red/5',
  },
  {
    icon: <Zap size={32} />,
    title: '스마트 마감 & 오차 분석',
    description: '판매량 기반 이론 재고와 실제 재고의 오차를 분석하여 로스율을 관리합니다.',
    color: 'text-baro-black',
    bgColor: 'bg-baro-black-muted/5',
  },
];
