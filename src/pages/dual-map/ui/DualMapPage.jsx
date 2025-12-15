import { useState } from 'react';

import { DeckGLOverlay } from '@/widgets/deckgl-overlay';
import { MapViewer } from '@/widgets/map-viewer';

import { WeatherLayer } from '@/features/weather-layer';

import * as styles from './DualMapPage.css';

export function DualMapPage() {
  // 서울 날씨 데이터
  const [seoulWeather] = useState([
    { longitude: 126.978, latitude: 37.5665, temperature: 25, windSpeed: 5 },
    { longitude: 127.0, latitude: 37.6, temperature: 22, windSpeed: 8 },
    { longitude: 126.95, latitude: 37.55, temperature: 28, windSpeed: 3 },
    { longitude: 127.05, latitude: 37.58, temperature: 20, windSpeed: 10 },
    { longitude: 126.92, latitude: 37.52, temperature: 26, windSpeed: 6 },
  ]);

  // 부산 날씨 데이터
  const [busanWeather] = useState([
    { longitude: 129.075, latitude: 35.1796, temperature: 28, windSpeed: 3 },
    { longitude: 129.1, latitude: 35.2, temperature: 26, windSpeed: 6 },
    { longitude: 129.05, latitude: 35.15, temperature: 30, windSpeed: 2 },
    { longitude: 129.12, latitude: 35.22, temperature: 24, windSpeed: 8 },
    { longitude: 129.08, latitude: 35.18, temperature: 27, windSpeed: 4 },
  ]);

  return (
    <div className={`dual-map-page ${styles.dualMapPage}`}>
      {/* 서울 지도 */}
      <div className={`dual-map-page__map-container ${styles.dualMapPageMapContainer}`}>
        <h3 className={`dual-map-page__map-title ${styles.dualMapPageMapTitle}`}>서울 날씨</h3>
        <MapViewer
          options={{
            center: [126.978, 37.5665],
            zoom: 11,
          }}
        >
          <DeckGLOverlay>
            <WeatherLayer data={seoulWeather} layerType="scatterplot" />
          </DeckGLOverlay>
        </MapViewer>
      </div>

      {/* 부산 지도 */}
      <div className={`dual-map-page__map-container ${styles.dualMapPageMapContainer}`}>
        <h3 className={`dual-map-page__map-title ${styles.dualMapPageMapTitle}`}>부산 날씨</h3>
        <MapViewer
          options={{
            center: [129.075, 35.1796],
            zoom: 11,
          }}
        >
          <DeckGLOverlay>
            <WeatherLayer data={busanWeather} layerType="scatterplot" />
          </DeckGLOverlay>
        </MapViewer>
      </div>
    </div>
  );
}
