import { useState } from 'react';

import { DeckGLOverlay } from '@/widgets/deckgl-overlay';
import { MapViewer } from '@/widgets/map-viewer';

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
          style: 'mapbox://styles/mapbox/dark-v11',
        }}
      >
        <DeckGLOverlay>
          <WeatherLayer data={weatherData} layerType="scatterplot" />
        </DeckGLOverlay>
      </MapViewer>
    </div>
  );
}
