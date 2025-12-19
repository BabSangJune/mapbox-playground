import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { localDataClient } from '@/shared/api/axios-client';

import { convertToWeatherLayersFormat } from '../lib';
import { useWeatherStore } from '../model/store';

// ===== 내부 API 함수 (export하지 않음) =====
const WEATHER_DATA_URLS = {
  wind: '/weather-data/v2-wind-1200.json',
  current: '/weather-data/v2-current-1200.json',
  wave: '/weather-data/v2-wave-1200.json',
  sst: '/weather-data/v2-sst-1200.json',
  airpressure: '/weather-data/v2-airpressure-1200.json',
};

async function fetchWeatherData(type) {
  const url = WEATHER_DATA_URLS[type];

  if (!url) {
    throw new Error(`Unknown weather type: ${type}`);
  }

  const { data } = await localDataClient.get(url);
  return data;
}

// ===== Public API: Custom Hooks =====

/**
 * 주 날씨 데이터 쿼리 (wind/current/wave/sst)
 */
export function useWeatherDataQuery(weatherType, enabled = true) {
  const { setWeatherData, setLoading, setError } = useWeatherStore();

  const query = useQuery({
    queryKey: ['weather', weatherType],
    queryFn: () => fetchWeatherData(weatherType),
    enabled: enabled && weatherType && weatherType !== 'airpressure',
    staleTime: 5 * 60 * 1000,
    select: (data) => convertToWeatherLayersFormat(data),
  });

  // Zustand 스토어 동기화
  useEffect(() => {
    setLoading(query.isLoading);
    setError(query.error?.message || null);

    if (query.data) {
      setWeatherData(query.data);
    }
  }, [query.isLoading, query.error, query.data, setLoading, setError, setWeatherData]);

  return query;
}

/**
 * Air Pressure 데이터 쿼리
 */
export function useAirPressureQuery(enabled = false) {
  const { setAirPressureData } = useWeatherStore();

  const query = useQuery({
    queryKey: ['weather', 'airpressure'],
    queryFn: () => fetchWeatherData('airpressure'),
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (data) => convertToWeatherLayersFormat(data),
  });

  useEffect(() => {
    if (query.data) {
      setAirPressureData(query.data);
    } else if (!enabled) {
      setAirPressureData(null);
    }
  }, [query.data, enabled, setAirPressureData]);

  return query;
}
