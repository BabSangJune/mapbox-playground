import { useEffect, useRef, useState } from 'react';

import { deckglModule } from '@/entities/map';

import { DeckGLProvider } from '@/shared/lib/context/deckgl-context';
import { useMap } from '@/shared/lib/context/map-context';

/**
 * deck.gl 오버레이를 Mapbox 지도 위에 추가하는 위젯
 * MapViewer 내부에서 사용되어야 합니다
 * @param {Object} props
 * @param {React.ReactNode} props.children - deck.gl 레이어 컴포넌트들
 * @param {Object} props.options - deck.gl 오버레이 옵션
 * @param {boolean} props.options.interleaved - Mapbox 레이어와 섞어서 렌더링 여부 (기본값: true)
 */
export function DeckGLOverlay({ children, options = {} }) {
  const { map, isLoaded: mapLoaded } = useMap();
  const deckGLRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!map?.current || !mapLoaded || deckGLRef.current) return;

    // deck.gl 오버레이 초기화
    deckglModule.initOverlay(map.current, deckGLRef, {
      interleaved: true,
      ...options,
    });

    setIsLoaded(true);

    return () => {
      deckglModule.cleanup(deckGLRef);
      setIsLoaded(false);
    };
  }, [map, mapLoaded, options]);

  return (
    <DeckGLProvider deckGLOverlay={deckGLRef} isLoaded={isLoaded}>
      {isLoaded && children}
    </DeckGLProvider>
  );
}
