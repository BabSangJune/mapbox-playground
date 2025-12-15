import { useEffect } from 'react';

import { useDeckGL } from '@/widgets/deckgl-overlay';

import { deckglModule } from '@/entities/map';
import { weatherLayerFactory } from '@/entities/weather';

/**
 * 날씨 데이터를 deck.gl 레이어로 시각화하는 컴포넌트
 * DeckGLOverlay 내부에서 사용되어야 합니다
 * @param {Object} props
 * @param {Array} props.data - 날씨 데이터 배열
 * @param {number} props.data[].longitude - 경도
 * @param {number} props.data[].latitude - 위도
 * @param {number} props.data[].temperature - 온도
 * @param {number} props.data[].windSpeed - 풍속
 * @param {string} props.layerType - 레이어 타입 ('scatterplot' | 'heatmap')
 * @param {Function} props.onHover - 호버 이벤트 핸들러 (선택)
 */
export function WeatherLayer({ data, layerType = 'scatterplot', onHover }) {
  const { deckOverlay, isLoaded } = useDeckGL();

  useEffect(() => {
    if (!deckOverlay || !isLoaded || !data) return;

    // weatherLayerFactory를 사용하여 레이어 생성
    const layers = weatherLayerFactory.createWeatherLayers({
      layerType,
      data,
      onHover,
    });

    // deckglModule을 사용하여 레이어 업데이트
    deckglModule.updateLayers(deckOverlay, layers);

    return () => {
      deckglModule.updateLayers(deckOverlay, []);
    };
  }, [deckOverlay, isLoaded, data, layerType, onHover]);

  return null;
}
