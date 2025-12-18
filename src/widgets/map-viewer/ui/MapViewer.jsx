import { useEffect, useRef, useState } from 'react';

import { mapboxModule } from '@/entities/map';

import { MapProvider } from '@/shared/lib/context/map-context';

import * as styles from './MapViewer.css';

/**
 * Mapbox GL 지도 뷰어 위젯
 * deck.gl을 사용하려면 DeckGLOverlay 위젯을 자식으로 추가하세요
 * @param {Object} props
 * @param {React.ReactNode} props.children - 지도 위에 렌더링할 자식 컴포넌트 (DeckGLOverlay, 컨트롤 등)
 * @param {Object} props.options - Mapbox 초기화 옵션
 * @param {[number, number]} props.options.center - 초기 중심 좌표 [경도, 위도]
 * @param {number} props.options.zoom - 초기 줌 레벨
 * @param {string} props.options.style - Mapbox 스타일 URL
 */
export function MapViewer({ children, options = {} }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current) return;

    // Mapbox 지도 초기화
    const map = mapboxModule.initMap(mapRef, containerRef, options);

    if (!map) return;

    map.on('load', () => {
      setIsLoaded(true);
    });

    return () => {
      // Mapbox 지도 정리
      mapboxModule.cleanup(mapRef);
      setIsLoaded(false);
    };
  }, [options]);

  return (
    <MapProvider map={mapRef} isLoaded={isLoaded}>
      <div className={`map-viewer ${styles.mapViewerContainer}`}>
        <div ref={containerRef} className={`map-viewer__canvas ${styles.mapViewerCanvas}`} />
        {isLoaded && children}
      </div>
    </MapProvider>
  );
}
