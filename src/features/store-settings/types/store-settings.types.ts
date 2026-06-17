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
}

export interface StoreStaff {
  id: string;
  name: string;
}
