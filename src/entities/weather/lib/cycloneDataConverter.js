// src/entities/weather/lib/cycloneDataConverter.js
import {
  getCycloneCategoryColor,
  getCycloneCategoryIcon,
} from '@/entities/weather/config/cycloneConfig';

/**
 * 경로를 180도 경계에서 분할
 */
function splitPathAtAntimeridian(points) {
  const segments = [];
  let currentSegment = [];

  points.forEach((point, i) => {
    if (i === 0) {
      currentSegment.push([point.lon, point.lat]);
      return;
    }

    const prevPoint = points[i - 1];
    const lonDiff = Math.abs(point.lon - prevPoint.lon);

    if (lonDiff > 180) {
      if (currentSegment.length > 1) {
        segments.push(currentSegment);
      }
      currentSegment = [[point.lon, point.lat]];
    } else {
      currentSegment.push([point.lon, point.lat]);
    }
  });

  if (currentSegment.length > 1) {
    segments.push(currentSegment);
  }

  return segments;
}

/**
 * Raw Cyclone 데이터를 deck.gl 레이어용으로 변환
 */
export function convertCycloneData(rawCyclones) {
  if (!Array.isArray(rawCyclones)) {
    console.warn('⚠️ Invalid cyclone data format');
    return [];
  }

  return rawCyclones
    .filter((c) => c.isActive)
    .map((cyclone) => {
      // 현재 위치
      const latestTrack = cyclone.tracks[cyclone.tracks.length - 1];
      const firstForecast = cyclone.datas[0];
      const currentPosition = latestTrack ||
        firstForecast || {
          lat: 0,
          lon: 0,
          windSpeed: 0,
          airPressure: 0,
        };

      // Track 경로 데이터
      const trackPoints = cyclone.tracks.map((t) => ({
        lon: t.lon,
        lat: t.lat,
        windSpeed: t.windSpeed,
        airPressure: t.airPressure,
        time: t.utcTime,
      }));

      // Forecast 경로 데이터
      const forecastPoints = cyclone.datas.map((d) => ({
        lon: d.lon,
        lat: d.lat,
        windSpeed: d.windSpeed,
        airPressure: d.airPressure,
        category: d.cycloneForecastCategory,
        time: d.utcTime,
      }));

      const color = getCycloneCategoryColor(cyclone.cycloneCategory);

      // ✅ 180도 경계 처리된 세그먼트
      const trackSegments = splitPathAtAntimeridian(trackPoints).map((segment) => ({
        path: segment,
        color: color,
      }));

      const forecastSegments = splitPathAtAntimeridian(forecastPoints).map((segment) => ({
        path: segment,
        color: color,
      }));

      // ✅ Error Cone 폴리곤 추출
      const errorConePolygons = [];
      if (cyclone.errorCone) {
        const coords = cyclone.errorCone.coordinates;
        if (cyclone.errorCone.type === 'MultiPolygon') {
          coords.forEach((polygon) => {
            errorConePolygons.push({
              polygon: polygon[0],
              cycloneId: cyclone.cycloneName,
            });
          });
        } else {
          errorConePolygons.push({
            polygon: coords[0],
            cycloneId: cyclone.cycloneName,
          });
        }
      }

      return {
        // 기본 정보
        id: cyclone.cycloneName,
        name: cyclone.cycloneName,
        category: cyclone.cycloneCategory,
        isActive: cyclone.isActive,
        startDate: cyclone.startDate,

        // 시각화 메타데이터
        color: color,
        icon: getCycloneCategoryIcon(cyclone.cycloneCategory),

        // 현재 위치
        currentPosition: {
          lon: currentPosition.lon,
          lat: currentPosition.lat,
          windSpeed: currentPosition.windSpeed,
          airPressure: currentPosition.airPressure,
          time: currentPosition.utcTime || new Date().toISOString(),
        },

        // ✅ 레이어용 전처리된 데이터
        layerData: {
          errorConePolygons, // PolygonLayer용
          trackSegments, // PathLayer용 (이미 분할됨)
          forecastSegments, // PathLayer용 (이미 분할됨)
          position: {
            // ScatterplotLayer, TextLayer용
            coords: [currentPosition.lon, currentPosition.lat],
            color: color,
            name: cyclone.cycloneName,
          },
        },
      };
    });
}
