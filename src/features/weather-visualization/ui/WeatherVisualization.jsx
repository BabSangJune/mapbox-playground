// src/features/weather-visualization/ui/WeatherVisualization.jsx
import { useEffect, useState } from 'react';

import { ParticleLayer } from 'weatherlayers-gl';

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
    if (!weatherData?.image) {
      setLayers([]);
      return;
    }

    console.log('🎨 Creating ParticleLayer with data:', {
      width: weatherData.image.width,
      height: weatherData.image.height,
      dataLength: weatherData.image.data.length,
      bounds: weatherData.bounds,
    });

    try {
      const particleLayer = new ParticleLayer({
        id: 'weather-particles',
        image: weatherData.image,
        bounds: weatherData.bounds,
        imageType: 'VECTOR', // ✅ 벡터 데이터임을 명시
        numParticles: particleCount,
        maxAge: 10,
        speedFactor: particleSpeed,
        color: [255, 255, 255],
        opacity: particleOpacity,
        width: 1.5,
        pickable: false,
      });

      console.log('✅ ParticleLayer created successfully');
      setLayers([particleLayer]);
    } catch (err) {
      console.error('❌ Failed to create ParticleLayer:', err);
    }
  }, [weatherData, particleCount, particleSpeed, particleOpacity]);

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
