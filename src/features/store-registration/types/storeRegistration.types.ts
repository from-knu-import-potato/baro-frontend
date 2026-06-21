export interface MyStore {
  storeId: string;
  storeName: string;
  role: 'owner' | 'staff';
  themeColor: string;
}

export interface JoinStoreResult {
  storeId: string;
  storeName: string;
  role: 'staff';
}
