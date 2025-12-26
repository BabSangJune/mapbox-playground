// src/features/weather-visualization/ui/cyclone-controller/CycloneController.jsx
import { useWeatherStore } from '@/entities/weather';
import { useCycloneDataQuery } from '@/entities/weather/api';

import * as styles from './CycloneController.css.ts';

export function CycloneController() {
  const {
    cycloneData,
    visibleCyclones,
    toggleCycloneVisibility,
    showAllCyclones,
    hideAllCyclones,
  } = useWeatherStore();

  // React Query로 데이터 로드
  const { isLoading, isError, error } = useCycloneDataQuery(true);

  const allVisible = cycloneData.length > 0 && visibleCyclones.size === cycloneData.length;

  // 로딩 중
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading cyclones...</div>
      </div>
    );
  }

  // 에러 발생
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Failed to load cyclones: {error?.message}</div>
      </div>
    );
  }

  // 데이터 없음
  if (cycloneData.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.titleIcon}>🌀</span>
          CYCLONE
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.headerButton}
            onClick={allVisible ? hideAllCyclones : showAllCyclones}
            title={allVisible ? 'Hide All' : 'Show All'}
          >
            {allVisible ? '👁️‍🗨️' : '👁️'}
          </button>
        </div>
      </div>

      {/* Cyclone List */}
      <div className={styles.list}>
        {cycloneData.map((cyclone) => {
          const isVisible = visibleCyclones.has(cyclone.id);

          return (
            <div key={cyclone.id} className={styles.item}>
              <div className={styles.itemContent}>
                <span className={styles.itemIcon}>{cyclone.icon}</span>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{cyclone.name}</div>
                  <div className={styles.itemCategory}>{cyclone.category}</div>
                </div>
              </div>
              <button
                className={styles.toggle}
                onClick={() => toggleCycloneVisibility(cyclone.id)}
                title={isVisible ? 'Hide' : 'Show'}
                aria-label={`Toggle ${cyclone.name}`}
              >
                <div
                  className={`${styles.toggleTrack} ${isVisible ? styles.toggleTrackActive : ''}`}
                >
                  <div
                    className={`${styles.toggleThumb} ${isVisible ? styles.toggleThumbActive : ''}`}
                  />
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
