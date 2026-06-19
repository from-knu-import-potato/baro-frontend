import type { DayOfWeek, OperatingHour } from '@/features/initial-setup/types/initialSetup.types';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const toKSTDate = (): Date => new Date(Date.now() + KST_OFFSET_MS);

const formatKSTDate = (date: Date): string => date.toISOString().slice(0, 10);

const KST_DAYS: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const getDayOfWeek = (date: Date): DayOfWeek => KST_DAYS[date.getUTCDay()];

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

/**
 * 오늘 요일의 openTime을 기준으로 영업 날짜(businessDate)를 계산한다.
 * - openTime 이전 → 어제 날짜 반환 (아직 전날 영업 구간)
 * - openTime 이후 또는 openTime 없음(휴무) → 오늘 날짜 반환
 * - 어제가 휴무일이면서 businessDate가 어제로 계산된 경우 → 오늘 날짜로 보정
 */
export const getBusinessDate = (operatingHours: OperatingHour[]): string => {
  const kstNow = toKSTDate();
  const todayDow = getDayOfWeek(kstNow);
  const todayHours = operatingHours.find((h) => h.dayOfWeek === todayDow);

  const openTime = todayHours?.isOpen ? todayHours.openTime : null;

  if (!openTime) {
    // 오늘 휴무 → 캘린더 오늘 날짜 그대로
    return formatKSTDate(kstNow);
  }

  const [openHour, openMinute] = openTime.split(':').map(Number);
  const isBeforeOpen =
    kstNow.getUTCHours() < openHour ||
    (kstNow.getUTCHours() === openHour && kstNow.getUTCMinutes() < openMinute);

  if (!isBeforeOpen) {
    return formatKSTDate(kstNow);
  }

  // 개점 시간 전 → 어제가 영업일인지 확인
  const yesterday = addDays(kstNow, -1);
  const yesterdayDow = getDayOfWeek(yesterday);
  const yesterdayHours = operatingHours.find((h) => h.dayOfWeek === yesterdayDow);

  // 어제도 휴무 → 어제 마감 없음, 오늘 날짜 그대로
  if (!yesterdayHours?.isOpen) {
    return formatKSTDate(kstNow);
  }

  return formatKSTDate(yesterday);
};

/** 오늘 요일이 영업일인지 여부 */
export const isTodayBusinessDay = (operatingHours: OperatingHour[]): boolean => {
  const kstNow = toKSTDate();
  const todayDow = getDayOfWeek(kstNow);
  return operatingHours.find((h) => h.dayOfWeek === todayDow)?.isOpen ?? false;
};

/** 오늘 요일의 개점 시간 (영업일이 아니면 null) */
export const getTodayOpenTime = (operatingHours: OperatingHour[]): string | null => {
  const kstNow = toKSTDate();
  const todayDow = getDayOfWeek(kstNow);
  const todayHours = operatingHours.find((h) => h.dayOfWeek === todayDow);
  return todayHours?.isOpen ? todayHours.openTime : null;
};

/** KST 기준 오늘 날짜 문자열 */
export const todayKSTString = (): string => formatKSTDate(toKSTDate());
