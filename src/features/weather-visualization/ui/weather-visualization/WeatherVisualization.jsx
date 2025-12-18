// src/features/weather-visualization/ui/WeatherVisualization.jsx
import { useEffect, useState } from 'react';

import { ParticleLayer, RasterLayer, ContourLayer } from 'weatherlayers-gl';

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
            }),
          );
        }
      }

      // ⭐ Air Pressure 레이어 (독립적, 오버레이)
      if (airPressureEnabled && airPressureData?.rasterImage) {
        const pressureConfig = config.airpressure;

        if (!pressureConfig) {
          console.error('❌ No airpressure config found');
          return;
        }

        console.log('🌡️ Creating air pressure contour layer');
        console.log('  - Value range:', airPressureData.valueRange);
        console.log('  - Image type:', airPressureData.rasterImage.data.constructor.name);

        // ⭐ ContourLayer (등압선만)

        if (pressureConfig.contour?.defaultVisible) {
          const { min, max } = airPressureData.valueRange || {
            min: pressureConfig.minPressure,
            max: pressureConfig.maxPressure,
          };

          console.log('🌡️ Contour config:', {
            min,
            max,
            dataType: airPressureData.rasterImage.data.constructor.name,
            sampleValues: Array.from(airPressureData.rasterImage.data.slice(0, 10)),
          });

          newLayers.push(
            new ContourLayer({
              id: 'air-pressure-contour',
              image: airPressureData.rasterImage,
              bounds: airPressureData.bounds,

              // ⭐ Uint8 (0-255) → 실제 기압값 (980-1040) 매핑
              imageUnscale: [min, max],

              // ⭐ 등압선 간격 설정
              interval: 4, // 4 hPa 간격
              majorInterval: 8, // 12 hPa마다 굵은 선

              // ⭐ 스타일
              contourColor: [255, 255, 255, 200], // 흰색 등압선
              majorContourColor: [255, 255, 255, 255], // 주요 등압선은 더 진하게
              strokeWidth: 1.5,
              majorStrokeWidth: 2.5,

              opacity: 0.8,
              pickable: true,

              // ⭐ 렌더링 최적화
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
