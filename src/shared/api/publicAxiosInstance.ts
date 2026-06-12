import axios from 'axios';

// 비회원(손님) 요청용 — 인증 인터셉터 없음
const publicAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default publicAxiosInstance;
