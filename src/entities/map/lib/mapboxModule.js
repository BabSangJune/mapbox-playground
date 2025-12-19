import mapboxgl from 'mapbox-gl';

import { CONFIG } from '@/shared/config/environment';

/**
 * Mapbox GL 지도를 초기화하고 관리하는 모듈
 * deck.gl과 독립적으로 Mapbox 관련 로직만 처리합니다
 */
export const mapboxModule = {
  /**
   * Mapbox 지도를 초기화합니다
   * @param {React.MutableRefObject} mapRef - 지도 인스턴스를 저장할 ref
   * @param {React.MutableRefObject} containerRef - 지도 컨테이너 DOM ref
   * @param {Object} options - Mapbox 초기화 옵션
   * @param {string} options.style - 지도 스타일 URL
   * @param {Array<number>} options.center - 초기 중심 좌표 [lng, lat]
   * @param {number} options.zoom - 초기 줌 레벨
   * @returns {mapboxgl.Map|null} 생성된 지도 인스턴스 또는 null
   */
  initMap(mapRef, containerRef, options = {}) {
    if (!containerRef.current) {
      console.error('Map container ref is not available');
      return null;
    }

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: options.style || CONFIG.MAPBOX.STYLE,
      center: options.center || [0, 0],
      zoom: options.zoom || 2,
      accessToken: CONFIG.MAPBOX.TOKEN,
      attributionControl: false,
      ...options,
    });

    mapRef.current = map;

    return map;
  },

  /**
   * 지도 인스턴스를 정리합니다
   * @param {React.MutableRefObject} mapRef - 지도 인스턴스 ref
   */
  cleanup(mapRef) {
    if (mapRef?.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  },

  /**
   * 지도 인스턴스를 반환합니다
   * @param {React.MutableRefObject} mapRef - 지도 인스턴스 ref
   * @returns {mapboxgl.Map|null} 지도 인스턴스 또는 null
   */
  getMap(mapRef) {
    return mapRef?.current || null;
  },
};
