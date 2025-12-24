// src/entities/weather/api/useWeatherDataQuery.js

import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { convertToWeatherLayersFormat } from '@/entities/weather';

import { useWeatherStore } from '../model/store';

import { fetchWeatherData } from './fetchWeatherData';

/**
 * 주 날씨 데이터 쿼리 (wind/current/wave/sst)
 * ✅ dataType을 명시적으로 전달 → detectDataType 불필요
 */
export function useWeatherDataQuery(weatherType, enabled = true) {
  const { setWeatherData, setLoading, setError } = useWeatherStore();

  const query = useQuery({
    queryKey: ['weather', weatherType],
    queryFn: () => fetchWeatherData(weatherType),
    enabled: enabled && weatherType && weatherType !== 'airpressure',
    staleTime: 5 * 60 * 1000,
    select: (data) => convertToWeatherLayersFormat(data, weatherType), // ✅ dataType 명시
  });

  useEffect(() => {
    setLoading(query.isLoading);
    setError(query.error?.message || null);

    if (query.data) {
      setWeatherData(query.data);
    }
  }, [query.isLoading, query.error, query.data, setLoading, setError, setWeatherData]);

  return query;
}
