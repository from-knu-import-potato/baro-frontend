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

export interface StoreBasicInfo {
  /** 카카오톡에서 받아온 대표자 이름 (읽기 전용 표시) */
  ownerName: string;
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
  description: string;
  price: number;
  isFeatured: boolean;
  imageUrl?: string;
  /** 초기 세팅 중 선택된 이미지 파일 (서버 미전송, setup 완료 후 업로드) */
  imageFile?: File;
}

/** 태그 형태로 등록되는 식자재 종류 (재고 수량이 아닌 종류 등록) */
export interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

/** 레시피에 사용되는 식자재 항목 (Ingredient 참조) */
export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  amount: number;
}

export interface Recipe {
  menuItemId: string;
  ingredients: RecipeIngredient[];
}

export interface InitialSetupData {
  basicInfo: StoreBasicInfo;
  operatingHours: OperatingHour[];
  menuItems: MenuItem[];
  ingredients: Ingredient[];
  recipes: Recipe[];
}
