// src/features/weather-visualization/ui/weather-visualization/WeatherVisualization.jsx
import { useEffect, useState, useMemo } from 'react';

import { PathLayer, PolygonLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { ContourLayer, GridLayer, ParticleLayer, RasterLayer } from 'weatherlayers-gl';

import { deckglModule } from '@/entities/map';
import {
  useAirPressureQuery,
  useWeatherDataQuery,
  useCycloneDataQuery,
  useWeatherStore,
} from '@/entities/weather';

import { useDeckGL } from '@/shared/lib/context/deckgl-context';

export function WeatherVisualization() {
  const { deckGLOverlay, isLoaded } = useDeckGL();
  const {
    weatherType,
    weatherData,
    airPressureEnabled,
    airPressureData,
    cycloneData,
    visibleCyclones,
    config,
  } = useWeatherStore();

  const [layers, setLayers] = useState([]);

  // ✅ 데이터 페칭
  useWeatherDataQuery(weatherType, isLoaded);
  useAirPressureQuery(airPressureEnabled && isLoaded);
  useCycloneDataQuery(isLoaded);

  // ✅ 보이는 Cyclone만 필터링 (단순 필터만)
  const visibleCycloneData = useMemo(() => {
    if (!cycloneData || cycloneData.length === 0) return [];
    return cycloneData.filter((c) => visibleCyclones.has(c.id));
  }, [cycloneData, visibleCyclones]);

  // ✅ 레이어용 데이터 병합 (단순 flatMap만)
  const cycloneLayerData = useMemo(() => {
    if (visibleCycloneData.length === 0) return null;

    console.log('visibleCycloneData', visibleCycloneData);

    return {
      errorConePolygons: visibleCycloneData.flatMap((c) => c.layerData.errorConePolygons),
      trackSegments: visibleCycloneData.flatMap((c) => c.layerData.trackSegments),
      forecastSegments: visibleCycloneData.flatMap((c) => c.layerData.forecastSegments),
      positions: visibleCycloneData.map((c) => c.layerData.position),
    };
  }, [visibleCycloneData]);

  // 레이어 생성
  useEffect(() => {
    if (!config) {
      console.warn('⚠️ Config not loaded yet');
      setLayers([]);
      return;
    }

    const newLayers = [];

    try {
      // === 주 날씨 레이어 (Wind/Current/Wave/SST) ===
      if (weatherData?.rasterImage) {
        const weatherConfig = config[weatherType];
        if (!weatherConfig) {
          console.error('❌ No config found for:', weatherType);
          return;
        }

        if (weatherConfig.raster?.defaultVisible) {
          newLayers.push(
            new RasterLayer({
              id: `${weatherType}-magnitude-raster`,
              image: weatherData.rasterImage,
              bounds: weatherData.bounds,
              palette: weatherConfig.raster.palette,
              opacity: weatherConfig.raster.opacity,
              pickable: true,
              imageSmoothing: 0,
              imageInterpolation: 'LINEAR',
              beforeId: `weather-empty-layer`,
            }),
          );
        }

        if (weatherConfig.particle?.defaultVisible && weatherData.particleImage) {
          newLayers.push(
            new ParticleLayer({
              id: `${weatherType}-particles`,
              image: weatherData.particleImage,
              bounds: weatherData.bounds,
              imageType: 'VECTOR',
              numParticles: weatherConfig.particle.numParticles,
              maxAge: weatherConfig.particle.maxAge,
              speedFactor: weatherConfig.particle.speedFactor,
              color: weatherConfig.particle.color,
              opacity: weatherConfig.particle.opacity,
              width: weatherConfig.particle.width,
              pickable: false,
              imageSmoothing: 1,
              imageInterpolation: 'LINEAR',
              beforeId: `weather-empty-layer`,
            }),
          );
        }
      }

      // === Air Pressure 레이어 ===
      if (airPressureEnabled && airPressureData?.rasterImage) {
        const pressureConfig = config.airpressure;
        if (!pressureConfig) {
          console.error('❌ No airpressure config found');
          return;
        }

        const { min, max } = airPressureData.valueRange || {
          min: pressureConfig.minPressure,
          max: pressureConfig.maxPressure,
        };

        if (pressureConfig.contour?.defaultVisible && airPressureData.contourImage) {
          newLayers.push(
            new ContourLayer({
              id: 'air-pressure-contour',
              image: airPressureData.contourImage,
              bounds: airPressureData.bounds,
              imageSmoothing: 3,
              imageUnscale: [min, max],
              interval: 4,
              majorInterval: 8,
              contourColor: [255, 255, 255, 200],
              majorContourColor: [255, 255, 255, 255],
              strokeWidth: 1.5,
              majorStrokeWidth: 2.5,
              opacity: 0.8,
              pickable: true,
              updateTriggers: {
                image: airPressureData.contourImage.data,
              },
            }),
          );
        }

        if (pressureConfig.grid?.defaultVisible) {
          newLayers.push(
            new GridLayer({
              id: 'air-pressure-grid',
              image: airPressureData.rasterImage,
              bounds: airPressureData.bounds,
              density: 0,
              textSize: 10,
              textColor: [255, 255, 255, 255],
              textOutlineWidth: 1,
              textOutlineColor: [255, 255, 255, 255],
              opacity: 1.0,
              pickable: false,
              updateTriggers: {
                image: airPressureData.rasterImage.data,
              },
            }),
          );
        }
      }

      // 🆕 === Cyclone 레이어 (초간단) ===
      if (cycloneLayerData) {
        console.log('🌀 Creating cyclone layers');

        // 1. Error Cones
        if (cycloneLayerData.errorConePolygons.length > 0) {
          newLayers.push(
            new PolygonLayer({
              id: 'cyclone-error-cones',
              data: cycloneLayerData.errorConePolygons,
              getPolygon: (d) => d.polygon,
              getFillColor: [255, 200, 0, 50],
              getLineColor: [255, 200, 0, 150],
              lineWidthMinPixels: 2,
              pickable: true,
            }),
          );
        }

        // 2. Track Paths
        if (cycloneLayerData.trackSegments.length > 0) {
          newLayers.push(
            new PathLayer({
              id: 'cyclone-tracks',
              data: cycloneLayerData.trackSegments,
              getPath: (d) => d.path,
              getColor: (d) => d.color,
              getWidth: 3,
              widthMinPixels: 2,
              pickable: true,
            }),
          );
        }

        // 3. Forecast Paths
        if (cycloneLayerData.forecastSegments.length > 0) {
          newLayers.push(
            new PathLayer({
              id: 'cyclone-forecasts',
              data: cycloneLayerData.forecastSegments,
              getPath: (d) => d.path,
              getColor: (d) => d.color,
              getWidth: 2,
              widthMinPixels: 2,
              getDashArray: [10, 5],
              dashJustified: true,
              pickable: true,
            }),
          );
        }

        // 4. Current Positions
        newLayers.push(
          new ScatterplotLayer({
            id: 'cyclone-current-positions',
            data: cycloneLayerData.positions,
            getPosition: (d) => d.coords,
            getRadius: 20000,
            getFillColor: (d) => d.color,
            getLineColor: [255, 255, 255],
            lineWidthMinPixels: 2,
            pickable: true,
          }),
        );

        // 5. Labels
        newLayers.push(
          new TextLayer({
            id: 'cyclone-labels',
            data: cycloneLayerData.positions,
            getPosition: (d) => [d.coords[0], d.coords[1] + 0.5],
            getText: (d) => d.name,
            getSize: 14,
            getColor: [255, 255, 255, 255],
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            outlineColor: [0, 0, 0, 200],
            outlineWidth: 2,
            pickable: false,
          }),
        );
      }

      console.log('✅ Total layers created:', newLayers.length);
      setLayers(newLayers);
    } catch (err) {
      console.error('❌ Failed to create layers:', err);
    }
  }, [weatherType, weatherData, airPressureEnabled, airPressureData, cycloneLayerData, config]);

  // deck.gl 레이어 적용
  useEffect(() => {
    if (!deckGLOverlay?.current || !isLoaded) {
      return;
    }

    console.log('🎯 Updating layers:', layers.length);
    deckglModule.updateLayers(deckGLOverlay, layers);

    return () => {
      deckglModule.updateLayers(deckGLOverlay, []);
    };
  }, [deckGLOverlay, isLoaded, layers]);

  return null;
}
