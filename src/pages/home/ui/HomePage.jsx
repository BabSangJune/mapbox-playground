import * as styles from './HomePage.css';

export function HomePage() {
  return (
    <div className={`home-page ${styles.homePage}`}>
      <div className={`home-page__content ${styles.homePageContent}`}>
        <h2 className={`home-page__title ${styles.homePageTitle}`}>Welcome to Mapbox Playground</h2>
        <p className={`home-page__description ${styles.homePageDescription}`}>
          해양 기상 시각화 플랫폼
        </p>
        <div className={`home-page__features ${styles.homePageFeatures}`}>
          <div className={`home-page__feature-card ${styles.homePageFeatureCard}`}>
            <span className={`home-page__feature-icon ${styles.homePageFeatureIcon}`}>🗺️</span>
            <h3 className={`home-page__feature-title ${styles.homePageFeatureTitle}`}>
              Interactive Maps
            </h3>
            <p className={`home-page__feature-text ${styles.homePageFeatureText}`}>
              Mapbox GL과 deck.gl을 활용한 고성능 지도 시각화
            </p>
          </div>
          <div className={`home-page__feature-card ${styles.homePageFeatureCard}`}>
            <span className={`home-page__feature-icon ${styles.homePageFeatureIcon}`}>🌊</span>
            <h3 className={`home-page__feature-title ${styles.homePageFeatureTitle}`}>
              Weather Data
            </h3>
            <p className={`home-page__feature-text ${styles.homePageFeatureText}`}>
              실시간 해양 기상 데이터 시각화
            </p>
          </div>
          <div className={`home-page__feature-card ${styles.homePageFeatureCard}`}>
            <span className={`home-page__feature-icon ${styles.homePageFeatureIcon}`}>⚡</span>
            <h3 className={`home-page__feature-title ${styles.homePageFeatureTitle}`}>
              High Performance
            </h3>
            <p className={`home-page__feature-text ${styles.homePageFeatureText}`}>
              60 FPS 유지를 위한 최적화된 렌더링
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
