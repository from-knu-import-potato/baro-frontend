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
    ownerName: '홍길동', // TODO: 카카오톡 OAuth에서 실제 이름으로 교체
    storeName: '',
    businessType: 'individual',
    category: 'cafe',
  },
  operatingHours: DEFAULT_OPERATING_HOURS,
  menuItems: [],
  ingredients: [],
  recipes: [],
  safetyStockPct: 20,
};
