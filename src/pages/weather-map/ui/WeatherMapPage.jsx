import { useState } from 'react';

import { DeckGLOverlay } from '@/widgets/deckgl-overlay';
import { MapViewer } from '@/widgets/map-viewer';

import { MapControls } from '@/features/map-controls';
import { WeatherLayer } from '@/features/weather-layer';

import * as styles from './WeatherMapPage.css';

export function WeatherMapPage() {
  // 샘플 날씨 데이터
  const [weatherData] = useState([
    { longitude: 126.978, latitude: 37.5665, temperature: 25, windSpeed: 5 },
    { longitude: 127.0, latitude: 37.6, temperature: 22, windSpeed: 8 },
    { longitude: 126.95, latitude: 37.55, temperature: 28, windSpeed: 3 },
    { longitude: 127.05, latitude: 37.58, temperature: 20, windSpeed: 10 },
    { longitude: 126.92, latitude: 37.52, temperature: 26, windSpeed: 6 },
  ]);

  return (
    <div className={`weather-map-page ${styles.weatherMapPage}`}>
      <MapViewer
        options={{
          center: [126.978, 37.5665],
          zoom: 11,
        }}
      >
        <DeckGLOverlay>
          <WeatherLayer data={weatherData} layerType="scatterplot" />
        </DeckGLOverlay>
        <MapControls>
          <MapControls.TopLeft>
            <button
              className={`weather-map-page__control-button ${styles.weatherMapPageControlButton}`}
              onClick={() => console.log('좌상단 버튼 클릭')}
            >
              줌 인
            </button>
          </MapControls.TopLeft>
          <MapControls.TopRight>
            <button
              className={`weather-map-page__control-button ${styles.weatherMapPageControlButton}`}
              onClick={() => console.log('우상단 버튼 1 클릭')}
            >
              레이어
            </button>
            <button
              className={`weather-map-page__control-button ${styles.weatherMapPageControlButton}`}
              onClick={() => console.log('우상단 버튼 2 클릭')}
            >
              설정
            </button>
          </MapControls.TopRight>
          <MapControls.Bottom>
            <div className={`weather-map-page__info-box ${styles.weatherMapPageInfoBox}`}>
              서울 날씨 데이터 표시 중
            </div>
          </MapControls.Bottom>
        </MapControls>
      </MapViewer>
    </div>
  );
}
