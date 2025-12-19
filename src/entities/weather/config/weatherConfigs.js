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
      speedFactor: 20,
      opacity: 0.7,
      width: 1,
      defaultVisible: true,
    },

    // RasterLayer 설정
    raster: {
      opacity: 0.6,
      defaultVisible: true,
      palette: [
        [0, [10, 25, 68]],
        [3.5, [10, 25, 250]],
        [7, [24, 255, 93]],
        [10.5, [255, 233, 102]],
        [14, [255, 233, 15]],
        [17.5, [255, 15, 15]],
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
      maxAge: 30,
      speedFactor: 300,
      opacity: 0.7,
      width: 1.5,
      defaultVisible: true,
    },

    raster: {
      opacity: 0.5,
      defaultVisible: true,
      palette: [
        [0, [10, 25, 68]],
        [0.15, [10, 25, 250]],
        [0.4, [24, 255, 93]],
        [0.65, [255, 233, 102]],
        [1, [255, 233, 15]],
        [1.6, [255, 15, 15]],
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
        [0, [37, 52, 148]],
        [1, [29, 145, 192]],
        [2, [127, 205, 187]],
        [3, [237, 248, 177]],
        [4, [247, 132, 62]],
        [5, [240, 59, 32]],
        [6, [215, 30, 35]],
        [7, [189, 0, 38]],
        [8, [165, 0, 33]],
        [9, [222, 0, 38]],
        [10, [255, 0, 38]],
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
        [0, [10, 25, 68]],
        [5.6, [10, 25, 250]],
        [11.2, [24, 255, 93]],
        [16.8, [255, 233, 102]],
        [22.4, [255, 233, 15]],
        [28, [255, 15, 15]],
      ],
    },

    legend: {
      title: 'Sea Surface Temperature',
      unit: '°C',
      steps: [-2, 0, 5, 10, 15, 20, 25, 30, 35],
    },
  },

  airpressure: {
    dataFile: 'v2-airpressure-1200.json',
    variable: 'pressure_msl',
    // minPressure: 980,
    // maxPressure: 1040,

    contour: {
      defaultVisible: true,
      lineWidth: 2,
      colors: [
        { value: 980, color: [0, 0, 139, 255] }, // 매우 낮음
        { value: 992, color: [30, 144, 255, 255] }, // 낮음
        { value: 1000, color: [100, 150, 255, 200] }, // 약간 낮음
        { value: 1013, color: [200, 200, 200, 150] }, // 표준 기압
        { value: 1020, color: [255, 200, 100, 200] }, // 약간 높음
        { value: 1028, color: [255, 100, 0, 255] }, // 높음
        { value: 1040, color: [200, 0, 0, 255] }, // 매우 높음
      ],
    },

    grid: {
      defaultVisible: true,
      gridSize: 5, // 5도 간격
      fontSize: 12, // 폰트 크기
      fontColor: [255, 255, 255, 255], // 흰색
      fontOutlineColor: [0, 0, 0, 200], // 검정 외곽선
      fontOutlineWidth: 2,
      textAnchor: 'middle',
      textAlignmentBaseline: 'center',
      decimals: 0, // 소수점 없음
      unitSymbol: '', // 단위 없음
    },

    legend: {
      title: 'Air Pressure',
      unit: 'hPa',
    },
  },
};

/**
 * 날씨 타입별 기본 설정 가져오기
 */
export function getWeatherConfig(weatherType) {
  return WEATHER_CONFIGS[weatherType] || WEATHER_CONFIGS.wind;
}
