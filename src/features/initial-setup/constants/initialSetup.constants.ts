import type {
  BusinessType,
  ChannelKey,
  DayOfWeek,
  IngredientUnit,
  StoreCategory,
} from '@/features/initial-setup/types/initialSetup.types';

export const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: 'franchise', label: '프랜차이즈' },
  { value: 'directly-operated', label: '직영' },
  { value: 'individual', label: '개인' },
];

export const STORE_CATEGORY_OPTIONS: { value: StoreCategory; label: string }[] = [
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'cafe', label: '카페' },
  { value: 'bunsik', label: '분식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' },
  { value: 'fastfood', label: '패스트푸드' },
  { value: 'other', label: '기타' },
];

export const DAY_OF_WEEK_CONFIG: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: '월요일' },
  { value: 'tuesday', label: '화요일' },
  { value: 'wednesday', label: '수요일' },
  { value: 'thursday', label: '목요일' },
  { value: 'friday', label: '금요일' },
  { value: 'saturday', label: '토요일' },
  { value: 'sunday', label: '일요일' },
];

export const INGREDIENT_UNITS: IngredientUnit[] = ['개', '캔', '봉', '팩', '박스', '묶음'];

export const NOTIFICATION_CHANNELS: { key: ChannelKey; label: string }[] = [
  { key: 'email', label: '이메일' },
  { key: 'kakao', label: '카카오톡' },
  { key: 'push', label: '앱 푸시' },
];

export const SETUP_STEPS = [
  { id: 1, title: '가게 기본 정보', description: '가게 이름과 업종을 입력해주세요' },
  { id: 2, title: '영업 시간', description: '영업 요일과 시간을 설정해주세요' },
  { id: 3, title: '메뉴 등록', description: '대표 메뉴와 가격을 입력해주세요' },
  { id: 4, title: '레시피 정보', description: '메뉴별 재료와 사용량을 입력해주세요' },
  { id: 5, title: '주요 식자재', description: '주요 식자재와 최소 재고 기준을 설정해주세요' },
  { id: 6, title: '알림 설정', description: '재고 및 발주 알림을 설정해주세요' },
] as const;
