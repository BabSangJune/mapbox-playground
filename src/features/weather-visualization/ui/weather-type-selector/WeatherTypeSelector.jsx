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
];

export function WeatherTypeSelector() {
  const { weatherType, setWeatherType } = useWeatherStore();

  return (
    <div className={styles.container}>
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
  );
}
