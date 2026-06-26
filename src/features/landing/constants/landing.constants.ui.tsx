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
    title: '실시간 재고 관리',
    description:
      '주문 수락 시 레시피 기반으로 재고가 즉시 차감됩니다. 마감엔 실제 잔량을 확인하고 차이만 보정하면 끝.',
    color: 'text-baro-black',
    bgColor: 'bg-baro-black-muted/5',
  },
];
