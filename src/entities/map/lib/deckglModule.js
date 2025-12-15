import { MapboxOverlay } from '@deck.gl/mapbox';

/**
 * deck.gl 오버레이를 초기화하고 관리하는 모듈
 * Mapbox와 독립적으로 deck.gl 관련 로직만 처리합니다
 */
export const deckglModule = {
  /**
   * deck.gl 오버레이를 생성하고 Mapbox 지도에 추가합니다
   * @param {mapboxgl.Map} map - Mapbox 지도 인스턴스
   * @param {React.MutableRefObject} deckRef - deck.gl 오버레이를 저장할 ref
   * @param {Object} options - deck.gl 오버레이 옵션
   * @param {boolean} options.interleaved - Mapbox 레이어와 deck.gl 레이어를 섞어서 렌더링할지 여부
   * @returns {MapboxOverlay} 생성된 deck.gl 오버레이 인스턴스
   */
  initOverlay(map, deckRef, options = {}) {
    if (!map) {
      console.error('Map instance is not available');
      return null;
    }

    const deckOverlay = new MapboxOverlay({
      interleaved: options.interleaved !== false, // 기본값: true
      layers: [],
      ...options,
    });

    map.addControl(deckOverlay);
    deckRef.current = deckOverlay;

    return deckOverlay;
  },

  /**
   * deck.gl 레이어를 업데이트합니다
   * @param {React.MutableRefObject} deckRef - deck.gl 오버레이 ref
   * @param {Array} layers - deck.gl 레이어 배열
   */
  updateLayers(deckRef, layers) {
    if (deckRef?.current) {
      deckRef.current.setProps({ layers });
    }
  },

  /**
   * deck.gl 오버레이를 정리합니다
   * @param {React.MutableRefObject} deckRef - deck.gl 오버레이 ref
   */
  cleanup(deckRef) {
    if (deckRef?.current) {
      deckRef.current = null;
    }
  },

  /**
   * deck.gl 오버레이 인스턴스를 반환합니다
   * @param {React.MutableRefObject} deckRef - deck.gl 오버레이 ref
   * @returns {MapboxOverlay|null} deck.gl 오버레이 인스턴스 또는 null
   */
  getOverlay(deckRef) {
    return deckRef?.current || null;
  },
};
