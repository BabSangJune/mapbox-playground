// src/entities/weather/model/store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { getWeatherConfig } from '../config/weatherConfigs';

const initialState = {
  weatherType: 'wind',
  config: getWeatherConfig('wind'),
  weatherData: null,
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
