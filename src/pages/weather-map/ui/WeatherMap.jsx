import { DeckGLOverlay } from '@/widgets/deckgl-overlay';
import { MapViewer } from '@/widgets/map-viewer';

import { WeatherVisualization } from '@/features/weather-visualization';

import * as styles from './WeatherMap.css';

export function WeatherMap() {
  return (
    <div className={`weather-map-page ${styles.weatherMapPage}`}>
      <MapViewer
        options={{
          center: [127.0, 37.5],
        }}
      >
        <DeckGLOverlay>
          <WeatherVisualization />
        </DeckGLOverlay>
      </MapViewer>
    </div>
  );
}
