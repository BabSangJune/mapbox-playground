import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';

import { DualMapPage } from '@/pages/dual-map';
import { HomePage } from '@/pages/home';
import { WeatherMapPage } from '@/pages/weather-map';

import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';

import * as styles from './router.css';

// Root Route with Layout
const rootRoute = createRootRoute({
  component: () => (
    <div className={`app-layout ${styles.appLayout}`}>
      <Sidebar />
      <Header />
      <main className={`app-main ${styles.appMain}`}>
        <Outlet />
      </main>
    </div>
  ),
});

// Home Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Weather Map Route
const weatherMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/weather-map',
  component: WeatherMapPage,
});

// Dual Map Route
const dualMapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dual-map',
  component: DualMapPage,
});

// Route Tree
const routeTree = rootRoute.addChildren([indexRoute, weatherMapRoute, dualMapRoute]);

// Router Instance
const router = createRouter({ routeTree });

// Router Provider Component
export function AppRouter() {
  return <RouterProvider router={router} />;
}
