// src/entities/weather/model/converter.js

/**
 * 0-360도 경도 데이터를 -180~180도로 재배열
 */
function rearrangeLongitude(data, width, height) {
  const rearranged = new Float32Array(data.length);
  const halfWidth = width / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = y * width + x;
      let dstX;
      if (x < halfWidth) {
        dstX = x + halfWidth;
      } else {
        dstX = x - halfWidth;
      }
      const dstIdx = y * width + dstX;
      rearranged[dstIdx] = data[srcIdx];
    }
  }

  return rearranged;
}

/**
 * Float32 데이터를 Uint8로 정규화 (0-255 범위)
 */
function normalizeToUint8(data, width, height, min, max) {
  const uint8Data = new Uint8Array(data.length);
  const range = max - min;

  // 1단계: 유효한 값만 변환
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    if (value !== null && !isNaN(value) && value >= min && value <= max) {
      const normalized = (value - min) / range;
      uint8Data[i] = Math.floor(normalized * 255);
    } else {
      uint8Data[i] = 255; // ⭐ 무효값은 255로 (나중에 처리)
    }
  }

  // 2단계: 무효값(255)을 주변 평균으로 채우기
  const filled = new Uint8Array(uint8Data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;

      if (uint8Data[idx] === 255) {
        // 주변 8방향 평균 계산
        let sum = 0;
        let count = 0;

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;

            const ny = y + dy;
            const nx = (x + dx + width) % width; // ⭐ 경도 wrap around

            if (ny >= 0 && ny < height) {
              const nidx = ny * width + nx;
              const nval = uint8Data[nidx];

              if (nval !== 255) {
                sum += nval;
                count++;
              }
            }
          }
        }

        filled[idx] = count > 0 ? Math.floor(sum / count) : 128; // 기본값 128 (중간값)
      }
    }
  }

  return filled;
}

/**
 * 통합 변환 함수 - airpressure 추가
 */
export function convertToWeatherLayersFormat(rawData) {
  const { meta, data } = rawData;

  const width = meta.coordinate.lon.size;
  const height = meta.coordinate.lat.size;
  const totalPixels = width * height;

  // 데이터 타입 자동 감지
  const isSST = data.temperature_sea_surface !== undefined;
  const isWave = data.siginificant_wave_height !== undefined;
  const isWind = data.wind_u !== undefined;
  const isCurrent = data.current_u !== undefined;
  const isAirPressure = data.pressure_msl !== undefined;

  console.log('📊 Data type:', { isSST, isWave, isWind, isCurrent, isAirPressure, width, height });

  let interleavedData, magnitudeData, valueRange;

  if (isSST) {
    const temperature = data.temperature_sea_surface;
    const rearrangedTemp = rearrangeLongitude(temperature, width, height);

    interleavedData = null;
    magnitudeData = rearrangedTemp;
    valueRange = { min: -2, max: 35 }; // SST 범위 (°C)

    console.log('✅ SST data converted');
  } else if (isAirPressure) {
    const pressure = data.pressure_msl;
    const rearrangedPressure = rearrangeLongitude(pressure, width, height);

    const minPressure = 980;
    const maxPressure = 1040;

    // ⭐ width, height 파라미터 추가
    const uint8Pressure = normalizeToUint8(
      rearrangedPressure,
      width,
      height,
      minPressure,
      maxPressure,
    );

    interleavedData = null;
    magnitudeData = uint8Pressure;
    valueRange = { min: minPressure, max: maxPressure };

    console.log('✅ Air Pressure data converted to Uint8');
    console.log('  Sample values:', Array.from(uint8Pressure.slice(0, 20)));

    console.log('✅ Air Pressure data converted to Uint8');
  } else if (isWave) {
    const waveHeight = data.siginificant_wave_height;
    const waveDirection = data.siginificant_wave_direction;
    const wavePeriod = data.siginificant_wave_period;

    const rearrangedHeight = rearrangeLongitude(waveHeight, width, height);
    const rearrangedDirection = rearrangeLongitude(waveDirection, width, height);
    const rearrangedPeriod = rearrangeLongitude(wavePeriod, width, height);

    interleavedData = new Float32Array(totalPixels * 2);
    magnitudeData = new Float32Array(totalPixels);

    for (let i = 0; i < totalPixels; i++) {
      const height = rearrangedHeight[i];
      const direction = rearrangedDirection[i];
      const period = rearrangedPeriod[i];

      if (height > 0 && direction >= 0 && direction <= 360 && period > 0) {
        const radians = (((direction + 180) % 360) * Math.PI) / 180;
        const energy = Math.sqrt(height * period);
        const scaledSpeed = energy * 0.5;

        interleavedData[i * 2] = scaledSpeed * Math.sin(radians);
        interleavedData[i * 2 + 1] = scaledSpeed * Math.cos(radians);
        magnitudeData[i] = height;
      } else {
        interleavedData[i * 2] = 0;
        interleavedData[i * 2 + 1] = 0;
        magnitudeData[i] = 0;
      }
    }

    valueRange = { min: 0, max: 10 }; // Wave height 범위 (m)
    console.log('✅ Wave data converted');
  } else {
    // Wind/Current 처리
    const uComponent = data.wind_u || data.current_u || [];
    const vComponent = data.wind_v || data.current_v || [];

    const rearrangedU = rearrangeLongitude(uComponent, width, height);
    const rearrangedV = rearrangeLongitude(vComponent, width, height);

    interleavedData = new Float32Array(totalPixels * 2);
    magnitudeData = new Float32Array(totalPixels);

    for (let i = 0; i < totalPixels; i++) {
      const u = rearrangedU[i];
      const v = rearrangedV[i];

      interleavedData[i * 2] = u;
      interleavedData[i * 2 + 1] = v;
      magnitudeData[i] = Math.sqrt(u * u + v * v);
    }

    valueRange = isWind ? { min: 0, max: 30 } : { min: 0, max: 3 }; // Wind/Current 범위
    console.log('✅ Wind/Current data converted');
  }

  const bounds = [-180, -90, 180, 90];

  return {
    particleImage: interleavedData
      ? {
          data: interleavedData,
          width,
          height,
        }
      : null,
    rasterImage: {
      data: magnitudeData,
      width,
      height,
    },
    bounds,
    valueRange, // ⭐ 값 범위 추가
    metadata: {
      time: meta.time,
      variables: meta.variables,
      width,
      height,
      dataType: isAirPressure
        ? 'airpressure'
        : isWave
          ? 'wave'
          : isWind
            ? 'wind'
            : isCurrent
              ? 'current'
              : 'sst',
    },
  };
}
