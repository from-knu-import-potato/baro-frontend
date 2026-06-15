import axiosInstance from '@/shared/api/axiosInstance';

export type ThemeColor =
  | 'navy'
  | 'slate'
  | 'teal'
  | 'charcoal'
  | 'mauve'
  | 'sage'
  | 'lavender'
  | 'terra'
  | 'warmgray'
  | 'coolgray'
  | 'blue'
  | 'green';

export type MenuLayout = 'list' | 'grid';

export interface StoreThemeDto {
  themeColor: ThemeColor;
  layout: MenuLayout;
  bannerImageUrl: string | null;
  bannerPosition: string;
}

export const THEME_COLOR_GROUPS: {
  label: string;
  colors: { key: ThemeColor; label: string; hex: string }[];
}[] = [
  {
    label: '모던',
    colors: [
      { key: 'navy', label: '네이비', hex: '#1B3A5C' },
      { key: 'slate', label: '슬레이트', hex: '#3D5166' },
      { key: 'teal', label: '딥틸', hex: '#1B4547' },
      { key: 'charcoal', label: '차콜', hex: '#3A3F47' },
    ],
  },
  {
    label: '파스텔',
    colors: [
      { key: 'mauve', label: '모브', hex: '#9E7A84' },
      { key: 'sage', label: '세이지', hex: '#6A9E78' },
      { key: 'lavender', label: '라벤더', hex: '#8A80B4' },
      { key: 'terra', label: '테라코타', hex: '#B07868' },
    ],
  },
  {
    label: '심플',
    colors: [
      { key: 'warmgray', label: '웜그레이', hex: '#867B72' },
      { key: 'coolgray', label: '쿨그레이', hex: '#5F6C78' },
    ],
  },
  {
    label: '바로',
    colors: [
      { key: 'blue', label: '바로블루', hex: '#449CD4' },
      { key: 'green', label: '바로그린', hex: '#679436' },
    ],
  },
];

export const THEME_HEX: Record<ThemeColor, string> = {
  navy: '#1B3A5C',
  slate: '#3D5166',
  teal: '#1B4547',
  charcoal: '#3A3F47',
  mauve: '#9E7A84',
  sage: '#6A9E78',
  lavender: '#8A80B4',
  terra: '#B07868',
  warmgray: '#867B72',
  coolgray: '#5F6C78',
  blue: '#449CD4',
  green: '#679436',
};

export const DEFAULT_THEME: StoreThemeDto = {
  themeColor: 'blue',
  layout: 'list',
  bannerImageUrl: null,
  bannerPosition: '50% 50%',
};

export async function fetchStoreTheme(storeId: string): Promise<StoreThemeDto> {
  const res = await axiosInstance.get(`/stores/${storeId}/theme`);
  return res.data.data;
}

export async function updateStoreTheme(
  storeId: string,
  data: StoreThemeDto,
): Promise<StoreThemeDto> {
  const res = await axiosInstance.patch(`/stores/${storeId}/theme`, data);
  return res.data.data;
}

export async function uploadBannerImage(storeId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axiosInstance.post(`/stores/${storeId}/theme/banner`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.url;
}
