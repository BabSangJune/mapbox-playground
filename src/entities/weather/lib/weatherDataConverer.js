/**
 * 0-360도 경도 데이터를 -180~180도로 재배열
 * @param {Float32Array|Array} data - 원본 데이터
 * @param {number} width - 경도 방향 픽셀 수
 * @param {number} height - 위도 방향 픽셀 수
 * @returns {Float32Array} 재배열된 데이터
 */
function rearrangeLongitude(data, width, height) {
  const rearranged = new Float32Array(data.length);
  const halfWidth = width / 2; // 360

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = y * width + x;

      // 180도 이후 데이터를 앞으로, 0-180도 데이터를 뒤로
      let dstX;
      if (x < halfWidth) {
        // 0-180도 → 뒤로 (180-360도 위치로)
        dstX = x + halfWidth;
      } else {
        // 180-360도 → 앞으로 (0-180도 위치로)
        dstX = x - halfWidth;
      }

      const dstIdx = y * width + dstX;
      rearranged[dstIdx] = data[srcIdx];
    }
  }

  return rearranged;
}

/**
 * v2-wind-1200.json 형식을 WeatherLayers GL 형식으로 변환
 * @param {Object} rawData - 원본 JSON 데이터
 * @returns {Object} WeatherLayers GL 호환 데이터
 */
export function convertToWeatherLayersFormat(rawData) {
  const { meta, data } = rawData;

  // U, V 컴포넌트 추출
  const uComponent = data.wind_u || data.current_u || [];
  const vComponent = data.wind_v || data.current_v || [];

  const width = meta.coordinate.lon.size; // 720
  const height = meta.coordinate.lat.size; // 361
  const totalPixels = width * height;

  console.log('📊 Data info:', { width, height, totalPixels });

  // 경도 재배열: 0-360 → -180~180
  const rearrangedU = rearrangeLongitude(uComponent, width, height);
  const rearrangedV = rearrangeLongitude(vComponent, width, height);

  console.log('🔄 Longitude rearranged');

  // 1. ParticleLayer용: 인터리브 형식 [u1, v1, u2, v2, ...]
  const interleavedData = new Float32Array(totalPixels * 2);

  // 2. RasterLayer용: 속도(magnitude) 계산
  const magnitudeData = new Float32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const u = rearrangedU[i];
    const v = rearrangedV[i];

    // ParticleLayer용
    interleavedData[i * 2] = u;
    interleavedData[i * 2 + 1] = v;

    // RasterLayer용: magnitude = sqrt(u² + v²)
    magnitudeData[i] = Math.sqrt(u * u + v * v);
  }

  console.log('✅ Data converted');

  // Bounds: -180~180, -90~90
  const bounds = [
    -180, // west
    -90, // south
    180, // east
    90, // north
  ];

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
    },
  };
}
