// src/pages/weather-map/ui/WeatherMap.jsx
import { DeckGLOverlay } from '@/widgets/deckgl-overlay';
import { MapViewer } from '@/widgets/map-viewer';

import { MapControls } from '@/features/map-controls';
import {
  WeatherVisualization,
  WeatherTypeSelector,
  CycloneController, // 🆕
} from '@/features/weather-visualization';

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

          <MapControls.BottomRight>
            <CycloneController />
          </MapControls.BottomRight>
        </MapControls>
      </MapViewer>
    </>
  );
}
