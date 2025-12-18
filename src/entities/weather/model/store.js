// src/entities/weather/model/store.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useWeatherStore = create(
  immer((set) => ({
    // 현재 선택된 날씨 타입
    weatherType: 'wind',

    // 변환된 날씨 데이터
    weatherData: null,

    // 로딩 상태
    isLoading: false,

    // 에러
    error: null,

    // 파티클 설정
    particleCount: 1500,
    particleSpeed: 15,
    particleOpacity: 0.5,

    // Actions
    setWeatherType: (type) =>
      set((state) => {
        state.weatherType = type;
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

    setParticleCount: (count) =>
      set((state) => {
        state.particleCount = count;
      }),

    setParticleSpeed: (speed) =>
      set((state) => {
        state.particleSpeed = speed;
      }),

    setParticleOpacity: (opacity) =>
      set((state) => {
        state.particleOpacity = opacity;
      }),
  })),
);
