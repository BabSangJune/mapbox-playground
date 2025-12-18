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
    particleCount,
    particleSpeed,
    particleOpacity,
    particleVisible,
    rasterVisible,
    rasterOpacity,
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
        console.log('✅ Raw data loaded');

        const convertedData = convertToWeatherLayersFormat(rawData);
        console.log('✅ Data converted');

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

    console.log('🎨 Creating layers');

    const newLayers = [];

    try {
      // 1. RasterLayer - 바람 강도 색상 표현
      if (rasterVisible) {
        const rasterLayer = new RasterLayer({
          id: 'wind-magnitude-raster',
          image: weatherData.rasterImage,
          bounds: weatherData.bounds,
          palette: [
            [0, [30, 144, 255, 0]], // 0 m/s: 투명 파란색
            [5, [135, 206, 250, 150]], // 5 m/s: 하늘색
            [10, [50, 205, 50, 180]], // 10 m/s: 연두색
            [15, [255, 255, 0, 200]], // 15 m/s: 노란색
            [20, [255, 165, 0, 220]], // 20 m/s: 주황색
            [25, [255, 69, 0, 240]], // 25 m/s: 빨간색
            [30, [139, 0, 0, 255]], // 30+ m/s: 진한 빨간색
          ],
          opacity: rasterOpacity,
          pickable: true,
        });
        newLayers.push(rasterLayer);
      }

      // 2. ParticleLayer - 바람 방향 파티클 애니메이션
      if (particleVisible) {
        const particleLayer = new ParticleLayer({
          id: 'wind-particles',
          image: weatherData.particleImage,
          bounds: weatherData.bounds,
          imageType: 'VECTOR',
          numParticles: particleCount,
          maxAge: 10,
          speedFactor: particleSpeed,
          color: [255, 255, 255],
          opacity: particleOpacity,
          width: 1,
        });
        newLayers.push(particleLayer);
      }

      console.log('✅ Layers created:', newLayers.length);
      setLayers(newLayers);
    } catch (err) {
      console.error('❌ Failed to create layers:', err);
    }
  }, [
    weatherData,
    particleCount,
    particleSpeed,
    particleOpacity,
    particleVisible,
    rasterVisible,
    rasterOpacity,
  ]);

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
