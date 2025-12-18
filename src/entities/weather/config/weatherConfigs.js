// src/entities/weather/config/weatherConfigs.js

/**
 * 날씨 타입별 시각화 설정
 */
export const WEATHER_CONFIGS = {
  wind: {
    // 데이터 설정
    dataFile: 'v2-wind-1200.json',
    // maxValue: 30, // m/s

    // ParticleLayer 설정
    particle: {
      color: [255, 255, 255],
      numParticles: 2000,
      maxAge: 20,
      speedFactor: 5,
      opacity: 0.7,
      width: 1,
      defaultVisible: true,
    },

    // RasterLayer 설정
    raster: {
      opacity: 0.6,
      defaultVisible: true,
      palette: [
        [0, [30, 144, 255, 0]], // 0 m/s: 투명 파란색
        [5, [135, 206, 250, 150]], // 5 m/s: 하늘색
        [10, [50, 205, 50, 180]], // 10 m/s: 연두색
        [15, [255, 255, 0, 200]], // 15 m/s: 노란색
        [20, [255, 165, 0, 220]], // 20 m/s: 주황색
        [25, [255, 69, 0, 240]], // 25 m/s: 빨간색
        [30, [139, 0, 0, 255]], // 30+ m/s: 진한 빨간색
      ],
    },

    // 범례 정보
    legend: {
      title: 'Wind Speed',
      unit: 'm/s',
      steps: [0, 5, 10, 15, 20, 25, 30],
    },
  },

  current: {
    dataFile: 'v2-current-1200.json',
    // maxValue: 2, // m/s
    particle: {
      color: [255, 255, 255],
      numParticles: 2000,
      maxAge: 10,
      speedFactor: 100,
      opacity: 0.7,
      width: 1.5,
      defaultVisible: true,
    },

    raster: {
      opacity: 0.5,
      defaultVisible: true,
      palette: [
        [0, [30, 144, 255, 0]], // 0 m/s: 투명
        [0.2, [135, 206, 250, 150]], // 0.2 m/s
        [0.4, [50, 205, 50, 180]], // 0.4 m/s
        [0.6, [255, 255, 0, 200]], // 0.6 m/s
        [0.8, [255, 165, 0, 220]], // 0.8 m/s
        [1.0, [255, 69, 0, 240]], // 1.0 m/s
        [1.5, [139, 0, 0, 255]], // 1.5+ m/s
      ],
    },

    legend: {
      title: 'Current Speed',
      unit: 'm/s',
      steps: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.5],
    },
  },

  wave: {
    dataFile: 'v2-wave-1200.json',
    // maxValue: 8, // m (파고)

    particle: {
      color: [255, 255, 255],
      numParticles: 1500,
      maxAge: 10,
      speedFactor: 15,
      opacity: 0.6,
      width: 5,
      defaultVisible: true,
    },

    raster: {
      opacity: 0.7,
      defaultVisible: true,
      palette: [
        [0, [30, 144, 255, 0]], // 0 m: 투명
        [1, [135, 206, 250, 150]], // 1 m
        [2, [50, 205, 50, 180]], // 2 m
        [3, [255, 255, 0, 200]], // 3 m
        [4, [255, 165, 0, 220]], // 4 m
        [5, [255, 69, 0, 240]], // 5 m
        [6, [139, 0, 0, 255]], // 6+ m
      ],
    },

    legend: {
      title: 'Wave Height',
      unit: 'm',
      steps: [0, 1, 2, 3, 4, 5, 6],
    },
  },

  sst: {
    dataFile: 'v2-sst-1200.json',

    particle: {
      defaultVisible: false, // SST는 파티클 없음
    },

    raster: {
      opacity: 0.7,
      defaultVisible: true,
      palette: [
        [-2, [0, 0, 139, 200]], // -2°C: 진한 파란색 (극지방)
        [0, [30, 144, 255, 200]], // 0°C: 파란색
        [5, [0, 191, 255, 200]], // 5°C: 하늘색
        [10, [64, 224, 208, 200]], // 10°C: 청록색
        [15, [0, 255, 127, 200]], // 15°C: 초록색
        [20, [255, 255, 0, 200]], // 20°C: 노란색
        [25, [255, 165, 0, 200]], // 25°C: 주황색
        [30, [255, 69, 0, 200]], // 30°C: 빨간색
        [35, [139, 0, 0, 220]], // 35°C: 진한 빨간색 (열대)
      ],
    },

    legend: {
      title: 'Sea Surface Temperature',
      unit: '°C',
      steps: [-2, 0, 5, 10, 15, 20, 25, 30, 35],
    },
  },
};

/**
 * 날씨 타입별 기본 설정 가져오기
 */
export function getWeatherConfig(weatherType) {
  return WEATHER_CONFIGS[weatherType] || WEATHER_CONFIGS.wind;
}
