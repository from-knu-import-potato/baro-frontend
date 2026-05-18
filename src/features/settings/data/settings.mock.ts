import type {
  AccountSettings,
  NotificationSettings,
  StoreSettings,
} from '@/features/settings/types/settings.types';

export const MOCK_STORE_SETTINGS: StoreSettings = {
  storeName: '임포트 감자 식당',
  ownerName: '유다연',
  businessType: 'individual',
  category: 'korean',
};

export const MOCK_ACCOUNT_SETTINGS: AccountSettings = {
  name: '유다연',
  email: 'example@baro.com',
};

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  lowStockAlert: true,
  expiryAlert: true,
  orderRecommendationAlert: true,
  priceChangeAlert: false,
  channels: {
    push: true,
    email: false,
    kakao: true,
  },
};

export const APP_VERSION = '0.1.0 (Beta)';
