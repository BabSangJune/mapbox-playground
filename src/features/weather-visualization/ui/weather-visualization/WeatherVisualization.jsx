// src/features/weather-visualization/ui/WeatherVisualization.jsx
import { useEffect, useState } from 'react';

import { ParticleLayer, RasterLayer, ContourLayer, GridLayer } from 'weatherlayers-gl';

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
    airPressureEnabled,
    airPressureData,
    config,
    setWeatherData,
    setAirPressureData,
    setLoading,
    setError,
  } = useWeatherStore();

  const [layers, setLayers] = useState([]);

  // ⭐ 1. 주 날씨 데이터 로드 (wind/current/wave/sst)
  useEffect(() => {
    if (!isLoaded || weatherType === 'airpressure') return;

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

  // ⭐ 2. Air Pressure 데이터 로드 (독립적)
  useEffect(() => {
    if (!isLoaded || !airPressureEnabled) {
      setAirPressureData(null);
      return;
    }

    async function loadAirPressure() {
      try {
        console.log('🌡️ Fetching air pressure data');
        const rawData = await fetchWeatherData('airpressure');
        const convertedData = convertToWeatherLayersFormat(rawData);
        setAirPressureData(convertedData);
      } catch (err) {
        console.error('❌ Failed to load air pressure:', err);
      }
    }

    loadAirPressure();
  }, [airPressureEnabled, isLoaded, setAirPressureData]);

  // ⭐ 3. 레이어 생성 (주 날씨 + Air Pressure 병합)
  useEffect(() => {
    // Config 체크
    if (!config) {
      console.warn('⚠️ Config not loaded yet');
      setLayers([]);
      return;
    }

    const newLayers = [];

    try {
      // 주 날씨 레이어 (wind/current/wave/sst)
      if (weatherData?.rasterImage) {
        const weatherConfig = config[weatherType];

        if (!weatherConfig) {
          console.error('❌ No config found for:', weatherType);
          return;
        }

        console.log('🎨 Creating layers for:', weatherType, weatherConfig);

        // RasterLayer
        if (weatherConfig.raster?.defaultVisible) {
          newLayers.push(
            new RasterLayer({
              id: `${weatherType}-magnitude-raster`,
              image: weatherData.rasterImage,
              bounds: weatherData.bounds,
              palette: weatherConfig.raster.palette,
              opacity: weatherConfig.raster.opacity,
              pickable: true,
              imageSmoothing: 2,
              imageInterpolation: 'LINEAR',
              beforeId: `weather-empty-layer`,
            }),
          );
        }

        // ParticleLayer (SST/AirPressure 제외)
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
              imageSmoothing: 2,
              imageInterpolation: 'LINEAR',
              beforeId: `weather-empty-layer`,
            }),
          );
        }
      }

      // ⭐ Air Pressure 레이어 (독립적, 오버레이)
      // src/features/weather-visualization/ui/WeatherVisualization.jsx

      // ⭐ Air Pressure 레이어들
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

        // 1. ContourLayer (등압선) - Uint8 이미지 사용
        if (pressureConfig.contour?.defaultVisible && airPressureData.contourImage) {
          newLayers.push(
            new ContourLayer({
              id: 'air-pressure-contour',
              image: airPressureData.contourImage, // ⭐ Uint8 이미지
              bounds: airPressureData.bounds,
              imageSmoothing: 3,
              imageUnscale: [min, max], // Uint8 → 실제 값
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

        // 2. GridLayer (기압값 숫자) - Float32 이미지 사용
        if (pressureConfig.grid?.defaultVisible) {
          newLayers.push(
            new GridLayer({
              id: 'air-pressure-grid',
              image: airPressureData.rasterImage, // ⭐ Float32 이미지 (실제 hPa 값)
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
      console.error('Debug info:', {
        weatherType,
        hasWeatherData: !!weatherData,
        hasAirPressureData: !!airPressureData,
        airPressureDataKeys: airPressureData ? Object.keys(airPressureData) : [],
        config,
      });
    }
  }, [weatherType, weatherData, airPressureEnabled, airPressureData, config]);

  // 4. deck.gl에 레이어 적용
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
