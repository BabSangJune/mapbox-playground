// Shared Config - 전역 설정
export const config = {
  mapbox: {
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
    style: 'mapbox://styles/mapbox/streets-v12',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  },
};
