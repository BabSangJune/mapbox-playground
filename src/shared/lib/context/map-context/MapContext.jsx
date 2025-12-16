import { createContext, useContext } from 'react';

/**
 * 지도 인스턴스와 로딩 상태를 공유하는 Context
 */
const MapContext = createContext(null);

/**
 * MapViewer 내부에서 지도 인스턴스에 접근하기 위한 Hook
 * @returns {{ map: React.MutableRefObject, isLoaded: boolean }}
 * @throws {Error} MapViewer 외부에서 사용 시 에러 발생
 */
export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within MapViewer');
  }
  return context;
};

/**
 * 지도 Context Provider
 * @param {Object} props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @param {React.MutableRefObject} props.map - 지도 인스턴스 ref
 * @param {boolean} props.isLoaded - 지도 로딩 완료 여부
 */
export function MapProvider({ children, map, isLoaded }) {
  return <MapContext.Provider value={{ map, isLoaded }}>{children}</MapContext.Provider>;
}
