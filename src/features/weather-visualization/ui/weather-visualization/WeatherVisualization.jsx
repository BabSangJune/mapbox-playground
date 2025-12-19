import { useEffect, useState } from 'react';

import { ContourLayer, GridLayer, ParticleLayer, RasterLayer } from 'weatherlayers-gl';

import { deckglModule } from '@/entities/map';
import { useAirPressureQuery, useWeatherDataQuery, useWeatherStore } from '@/entities/weather';

import { useDeckGL } from '@/shared/lib/context/deckgl-context';

export function WeatherVisualization() {
  const { deckGLOverlay, isLoaded } = useDeckGL();
  const { weatherType, weatherData, airPressureEnabled, airPressureData, config } =
    useWeatherStore();

  const [layers, setLayers] = useState([]);

  // ✅ 데이터 페칭 - 단 2줄!
  useWeatherDataQuery(weatherType, isLoaded);
  useAirPressureQuery(airPressureEnabled && isLoaded);

  // 레이어 생성 (기존 로직 유지)
  useEffect(() => {
    if (!config) {
      console.warn('⚠️ Config not loaded yet');
      setLayers([]);
      return;
    }

    const newLayers = [];

    try {
      // 주 날씨 레이어
      if (weatherData?.rasterImage) {
        const weatherConfig = config[weatherType];

        if (!weatherConfig) {
          console.error('❌ No config found for:', weatherType);
          return;
        }

        console.log('🎨 Creating layers for:', weatherType, weatherConfig);

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

      // Air Pressure 레이어
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

        console.log('🌡️ Creating air pressure layers');

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

      console.log('✅ Total layers created:', newLayers.length);
      setLayers(newLayers);
    } catch (err) {
      console.error('❌ Failed to create layers:', err);
    }
  }, [weatherType, weatherData, airPressureEnabled, airPressureData, config]);

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
