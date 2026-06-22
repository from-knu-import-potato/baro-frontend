import type {
  AccountSettings,
  NotificationSettings,
} from '@/features/account-settings/types/account-settings.types';

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

export const APP_VERSION = '1.0.0';
