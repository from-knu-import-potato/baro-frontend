import type {
  InitialSetupData,
  OperatingHour,
} from '@/features/initial-setup/types/initialSetup.types';

const DEFAULT_OPERATING_HOURS: OperatingHour[] = [
  { dayOfWeek: 'monday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { dayOfWeek: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { dayOfWeek: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { dayOfWeek: 'thursday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { dayOfWeek: 'friday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { dayOfWeek: 'saturday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
  { dayOfWeek: 'sunday', isOpen: false, openTime: '10:00', closeTime: '21:00' },
];

export const DEFAULT_SETUP_DATA: InitialSetupData = {
  basicInfo: {
    storeName: '',
    businessType: 'individual',
    category: 'cafe',
  },
  operatingHours: DEFAULT_OPERATING_HOURS,
  menuItems: [],
  recipes: [],
  keyIngredients: [],
  notificationSettings: {
    lowStockAlert: true,
    expiryAlert: true,
    orderRecommendationAlert: true,
    alertChannels: {
      email: false,
      kakao: true,
      push: true,
    },
  },
};
