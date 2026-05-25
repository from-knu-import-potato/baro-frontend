import type {
  StoreSettings,
  StoreStaff,
} from '@/features/store-settings/types/store-settings.types';

export const MOCK_STORE_SETTINGS: StoreSettings = {
  storeName: '임포트 감자 카페',
  ownerName: '유다연',
  businessType: 'individual',
  category: 'cafe',
};

export const MOCK_STORE_STAFF: StoreStaff[] = [
  { id: '1', name: '유다연' },
  { id: '2', name: '홍길동' },
  { id: '3', name: '김철수' },
  { id: '4', name: '박민수' },
];
