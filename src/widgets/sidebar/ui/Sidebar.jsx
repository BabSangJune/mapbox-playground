import { Link, useRouterState } from '@tanstack/react-router';

import * as styles from './Sidebar.css';

export function Sidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/weather-map', icon: '🗺️', label: 'Weather Map' },
    { path: '/dual-map', icon: '🌍', label: 'Dual Map' },
  ];

  return (
    <aside className={`sidebar ${styles.sidebar}`}>
      <nav className="sidebar__nav">
        <ul className={`sidebar__nav-list ${styles.sidebarNavList}`}>
          {navItems.map((item) => (
            <li key={item.path} className={`sidebar__nav-item ${styles.sidebarNavItem}`}>
              <Link
                to={item.path}
                className={`sidebar__nav-link ${styles.sidebarNavLink}`}
                data-status={currentPath === item.path ? 'active' : undefined}
                title={item.label}
              >
                {item.icon}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
