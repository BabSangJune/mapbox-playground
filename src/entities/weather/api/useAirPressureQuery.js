// src/entities/weather/api/useAirPressureQuery.js

import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { convertToWeatherLayersFormat } from '@/entities/weather';

import { useWeatherStore } from '../model/store';

import { fetchWeatherData } from './fetchWeatherData';

/**
 * Air Pressure 데이터 쿼리
 * ✅ dataType을 명시적으로 전달
 */
export function useAirPressureQuery(enabled = false) {
  const { setAirPressureData } = useWeatherStore();

  const query = useQuery({
    queryKey: ['weather', 'airpressure'],
    queryFn: () => fetchWeatherData('airpressure'),
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (data) => convertToWeatherLayersFormat(data, 'airpressure'), // ✅ dataType 명시
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
