import type { Notification } from '@/features/notification/types/notification.types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    category: 'expiry',
    title: '유통기한 임박',
    message: '우유 (2L) 의 유통기한이 1일 남았습니다.',
    timestamp: '5분 전',
    isRead: false,
  },
  {
    id: '2',
    category: 'stock',
    title: '재고 부족',
    message: '에티오피아 원두 재고가 200g으로 기준치 이하입니다.',
    timestamp: '30분 전',
    isRead: false,
  },
  {
    id: '3',
    category: 'price',
    title: '가격 변동 감지',
    message: '원두 시세가 지난 주 대비 8% 상승했습니다.',
    timestamp: '2시간 전',
    isRead: true,
  },
  {
    id: '4',
    category: 'system',
    title: 'OCR 처리 완료',
    message: '5월 19일자 거래명세서 분석이 완료됐습니다.',
    timestamp: '어제',
    isRead: true,
  },
];
