import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';

import { HomePage } from '@/pages/home';
import { WeatherMap } from '@/pages/weather-map';

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
  component: WeatherMap,
});

// Dual Map Route
// const dualMapRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: '/dual-map',
//   component: DualMapPage,
// });

// Route Tree
// const routeTree = rootRoute.addChildren([indexRoute, weatherMapRoute, dualMapRoute]);
const routeTree = rootRoute.addChildren([indexRoute, weatherMapRoute]);

// Router Instance
const router = createRouter({ routeTree });

// Router Provider Component
export function AppRouter() {
  return <RouterProvider router={router} />;
}
