// src/entities/weather/model/store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { getWeatherConfig } from '../config/weatherConfigs';

export const useWeatherStore = create(
  immer((set) => ({
    // 현재 선택된 날씨 타입
    weatherType: 'wind',

    // 현재 타입의 config
    config: getWeatherConfig('wind'),

    // 변환된 날씨 데이터
    weatherData: null,

    // 로딩 상태
    isLoading: false,
    error: null,

    // Actions
    setWeatherType: (type) =>
      set((state) => {
        state.weatherType = type;
        state.config = getWeatherConfig(type);
      }),

    setWeatherData: (data) =>
      set((state) => {
        state.weatherData = data;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),
  })),
);
