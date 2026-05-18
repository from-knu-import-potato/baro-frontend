export interface StoreSettings {
  storeName: string;
  ownerName: string;
  businessType: 'franchise' | 'directly-operated' | 'individual';
  category: string;
}

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
