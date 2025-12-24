// src/entities/weather/model/store.js
import { enableMapSet } from 'immer'; // 🆕 추가
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { WEATHER_CONFIGS } from '../config/weatherConfigs';

// 🆕 Immer MapSet 플러그인 활성화
enableMapSet();

const initialState = {
  weatherType: 'null',
  config: WEATHER_CONFIGS,
  weatherData: null,
  airPressureEnabled: false,
  airPressureData: null,

  // Cyclone 상태
  cycloneData: [],
  visibleCyclones: new Set(),
  selectedCyclone: null,

  isLoading: false,
  error: null,
};

export const useWeatherStore = create(
  immer((set) => ({
    ...initialState,

    setWeatherType: (type) =>
      set((state) => {
        state.weatherType = type;
      }),

    setWeatherData: (data) =>
      set((state) => {
        state.weatherData = data;
      }),

    toggleAirPressure: () =>
      set((state) => ({
        airPressureEnabled: !state.airPressureEnabled,
      })),

    setAirPressureData: (data) => set({ airPressureData: data }),

    // Cyclone Actions
    setCycloneData: (data) =>
      set((state) => {
        state.cycloneData = data;
        state.visibleCyclones = new Set(data.map((c) => c.id));
      }),

    toggleCycloneVisibility: (cycloneId) =>
      set((state) => {
        if (state.visibleCyclones.has(cycloneId)) {
          state.visibleCyclones.delete(cycloneId); // ✅ 이제 작동!
        } else {
          state.visibleCyclones.add(cycloneId);
        }
      }),

    showAllCyclones: () =>
      set((state) => {
        state.visibleCyclones = new Set(state.cycloneData.map((c) => c.id));
      }),

    hideAllCyclones: () =>
      set((state) => {
        state.visibleCyclones.clear(); // ✅ 이제 작동!
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
