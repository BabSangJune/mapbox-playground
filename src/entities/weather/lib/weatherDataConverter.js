// src/entities/weather/model/converter.js

// ============================================================================
// 상수 정의
// ============================================================================

const VALUE_RANGES = {
  sst: { min: -2, max: 35 },
  airpressure: { min: 900, max: 1040 },
  wave: { min: 0, max: 10 },
  wind: { min: 0, max: 30 },
  current: { min: 0, max: 3 },
};

// ============================================================================
// 성능 최적화: Sin/Cos 테이블 (Wave 전용)
// ============================================================================

let sinCosCache = null;

function getSinCosLookup() {
  if (!sinCosCache) {
    sinCosCache = new Array(361);
    for (let angle = 0; angle <= 360; angle++) {
      const radians = (((angle + 180) % 360) * Math.PI) / 180;
      sinCosCache[angle] = {
        sin: Math.sin(radians),
        cos: Math.cos(radians),
      };
    }
  }
  return sinCosCache;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 0-360도 경도 데이터를 -180~180도로 재배열
 */
function rearrangeLongitude(data, width, height) {
  const rearranged = new Float32Array(data.length);
  const halfWidth = width >> 1;

  for (let i = 0; i < data.length; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const dstX = x < halfWidth ? x + halfWidth : x - halfWidth;
    rearranged[y * width + dstX] = data[i];
  }

  return rearranged;
}

/**
 * Float32 데이터를 Uint8로 정규화 (0-255 범위)
 */
function normalizeToUint8(data, width, height, min, max) {
  const len = data.length;
  const uint8Data = new Uint8Array(len);
  const mask = new Uint8Array(len);
  const range = max - min;

  if (range <= 0) return uint8Data;

  // 1단계: 유효한 값만 정규화
  for (let i = 0; i < len; i++) {
    const value = data[i];
    if (value !== null && !Number.isNaN(value) && value >= min && value <= max) {
      uint8Data[i] = Math.floor(((value - min) / range) * 255);
      mask[i] = 1;
    } else {
      uint8Data[i] = 128;
    }
  }

  // 2단계: 무효값을 주변 유효값의 평균으로 보간
  const offsets = [-width - 1, -width, -width + 1, -1, 1, width - 1, width, width + 1];

  for (let i = 0; i < len; i++) {
    if (mask[i]) continue;

    const y = Math.floor(i / width);
    const x = i % width;
    let sum = 0;
    let count = 0;

    for (const offset of offsets) {
      const ni = i + offset;
      const nx = ni % width;
      const ny = Math.floor(ni / width);

      // 경계 체크: y 범위와 x 연속성
      if (ny >= 0 && ny < height && Math.abs(nx - x) <= 1 && mask[ni]) {
        sum += uint8Data[ni];
        count++;
      }
    }

    if (count > 0) {
      uint8Data[i] = Math.floor(sum / count);
    }
  }

  return uint8Data;
}

// ============================================================================
// 데이터 타입별 변환 함수
// ============================================================================

function convertSST(meta, data, width, height) {
  const rearrangedTemp = rearrangeLongitude(data.temperature_sea_surface, width, height);

  return {
    particleImage: null,
    rasterImage: { data: rearrangedTemp, width, height },
    contourImage: null,
    valueRange: VALUE_RANGES.sst,
    dataType: 'sst',
  };
}

function convertAirPressure(meta, data, width, height) {
  const rearrangedPressure = rearrangeLongitude(data.pressure_msl, width, height);
  const uint8Pressure = normalizeToUint8(
    rearrangedPressure,
    width,
    height,
    VALUE_RANGES.airpressure.min,
    VALUE_RANGES.airpressure.max,
  );

  return {
    particleImage: null,
    rasterImage: { data: rearrangedPressure, width, height },
    contourImage: { data: uint8Pressure, width, height },
    valueRange: VALUE_RANGES.airpressure,
    dataType: 'airpressure',
  };
}

function convertWave(meta, data, width, height) {
  const rearrangedHeight = rearrangeLongitude(data.siginificant_wave_height, width, height);
  const rearrangedDirection = rearrangeLongitude(data.siginificant_wave_direction, width, height);
  const rearrangedPeriod = rearrangeLongitude(data.siginificant_wave_period, width, height);

  const totalPixels = width * height;
  const interleavedData = new Float32Array(totalPixels * 2);
  const magnitudeData = new Float32Array(totalPixels);
  const sinCosLookup = getSinCosLookup();

  for (let i = 0; i < totalPixels; i++) {
    const h = rearrangedHeight[i];
    const d = rearrangedDirection[i];
    const p = rearrangedPeriod[i];

    // 유효성 검사를 하나로 통합
    if (h > 0 && d >= 0 && d <= 360 && p > 0) {
      const { sin, cos } = sinCosLookup[Math.round(d) % 361];
      const scaledSpeed = Math.sqrt(h * p) * 0.5;

      interleavedData[i * 2] = scaledSpeed * sin;
      interleavedData[i * 2 + 1] = scaledSpeed * cos;
      magnitudeData[i] = h;
    }
    // else는 Float32Array가 이미 0으로 초기화되어 있어서 불필요
  }

  return {
    particleImage: { data: interleavedData, width, height },
    rasterImage: { data: magnitudeData, width, height },
    contourImage: null,
    valueRange: VALUE_RANGES.wave,
    dataType: 'wave',
  };
}

function convertWindOrCurrent(meta, data, width, height, dataType) {
  const uComponent = data[`${dataType}_u`];
  const vComponent = data[`${dataType}_v`];

  const totalPixels = width * height;

  if (!uComponent || !vComponent) {
    return {
      particleImage: null,
      rasterImage: { data: new Float32Array(totalPixels), width, height },
      contourImage: null,
      valueRange: VALUE_RANGES[dataType],
      dataType,
    };
  }

  const rearrangedU = rearrangeLongitude(uComponent, width, height);
  const rearrangedV = rearrangeLongitude(vComponent, width, height);

  const interleavedData = new Float32Array(totalPixels * 2);
  const magnitudeData = new Float32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const u = rearrangedU[i];
    const v = rearrangedV[i];

    interleavedData[i * 2] = u;
    interleavedData[i * 2 + 1] = v;
    magnitudeData[i] = Math.sqrt(u * u + v * v);
    // magnitudeData[i] = Math.hypot(u, v);
  }

  return {
    particleImage: { data: interleavedData, width, height },
    rasterImage: { data: magnitudeData, width, height },
    contourImage: null,
    valueRange: VALUE_RANGES[dataType],
    dataType,
  };
}

// ============================================================================
// 메인 변환 함수
// ============================================================================

export function convertToWeatherLayersFormat(rawData, weatherType) {
  const { meta, data } = rawData;
  const width = meta.coordinate.lon.size;
  const height = meta.coordinate.lat.size;

  let result;

  switch (weatherType) {
    case 'sst':
      result = convertSST(meta, data, width, height);
      break;
    case 'airpressure':
      result = convertAirPressure(meta, data, width, height);
      break;
    case 'wave':
      result = convertWave(meta, data, width, height);
      break;
    case 'wind':
      result = convertWindOrCurrent(meta, data, width, height, 'wind');
      break;
    case 'current':
      result = convertWindOrCurrent(meta, data, width, height, 'current');
      break;
    default:
      result = convertSST(meta, data, width, height);
  }

  return {
    ...result,
    bounds: [-180, -90, 180, 90],
    metadata: {
      time: meta.time,
      variables: meta.variables,
      width,
      height,
      dataType: result.dataType,
    },
  };
}
