export const getKakaoLoginUrl = (callbackUrl: string): string => {
  const base = `${import.meta.env.VITE_API_BASE_URL}/auth/kakao/login`;
  return `${base}?state=${encodeURIComponent(callbackUrl)}`;
};
