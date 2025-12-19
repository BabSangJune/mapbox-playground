import axios from 'axios';

import { CONFIG } from '@/shared/config/environment';

// 기존 API 클라이언트 (외부 API용)
export const axiosClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${CONFIG.API_TOKEN}`,
  },
});

export const localDataClient = axios.create({
  baseURL: '/', // public 폴더 루트
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

localDataClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Weather Data Error:', error.message);
    return Promise.reject(error);
  },
);
