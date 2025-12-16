import axios from 'axios';

import { CONFIG } from '@/shared/config/environment';

export const axiosClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${CONFIG.API_TOKEN}`,
  },
});
