export interface AccountSettings {
  name: string;
  email: string;
}

export interface NotificationSettings {
  lowStockAlert: boolean;
  expiryAlert: boolean;
  orderRecommendationAlert: boolean;
  priceChangeAlert: boolean;
  channels: {
    push: boolean;
    email: boolean;
    kakao: boolean;
  };
}
