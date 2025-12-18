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
 * 통합 변환 함수 - wave 추가
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

  console.log('📊 Data type:', { isWave, isWind, isCurrent, width, height });

  let interleavedData, magnitudeData;

  if (isSST) {
    // ⭐ SST 처리 - 스칼라 값만
    const temperature = data.temperature_sea_surface;
    const rearrangedTemp = rearrangeLongitude(temperature, width, height);

    // SST는 벡터가 없으므로 particleImage는 null
    interleavedData = null;
    magnitudeData = rearrangedTemp; // 온도 값 그대로 사용

    console.log('✅ SST data converted');
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

        // ⭐ 높이와 주기를 조합한 "에너지" 개념
        // 긴 주기 + 높은 파고 = 빠른 파티클
        // 짧은 주기 + 낮은 파고 = 느린 파티클
        const energy = Math.sqrt(height * period); // 에너지 근사
        const scaledSpeed = energy * 0.5; // 스케일 조정

        interleavedData[i * 2] = scaledSpeed * Math.sin(radians);
        interleavedData[i * 2 + 1] = scaledSpeed * Math.cos(radians);
        magnitudeData[i] = height;
      } else {
        interleavedData[i * 2] = 0;
        interleavedData[i * 2 + 1] = 0;
        magnitudeData[i] = 0;
      }
    }

    console.log('✅ Wave data converted with height-period energy');
  } else {
    // Wind/Current 처리 (기존 로직)
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

    console.log('✅ Wind/Current data converted');
  }

  const bounds = [-180, -90, 180, 90];

  return {
    particleImage: {
      data: interleavedData,
      width,
      height,
    },
    rasterImage: {
      data: magnitudeData,
      width,
      height,
    },
    bounds,
    metadata: {
      time: meta.time,
      variables: meta.variables,
      width,
      height,
      dataType: isWave ? 'wave' : isWind ? 'wind' : 'current',
    },
  };
}
