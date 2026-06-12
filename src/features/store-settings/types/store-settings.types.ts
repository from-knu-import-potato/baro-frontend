export interface StoreSettings {
  storeName: string;
  ownerName: string;
  businessType: 'franchise' | 'directly-operated' | 'individual';
  category: string;
  memo: string;
}

export interface StoreStaff {
  id: string;
  name: string;
}
