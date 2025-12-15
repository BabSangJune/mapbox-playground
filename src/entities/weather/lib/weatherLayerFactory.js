import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';

/**
 * 날씨 데이터를 시각화하기 위한 deck.gl 레이어를 생성하는 팩토리 함수들
 */
export const weatherLayerFactory = {
  /**
   * ScatterplotLayer를 생성합니다 (개별 포인트 시각화)
   * @param {Object} options
   * @param {Array} options.data - 날씨 데이터 배열
   * @param {string} options.id - 레이어 ID
   * @param {Function} options.onHover - 호버 이벤트 핸들러
   * @returns {ScatterplotLayer}
   */
  createScatterplotLayer({ data, id = 'weather-scatterplot', onHover }) {
    return new ScatterplotLayer({
      id,
      data,
      getPosition: (d) => [d.longitude, d.latitude],
      getRadius: (d) => d.windSpeed * 100,
      getFillColor: (d) => [255, (1 - d.temperature / 40) * 255, 0],
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 100,
      onHover:
        onHover ||
        ((info) => {
          if (info.object) {
            console.log('Weather data:', info.object);
          }
        }),
    });
  },

  /**
   * HeatmapLayer를 생성합니다 (히트맵 시각화)
   * @param {Object} options
   * @param {Array} options.data - 날씨 데이터 배열
   * @param {string} options.id - 레이어 ID
   * @param {number} options.intensity - 히트맵 강도 (기본값: 1)
   * @param {number} options.radiusPixels - 반경 픽셀 (기본값: 60)
   * @returns {HeatmapLayer}
   */
  createHeatmapLayer({ data, id = 'weather-heatmap', intensity = 1, radiusPixels = 60 }) {
    return new HeatmapLayer({
      id,
      data,
      getPosition: (d) => [d.longitude, d.latitude],
      getWeight: (d) => d.temperature,
      radiusPixels,
      intensity,
      threshold: 0.05,
      aggregation: 'SUM',
    });
  },

  /**
   * 레이어 타입에 따라 적절한 레이어를 생성합니다
   * @param {Object} options
   * @param {string} options.layerType - 레이어 타입 ('scatterplot' | 'heatmap')
   * @param {Array} options.data - 날씨 데이터 배열
   * @param {string} options.id - 레이어 ID (선택)
   * @param {Function} options.onHover - 호버 이벤트 핸들러 (선택)
   * @returns {Array} deck.gl 레이어 배열
   */
  createWeatherLayers({ layerType = 'scatterplot', data, id, onHover }) {
    const layers = [];

    if (layerType === 'scatterplot') {
      layers.push(this.createScatterplotLayer({ data, id, onHover }));
    } else if (layerType === 'heatmap') {
      layers.push(this.createHeatmapLayer({ data, id }));
    }

    return layers;
  },
};
