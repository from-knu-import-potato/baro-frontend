export type BusinessType = 'franchise' | 'directly-operated' | 'individual';

export type StoreCategory =
  | 'korean'
  | 'western'
  | 'cafe'
  | 'bunsik'
  | 'japanese'
  | 'chinese'
  | 'fastfood'
  | 'other';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type IngredientUnit = 'g' | 'kg' | 'ml' | 'L' | '개' | '봉' | '팩' | '병' | '캔';

export interface StoreBasicInfo {
  storeName: string;
  businessType: BusinessType;
  category: StoreCategory;
}

export interface OperatingHour {
  dayOfWeek: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isFeatured: boolean;
}

export interface RecipeIngredient {
  id: string;
  ingredientName: string;
  amount: number;
  unit: IngredientUnit;
}

export interface Recipe {
  menuItemId: string;
  ingredients: RecipeIngredient[];
}

export interface KeyIngredient {
  id: string;
  name: string;
  minStockAmount: number;
  unit: IngredientUnit;
}

export interface NotificationSettings {
  lowStockAlert: boolean;
  expiryAlert: boolean;
  orderRecommendationAlert: boolean;
  alertChannels: {
    email: boolean;
    kakao: boolean;
    push: boolean;
  };
}

export type AlertKey = 'lowStockAlert' | 'expiryAlert' | 'orderRecommendationAlert';

export type ChannelKey = keyof NotificationSettings['alertChannels'];

export interface InitialSetupData {
  basicInfo: StoreBasicInfo;
  operatingHours: OperatingHour[];
  menuItems: MenuItem[];
  recipes: Recipe[];
  keyIngredients: KeyIngredient[];
  notificationSettings: NotificationSettings;
}
