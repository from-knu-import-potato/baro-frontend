import axios from 'axios';

import { API_ERROR_MESSAGES, DEFAULT_ERROR_MESSAGE } from '@/shared/constants/errorMessages';

type ApiErrorData = { error?: { code?: string; message?: string } };

export const getApiErrorCode = (err: unknown): string | undefined => {
  if (!axios.isAxiosError(err)) return undefined;
  return (err.response?.data as ApiErrorData | undefined)?.error?.code;
};

const getApiErrorServerMessage = (err: unknown): string | undefined => {
  if (!axios.isAxiosError(err)) return undefined;
  return (err.response?.data as ApiErrorData | undefined)?.error?.message;
};

export const getApiErrorMessage = (err: unknown, fallback = DEFAULT_ERROR_MESSAGE): string => {
  const code = getApiErrorCode(err);
  if (code && API_ERROR_MESSAGES[code]) return API_ERROR_MESSAGES[code];
  const serverMessage = getApiErrorServerMessage(err);
  if (serverMessage) return serverMessage;
  return fallback;
};
