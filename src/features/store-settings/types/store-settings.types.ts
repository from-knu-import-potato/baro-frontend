import type { OperatingHour } from '@/features/initial-setup/types/initialSetup.types';

export interface StoreOwner {
  id: string;
  name: string;
  profileImage: string | null;
}

export type StoreRole = 'owner' | 'staff' | null;

export interface StoreSettings {
  storeName: string;
  owner: StoreOwner;
  myRole: StoreRole;
  businessType: 'franchise' | 'directly-operated' | 'individual';
  category: string;
  memo: string;
  safetyStockPct?: number | null;
  operatingHours: OperatingHour[];
  inviteCode?: string | null;
}

export interface StoreStaff {
  id: string;
  name: string;
}

export interface StoreMember {
  userId: string;
  name: string;
  profileImage: string | null;
  role: 'owner' | 'staff';
  joinedAt: string;
}
