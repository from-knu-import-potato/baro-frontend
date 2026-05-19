import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';

export interface StoreSettings {
  storeName: string;
  ownerName: string;
  businessType: 'franchise' | 'directly-operated' | 'individual';
  category: string;
  operatingHours: OperatingHour[];
}
