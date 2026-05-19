import type { Notification } from '@/features/notification/types/notification.types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    category: 'expiry',
    title: '유통기한 임박',
    message: '두부 (4모) 의 유통기한이 1일 남았습니다.',
    timestamp: '5분 전',
    isRead: false,
  },
  {
    id: '2',
    category: 'stock',
    title: '재고 부족',
    message: '돼지고기의 재고가 600g으로 기준치 이하입니다.',
    timestamp: '30분 전',
    isRead: false,
  },
  {
    id: '3',
    category: 'price',
    title: '가격 변동 감지',
    message: '감자 시세가 지난 주 대비 12% 상승했습니다.',
    timestamp: '2시간 전',
    isRead: true,
  },
  {
    id: '4',
    category: 'system',
    title: 'OCR 처리 완료',
    message: '5월 14일자 거래명세서 분석이 완료됐습니다.',
    timestamp: '어제',
    isRead: true,
  },
];
