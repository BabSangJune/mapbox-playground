// src/pages/weather-map/ui/WeatherMapPage.jsx
import { DeckGLOverlay } from '@/widgets/deckgl-overlay';
import { MapViewer } from '@/widgets/map-viewer';

import { MapControls } from '@/features/map-controls';
import { WeatherVisualization, WeatherTypeSelector } from '@/features/weather-visualization';

export function WeatherMap() {
  return (
    <>
      <MapViewer>
        <DeckGLOverlay>
          <WeatherVisualization />
        </DeckGLOverlay>

        <MapControls>
          <MapControls.TopRight>
            <WeatherTypeSelector />
          </MapControls.TopRight>
        </MapControls>
      </MapViewer>
    </>
  );
}
