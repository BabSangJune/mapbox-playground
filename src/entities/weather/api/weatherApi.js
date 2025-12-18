// src/entities/weather/api/weatherApi.js

const WEATHER_DATA_URLS = {
  wind: '/weather-data/v2-wind-1200.json',
  current: '/weather-data/v2-current-1200.json',
  wave: '/weather-data/v2-wave-1200.json',
  sst: '/weather-data/v2-sst-1200.json',
  airpressure: '/weather-data/v2-airpressure-1200.json',
};

/**
 * 날씨 데이터 로드
 * @param {string} type - 'wind' | 'current' | 'wave' | 'sst' | 'airpressure'
 * @returns {Promise<Object>} 원본 날씨 데이터
 */
export async function fetchWeatherData(type) {
  const url = WEATHER_DATA_URLS[type];

  if (!url) {
    throw new Error(`Unknown weather type: ${type}`);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  return response.json();
}
