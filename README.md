# Development Guidelines - Mapbox Playground

## Project Context

**Domain**: Maritime Weather Visualization Platform
- Real-time weather data visualization on interactive maps
- Performance-critical application (must handle large datasets at 60 FPS)
- Built with React 19, Vite, and Feature-Sliced Design architecture

---

## Build & Configuration

### Development Server
```bash
npm run dev
```
- Runs on port **3000** (configured in vite.config.js)
- Auto-opens browser
- API proxy: `/api` → `http://localhost:8000` (or `VITE_API_BASE_URL`)

### Build
```bash
npm run build
```
- Output: `dist/` directory
- Generates sourcemaps
- Creates bundle visualization at `dist/stats.html`
- **Custom Vite**: Uses `rolldown-vite@7.2.5` (specified in package.json overrides)

### Chunk Optimization
The build is configured with manual chunk splitting:
- `react-vendor`: React, ReactDOM, scheduler
- `state-vendor`: TanStack Query, Zustand
- `style-vendor`: vanilla-extract, clsx
- `mapbox-vendor`: mapbox-gl, react-map-gl
- `utils-vendor`: axios
- `vendor`: other node_modules

---

## Testing

### Framework
**Vitest** with React Testing Library and jsdom environment.

### Running Tests
```bash
# Run all tests once
npm test

# Watch mode (re-run on file changes)
npm test:watch

# UI mode (interactive test runner)
npm test:ui
```

### Test Configuration
- Config: `vite.config.js` (test section)
- Setup file: `src/test/setup.js` (imports @testing-library/jest-dom)
- Environment: jsdom (browser-like environment)
- Globals: enabled (describe, it, expect available without imports)

### Writing Tests
Place test files next to the code they test with `.test.js` extension.

**Example** (`src/shared/lib/utils.test.js`):
```javascript
import { describe, it, expect } from 'vitest';
import { formatCoordinates, calculateDistance } from './utils';

describe('formatCoordinates', () => {
  it('should format coordinates with default precision', () => {
    const result = formatCoordinates(37.7749, -122.4194);
    expect(result).toBe('37.7749, -122.4194');
  });

  it('should throw error for invalid latitude', () => {
    expect(() => formatCoordinates(91, 0)).toThrow('Latitude must be between -90 and 90');
  });
});

describe('calculateDistance', () => {
  it('should calculate distance between two points', () => {
    const distance = calculateDistance(37.7749, -122.4194, 34.0522, -118.2437);
    expect(distance).toBeCloseTo(559, 0); // ~559 km between SF and LA
  });
});
```

---

## Architecture: Feature-Sliced Design (FSD)

### Layer Structure
```
src/
├── app/          # Application initialization, providers, map-instance
├── pages/        # Page-level components (routes)
├── widgets/      # Self-contained UI blocks (composed from features/entities)
├── features/     # User interactions and business features
├── entities/     # Business entities (api, model, lib)
├── shared/       # Reusable utilities, UI components, configs
└── assets/       # Static assets
```

### Path Aliases (configured in vite.config.js)
```javascript
import { Button } from '@/shared/ui';
import { useWeatherStore } from '@/entities/weather/model/store';
import { WeatherMap } from '@/features/weather-map';
```

### FSD Import Rules (enforced by eslint-plugin-boundaries)
**Strict hierarchy** - layers can only import from layers below:
- `app` → pages, widgets, features, entities, shared
- `pages` → widgets, features, entities, shared
- `widgets` → features, entities, shared
- `features` → entities, shared
- `entities` → shared
- `shared` → shared

**NO cross-imports** between slices in the same layer (e.g., `features/weather` cannot import from `features/map`).

**Public API**: Each slice must export through `index.js`:
```javascript
// ✅ Correct
import { WeatherLayer } from '@/features/weather-layer';

// ❌ Wrong
import { WeatherLayer } from '@/features/weather-layer/ui/WeatherLayer';
```

---

## Core Libraries & Critical Usage Patterns

### 1. deck.gl (Map Visualization)
**Packages**: `@deck.gl/core`, `@deck.gl/layers`, `@deck.gl/aggregation-layers`, `@deck.gl/mapbox`

**Performance Critical**:
```javascript
// ✅ Always enable GPU aggregation for ContourLayer
new ContourLayer({
  gpuAggregation: true,  // REQUIRED for performance
  // ... other props
});
```

### 2. Turf.js (Geospatial Operations)
**CRITICAL**: Import individual modules to reduce bundle size.

```javascript
// ❌ WRONG - imports entire library (~500KB)
import * as turf from '@turf/turf';

// ✅ CORRECT - imports only needed module
import buffer from '@turf/buffer';
import bbox from '@turf/bbox';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
```

