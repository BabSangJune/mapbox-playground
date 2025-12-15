# MapViewer 사용 가이드

## 개요

MapViewer는 Mapbox GL과 deck.gl을 통합한 재사용 가능한 지도 위젯입니다.
Context API를 사용하여 지도 인스턴스를 자식 컴포넌트에 전달하며, FSD 아키텍처를 따릅니다.

## 아키텍처

```
src/
├── entities/
│   └── map/
│       ├── lib/
│       │   └── mapModule.js          # Mapbox + deck.gl 초기화 로직
│       └── index.js
├── widgets/
│   └── map-viewer/
│       ├── lib/
│       │   └── MapContext.jsx        # Context API
│       ├── ui/
│       │   ├── MapViewer.jsx         # 메인 컴포넌트
│       │   └── MapViewer.css.ts
│       └── index.js
└── features/
    └── weather-layer/
        ├── ui/
        │   └── WeatherLayer.jsx      # deck.gl 레이어 예시
        └── index.js
```

## 설치

필요한 패키지는 이미 설치되어 있습니다:
- `mapbox-gl`: Mapbox GL JS
- `deck.gl`: deck.gl (모든 하위 패키지 포함)

## 환경 설정

1. `.env.example`을 복사하여 `.env` 파일 생성:
```bash
cp .env.example .env
```

2. Mapbox 토큰 설정:
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Mapbox 토큰은 https://account.mapbox.com/access-tokens/ 에서 발급받을 수 있습니다.

## 기본 사용법

### 1. MapViewer 사용

```javascript
import { MapViewer } from '@/widgets/map-viewer';

export function MyMapPage() {
  return (
    <MapViewer
      options={{
        center: [126.978, 37.5665],  // [경도, 위도]
        zoom: 11,
        style: 'mapbox://styles/mapbox/dark-v11'
      }}
    >
      {/* 자식 컴포넌트 (레이어, 컨트롤 등) */}
    </MapViewer>
  );
}
```

### 2. deck.gl 레이어 추가

```javascript
import { MapViewer } from '@/widgets/map-viewer';
import { WeatherLayer } from '@/features/weather-layer';

export function WeatherMapPage() {
  const weatherData = [
    { longitude: 126.978, latitude: 37.5665, temperature: 25, windSpeed: 5 },
    { longitude: 127.0, latitude: 37.6, temperature: 22, windSpeed: 8 },
  ];

  return (
    <MapViewer
      options={{
        center: [126.978, 37.5665],
        zoom: 11,
        style: 'mapbox://styles/mapbox/dark-v11'
      }}
    >
      <WeatherLayer data={weatherData} layerType="scatterplot" />
    </MapViewer>
  );
}
```

### 3. 커스텀 레이어 생성

```javascript
import { useEffect } from 'react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { useMap } from '@/widgets/map-viewer';
import { mapModule } from '@/entities/map';

export function MyCustomLayer({ data }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const layer = new ScatterplotLayer({
      id: 'my-layer',
      data,
      getPosition: d => [d.lng, d.lat],
      getRadius: 100,
      getFillColor: [255, 0, 0],
      pickable: true,
    });

    mapModule.updateLayers(map, [layer]);

    return () => {
      mapModule.updateLayers(map, []);
    };
  }, [map, isLoaded, data]);

  return null;
}
```

## API 레퍼런스

### MapViewer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | 지도 위에 렌더링할 자식 컴포넌트 |
| `options` | `Object` | `{}` | Mapbox 초기화 옵션 |
| `options.center` | `[number, number]` | `[126.978, 37.5665]` | 초기 중심 좌표 [경도, 위도] |
| `options.zoom` | `number` | `10` | 초기 줌 레벨 |
| `options.style` | `string` | `'mapbox://styles/mapbox/dark-v11'` | Mapbox 스타일 URL |

### useMap Hook

MapViewer 내부에서 지도 인스턴스에 접근하기 위한 Hook입니다.

```javascript
const { map, isLoaded } = useMap();
```

