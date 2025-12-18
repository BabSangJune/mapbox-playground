// src/entities/weather/lib/dataConverter.js

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

  console.log('📊 Data info:', { width, height, totalPixels, uLength: uComponent.length });

  // 인터리브 형식으로 변환: [u1, v1, u2, v2, ...]
  const interleavedData = new Float32Array(totalPixels * 2);

  for (let i = 0; i < totalPixels; i++) {
    interleavedData[i * 2] = uComponent[i]; // U component
    interleavedData[i * 2 + 1] = vComponent[i]; // V component
  }

  console.log('✅ Interleaved data created:', interleavedData.length);

  return {
    image: {
      data: interleavedData,
      width,
      height,
    },
    bounds: [
      meta.coordinate.lon.start,
      meta.coordinate.lat.start - meta.coordinate.lat.delta * meta.coordinate.lat.size,
      meta.coordinate.lon.start + meta.coordinate.lon.delta * meta.coordinate.lon.size,
      meta.coordinate.lat.start,
    ],
    metadata: {
      time: meta.time,
      variables: meta.variables,
      width,
      height,
    },
  };
}
