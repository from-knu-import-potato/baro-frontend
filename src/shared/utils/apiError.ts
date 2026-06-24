import axios from 'axios';

import { API_ERROR_MESSAGES, DEFAULT_ERROR_MESSAGE } from '@/shared/constants/errorMessages';

export const getApiErrorCode = (err: unknown): string | undefined => {
  if (!axios.isAxiosError(err)) return undefined;
  return (err.response?.data as { error?: { code?: string } } | undefined)?.error?.code;
};

export const getApiErrorMessage = (err: unknown, fallback = DEFAULT_ERROR_MESSAGE): string => {
  const code = getApiErrorCode(err);
  return code ? (API_ERROR_MESSAGES[code] ?? fallback) : fallback;
};