**반환값:**
- `map`: `React.MutableRefObject` - 지도 인스턴스 ref
- `isLoaded`: `boolean` - 지도 로딩 완료 여부

### mapModule API

#### `initMap(mapRef, containerRef, options)`
Mapbox 지도를 초기화하고 deck.gl 오버레이를 추가합니다.

**Parameters:**
- `mapRef`: `React.MutableRefObject` - 지도 인스턴스를 저장할 ref
- `containerRef`: `React.MutableRefObject` - 지도 컨테이너 DOM ref
- `options`: `Object` - Mapbox 초기화 옵션

**Returns:** `mapboxgl.Map` - 생성된 지도 인스턴스

#### `updateLayers(mapRef, layers)`
deck.gl 레이어를 업데이트합니다.

**Parameters:**
- `mapRef`: `React.MutableRefObject` - 지도 인스턴스 ref
- `layers`: `Array` - deck.gl 레이어 배열

#### `cleanup(mapRef)`
지도 인스턴스를 정리합니다.

**Parameters:**
- `mapRef`: `React.MutableRefObject` - 지도 인스턴스 ref

## 예시

### WeatherMapPage (현재 구현)

```javascript
import { useState } from 'react';
import { MapViewer } from '@/widgets/map-viewer';
import { WeatherLayer } from '@/features/weather-layer';

export function WeatherMapPage() {
  const [weatherData] = useState([
    { longitude: 126.978, latitude: 37.5665, temperature: 25, windSpeed: 5 },
    { longitude: 127.0, latitude: 37.6, temperature: 22, windSpeed: 8 },
    { longitude: 126.95, latitude: 37.55, temperature: 28, windSpeed: 3 },
    { longitude: 127.05, latitude: 37.58, temperature: 20, windSpeed: 10 },
    { longitude: 126.92, latitude: 37.52, temperature: 26, windSpeed: 6 },
  ]);

  return (
    <div className={styles.weatherMapPage}>
      <MapViewer
        options={{
          center: [126.978, 37.5665],
          zoom: 11,
          style: 'mapbox://styles/mapbox/dark-v11',
        }}
      >
        <WeatherLayer data={weatherData} layerType="scatterplot" />
      </MapViewer>
    </div>
  );
}
```

## 주요 특징

### ✅ 장점

1. **Context API 사용**: cloneElement 대신 Context API로 깔끔한 데이터 흐름
2. **FSD 아키텍처 준수**: entities, widgets, features 레이어 분리
3. **react-map-gl 불필요**: Mapbox GL과 deck.gl을 직접 통합
4. **완전한 제어**: 저수준 API 접근 가능
5. **성능 최적화**: `interleaved: true`로 Mapbox와 deck.gl 레이어 혼합 렌더링
6. **재사용 가능**: 여러 페이지에서 동일한 MapViewer 사용 가능

### 🎯 FSD 레이어 역할

- **entities/map**: 순수 로직 (Mapbox + deck.gl 초기화)
- **widgets/map-viewer**: UI 컨테이너 + Context Provider
- **features/weather-layer**: 개별 기능 (deck.gl 레이어)
- **pages/weather-map**: 조합 및 사용

## 문제 해결

### 지도가 표시되지 않는 경우

1. `.env` 파일에 `VITE_MAPBOX_TOKEN`이 설정되어 있는지 확인
2. 브라우저 콘솔에서 에러 메시지 확인
3. 개발 서버 재시작: `npm run dev`

### deck.gl 레이어가 표시되지 않는 경우

1. `useMap` hook이 MapViewer 내부에서 사용되는지 확인
2. `isLoaded`가 `true`인지 확인
3. 데이터 형식이 올바른지 확인 (longitude, latitude 필드)

## 추가 리소스

- [Mapbox GL JS 문서](https://docs.mapbox.com/mapbox-gl-js/api/)
- [deck.gl 문서](https://deck.gl/docs)
- [FSD 아키텍처](https://feature-sliced.design/)
