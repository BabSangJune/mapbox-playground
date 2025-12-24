// src/entities/weather/api/cycloneDataQuery.js
import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { convertCycloneData } from '../lib';
import { useWeatherStore } from '../model/store';

import { fetchWeatherData } from './fetchWeatherData';

/**
 * Cyclone 데이터 쿼리 훅
 */
export function useCycloneDataQuery(enabled = false) {
  const { setCycloneData } = useWeatherStore();

  const query = useQuery({
    queryKey: ['weather', 'cyclone'],
    queryFn: () => fetchWeatherData('cyclone'), // ✅ 'cyclone' 파라미터 전달!
    enabled,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (cacheTime → gcTime in v5)
    select: (rawData) => {
      console.log('🔄 Converting cyclone data...', rawData.length);
      return convertCycloneData(rawData);
    },
  });

  // Store 동기화
  useEffect(() => {
    if (query.data) {
      console.log('✅ Cyclone data synced to store:', query.data.length);
      setCycloneData(query.data);
    } else if (!enabled) {
      console.log('⚪ Cyclone disabled, clearing store');
      setCycloneData([]);
    }
  }, [query.data, enabled, setCycloneData]);

  return query;
}
