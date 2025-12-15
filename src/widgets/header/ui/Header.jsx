import * as styles from './Header.css';

export function Header({ title, subtitle }) {
  return (
    <header className={`header ${styles.header}`}>
      <h1 className={`header__title ${styles.headerTitle}`}>{title || 'Mapbox Playground'}</h1>
      {subtitle && <span className={`header__subtitle ${styles.headerSubtitle}`}>{subtitle}</span>}
    </header>
  );
}
