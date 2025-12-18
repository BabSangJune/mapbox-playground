// src/entities/weather/model/store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { WEATHER_CONFIGS } from '../config/weatherConfigs';

const initialState = {
  weatherType: 'wind',
  config: WEATHER_CONFIGS,
  weatherData: null,
  airPressureEnabled: false,
  airPressureData: null,
  isLoading: false,
  error: null,
};

export const useWeatherStore = create(
  immer((set) => ({
    ...initialState,

    // Actions
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
