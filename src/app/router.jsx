import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';

import * as styles from './router.css';

import { HomePage, WeatherMapPage } from '@/pages';
import { Header, Sidebar } from '@/widgets';

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

// Route Tree
const routeTree = rootRoute.addChildren([indexRoute, weatherMapRoute]);

// Router Instance
const router = createRouter({ routeTree });

// Router Provider Component
export function AppRouter() {
  return <RouterProvider router={router} />;
}