### 3. rbush (Spatial Indexing)
**Purpose**: Filter large datasets by viewport bounds for performance.

**Usage pattern**:
```javascript
import RBush from 'rbush';

// Index data points
const tree = new RBush();
tree.load(dataPoints.map(point => ({
  minX: point.lng,
  minY: point.lat,
  maxX: point.lng,
  maxY: point.lat,
  data: point
})));

// Query visible points
const visiblePoints = tree.search({
  minX: viewport.west,
  minY: viewport.south,
  maxX: viewport.east,
  maxY: viewport.north
});
```

### 4. Zustand (State Management)
**Location**: `entities/[name]/model/store.ts`

**Pattern**:
```javascript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useWeatherStore = create(
  immer((set) => ({
    data: [],
    setData: (data) => set((state) => { state.data = data; }),
  }))
);
```

### 5. TanStack Query (API/Data Fetching)
**Location**: `entities/[name]/api/`

**Pattern**:
```javascript
import { useQuery } from '@tanstack/react-query';

export const useWeatherData = (params) => {
  return useQuery({
    queryKey: ['weather', params],
    queryFn: () => fetchWeatherData(params),
  });
};
```

### 6. Other Key Libraries
- **Axios**: HTTP client for API requests
- **date-fns**: Date/time manipulation (with @date-fns/tz and @date-fns/utc)
- **vanilla-extract**: Type-safe CSS-in-JS (`.css.ts` files)
- **Framer Motion**: UI animations (if needed)

---

## Performance Guidelines

### 1. Debouncing User Inputs
Always debounce rapid user interactions (map panning, zooming, filtering):
```javascript
import { useDebouncedCallback } from 'use-debounce';

const handleMapMove = useDebouncedCallback((viewport) => {
  // Update data based on new viewport
}, 300);
```

### 2. Viewport-Based Loading
Use rbush spatial indexing to load only visible data:
- Index all data points on initial load
- Query index on viewport change
- Render only visible subset

### 3. deck.gl Optimization
- Enable `gpuAggregation: true` for aggregation layers
- Use `updateTriggers` to control re-renders
- Memoize layer props when possible

---

## Code Style

### Naming Conventions
- **Components**: PascalCase (`WeatherMap.jsx`)
- **Files**: camelCase (`weatherMap.jsx`, `useWeatherData.js`)
- **Hooks**: `use` prefix (`useWeatherData`, `useMapViewport`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Directories**: kebab-case (`weather-map`, `map-controls`)

### Formatting (Prettier)
```javascript
{
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
}
```

### Linting (ESLint)
- **Import order**: Enforced with groups (builtin → external → internal → parent → sibling)
- **React Hooks**: Rules enforced (`rules-of-hooks`, `exhaustive-deps`)
- **Boundaries**: FSD layer violations are errors
- **Console**: `console.log` warnings (use `console.warn` or `console.error`)

### Import Order Example
```javascript
// 1. React (external, before other externals)
import React from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import bbox from '@turf/bbox';

// 3. Internal (FSD layers, alphabetically)
import { useWeatherStore } from '@/entities/weather/model/store';
import { MapControls } from '@/features/map-controls';
import { Button } from '@/shared/ui';

// 4. Relative imports
import { WeatherLayer } from './WeatherLayer';
import styles from './styles.css';
```

---

## Known Issues & Workarounds

### 1. Turf.js Bundle Size
**Issue**: Importing `@turf/turf` adds ~500KB to bundle.
**Solution**: Always import individual modules (see Turf.js section above).

### 2. deck.gl Peer Dependencies
**Issue**: May need `@luma.gl` in devDependencies for proper types.
**Solution**: Add if TypeScript errors occur:
```bash
npm install --save-dev @luma.gl/core
```

### 3. Large Dataset Performance
**Issue**: Rendering 10,000+ points causes frame drops.
**Solution**:
- Use rbush spatial indexing for viewport filtering
- Enable GPU aggregation for deck.gl layers
- Consider data clustering for extreme datasets

### 4. React Compiler (Experimental)
**Note**: Project uses `babel-plugin-react-compiler` (React 19 feature).
- May cause issues with certain patterns
- Can be disabled in `vite.config.js` if needed

---

## Additional Notes

### CSS-in-JS (vanilla-extract)
- Files: `*.css.ts`
- Type-safe styles with TypeScript
- CSS properties auto-sorted with `prettier-plugin-css-order`
- Even if you use vanilla-extract, please write semantic class names for easier debugging.
- design token files are located in `src/shared/styles/tokens/`
- typography styles are located in `src/shared/styles/typography/`

### Environment Variables
Prefix with `VITE_` to expose to client:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Bundle Analysis
After build, open `dist/stats.html` to visualize bundle composition and identify optimization opportunities.
