import type { MenuItem, Recipe } from '@/features/initial-setup/types/initialSetup.types';
import type { StoreSettings } from '@/features/settings/types/settings.types';

export const MOCK_STORE_SETTINGS: StoreSettings = {
  storeName: '임포트 감자 식당',
  ownerName: '유다연',
  businessType: 'individual',
  category: 'korean',
  operatingHours: [
    { dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
    { dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
    { dayOfWeek: 'sunday', isOpen: false, openTime: '10:00', closeTime: '21:00' },
  ],
};

export const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: 'menu-1', name: '된장찌개', price: 9000, isFeatured: true },
  { id: 'menu-2', name: '김치찌개', price: 8000, isFeatured: false },
  { id: 'menu-3', name: '제육볶음', price: 10000, isFeatured: false },
];

export const MOCK_RECIPES: Recipe[] = [
  {
    menuItemId: 'menu-1',
    ingredients: [
      { id: 'ing-1', ingredientName: '된장', amount: 0.5, unit: '개' },
      { id: 'ing-2', ingredientName: '두부', amount: 1, unit: '개' },
      { id: 'ing-3', ingredientName: '애호박', amount: 0.5, unit: '개' },
    ],
  },
  {
    menuItemId: 'menu-2',
    ingredients: [
      { id: 'ing-4', ingredientName: '김치', amount: 1, unit: '개' },
      { id: 'ing-5', ingredientName: '돼지고기', amount: 1, unit: '개' },
      { id: 'ing-6', ingredientName: '두부', amount: 0.5, unit: '개' },
    ],
  },
  {
    menuItemId: 'menu-3',
    ingredients: [
      { id: 'ing-7', ingredientName: '돼지고기', amount: 2, unit: '개' },
      { id: 'ing-8', ingredientName: '양파', amount: 0.5, unit: '개' },
      { id: 'ing-9', ingredientName: '고추장', amount: 0.5, unit: '개' },
    ],
  },
];
