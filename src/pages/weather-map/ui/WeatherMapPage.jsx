import * as styles from './WeatherMapPage.css';

export function WeatherMapPage() {
  return (
    <div className={`weather-map-page ${styles.weatherMapPage}`}>
      <div className={`weather-map-page__map-container ${styles.weatherMapPageMapContainer}`}>
        <div className={`weather-map-page__placeholder ${styles.weatherMapPagePlaceholder}`}>
          <span className={`weather-map-page__icon ${styles.weatherMapPageIcon}`}>🗺️</span>
          <h2 className={`weather-map-page__title ${styles.weatherMapPageTitle}`}>Weather Map</h2>
          <p className={`weather-map-page__description ${styles.weatherMapPageDescription}`}>
            Mapbox GL과 deck.gl을 활용한 기상 데이터 시각화 영역
          </p>
          <p className={`weather-map-page__note ${styles.weatherMapPageNote}`}>
            지도 컴포넌트가 여기에 표시됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
