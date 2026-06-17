import { Camera, BarChart3, QrCode, Zap } from 'lucide-react';

import type { Feature } from '@/features/landing/types/landing.types.ui';

export const features: Feature[] = [
  {
    icon: <QrCode size={32} />,
    title: 'QR 비대면 주문 시스템',
    description:
      '테이블 QR 스캔만으로 손님이 직접 주문하고, 사장님은 실시간으로 주문을 수신합니다.',
    color: 'text-baro-blue',
    bgColor: 'bg-baro-blue/5',
  },
  {
    icon: <Camera size={32} />,
    title: 'OCR 기반 입고 자동화',
    description:
      '거래명세서를 촬영하면 AI가 품목, 수량, 단위를 자동으로 인식하여 재고에 등록합니다.',
    color: 'text-baro-green',
    bgColor: 'bg-baro-green/5',
  },
  {
    icon: <BarChart3 size={32} />,
    title: 'AI 발주 가이드',
    description: '재고 데이터 기반으로 AI가 발주 필요 품목과 권장 발주량, 추천 이유를 제공합니다.',
    color: 'text-baro-red',
    bgColor: 'bg-baro-red/5',
  },
  {
    icon: <Zap size={32} />,
    title: '마감 자동화',
    description:
      '당일 판매 메뉴와 레시피를 기반으로 이론 사용량을 계산하고, 검토 후 재고를 자동 차감합니다.',
    color: 'text-baro-black',
    bgColor: 'bg-baro-black-muted/5',
  },
];
