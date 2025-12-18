// src/features/weather-visualization/ui/WeatherVisualization.jsx
import { useEffect, useState } from 'react';

import { ParticleLayer, RasterLayer } from 'weatherlayers-gl';

import { deckglModule } from '@/entities/map';
import {
  useWeatherStore,
  fetchWeatherData,
  convertToWeatherLayersFormat,
} from '@/entities/weather';

import { useDeckGL } from '@/shared/lib/context/deckgl-context';

export function WeatherVisualization() {
  const { deckGLOverlay, isLoaded } = useDeckGL();
  const {
    weatherType,
    weatherData,
    config, // 이것만 사용
    setWeatherData,
    setLoading,
    setError,
  } = useWeatherStore();

  const [layers, setLayers] = useState([]);

  // 날씨 데이터 로드
  useEffect(() => {
    if (!isLoaded) return;

    async function loadData() {
      try {
        console.log('📡 Fetching weather data:', weatherType);
        setLoading(true);
        setError(null);

        const rawData = await fetchWeatherData(weatherType);
        const convertedData = convertToWeatherLayersFormat(rawData);

        setWeatherData(convertedData);
      } catch (err) {
        console.error('❌ Failed to load weather data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [weatherType, isLoaded, setWeatherData, setLoading, setError]);

  // WeatherLayers GL 레이어 생성
  useEffect(() => {
    if (!weatherData?.particleImage || !weatherData?.rasterImage) {
      setLayers([]);
      return;
    }

    console.log('🎨 Creating layers for:', weatherType);

    const newLayers = [];

    try {
      // RasterLayer (모든 타입 공통)
      if (config.raster.defaultVisible) {
        const rasterLayer = new RasterLayer({
          id: `${weatherType}-magnitude-raster`,
          image: weatherData.rasterImage,
          bounds: weatherData.bounds,
          palette: config.raster.palette,
          opacity: config.raster.opacity,
          pickable: true,
        });
        newLayers.push(rasterLayer);
      }

      // ParticleLayer (SST는 제외)
      if (config.particle.defaultVisible && weatherData.particleImage) {
        const particleLayer = new ParticleLayer({
          id: `${weatherType}-particles`,
          image: weatherData.particleImage,
          bounds: weatherData.bounds,
          imageType: 'VECTOR',
          numParticles: config.particle.numParticles,
          maxAge: config.particle.maxAge,
          speedFactor: config.particle.speedFactor,
          color: config.particle.color,
          opacity: config.particle.opacity,
          width: config.particle.width,
          pickable: false,
        });
        newLayers.push(particleLayer);
      }

      console.log('✅ Layers created:', newLayers.length);
      setLayers(newLayers);
    } catch (err) {
      console.error('❌ Failed to create layers:', err);
    }
  }, [weatherType, weatherData, config]);

  // deck.gl에 레이어 적용
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
