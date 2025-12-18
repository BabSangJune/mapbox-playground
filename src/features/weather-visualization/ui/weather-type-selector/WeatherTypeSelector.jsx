// src/features/weather-visualization/ui/WeatherTypeSelector.jsx
import { useWeatherStore } from '@/entities/weather';

import * as styles from './WeatherTypeSelector.css';

const WEATHER_TYPES = [
  {
    id: 'wind',
    label: 'Wind',
    icon: '💨',
    description: '바람',
  },
  {
    id: 'current',
    label: 'Current',
    icon: '🌊',
    description: '해류',
  },
  {
    id: 'wave',
    label: 'Wave',
    icon: '〰️',
    description: '파도',
  },
  {
    id: 'sst',
    label: 'SST',
    icon: '🌡️',
    description: '수온',
  },
];

export function WeatherTypeSelector() {
  const { weatherType, setWeatherType, airPressureEnabled, toggleAirPressure } = useWeatherStore();

  return (
    <div className={styles.container}>
      {/* 주 날씨 타입 선택 (상호 배타적) */}
      <div>
        <label className={styles.label}>Weather Type</label>
        <div className={styles.buttonGroup}>
          {WEATHER_TYPES.map((type) => (
            <button
              key={type.id}
              className={`${styles.button} ${weatherType === type.id ? styles.buttonActive : ''}`}
              onClick={() => setWeatherType(type.id)}
              title={type.description}
            >
              <span className={styles.icon}>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* ⭐ Air Pressure 독립 토글 (Overlay) */}
      <div className={styles.overlaySection}>
        <label className={styles.label}>Overlay</label>
        <button
          className={`${styles.toggleButton} ${airPressureEnabled ? styles.toggleActive : ''}`}
          onClick={toggleAirPressure}
          title="기압 등압선 표시"
        >
          <span className={styles.icon}>🌡️</span>
          Air Pressure
          {airPressureEnabled && <span className={styles.badge}>ON</span>}
        </button>
      </div>
    </div>
  );
}
