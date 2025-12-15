import * as styles from './MapControls.css';

/**
 * 지도 위에 컨트롤을 배치할 수 있는 합성 컴포넌트
 * 6개 영역(Top, TopLeft, TopRight, BottomLeft, BottomRight, Bottom)으로 구성
 *
 * @example
 * <MapControls>
 *   <MapControls.TopLeft>
 *     <button>줌 인</button>
 *   </MapControls.TopLeft>
 *   <MapControls.TopRight>
 *     <button>레이어</button>
 *     <button>설정</button>
 *   </MapControls.TopRight>
 *   <MapControls.Bottom>
 *     <div>정보 표시</div>
 *   </MapControls.Bottom>
 * </MapControls>
 */
export function MapControls({ children }) {
  return <div className={`map-controls ${styles.mapControls}`}>{children}</div>;
}

/**
 * 상단 중앙 영역
 */
MapControls.Top = function MapControlsTop({ children }) {
  return <div className={`map-controls__top ${styles.mapControlsTop}`}>{children}</div>;
};

/**
 * 좌상단 영역
 */
MapControls.TopLeft = function MapControlsTopLeft({ children }) {
  return <div className={`map-controls__top-left ${styles.mapControlsTopLeft}`}>{children}</div>;
};

/**
 * 우상단 영역
 */
MapControls.TopRight = function MapControlsTopRight({ children }) {
  return <div className={`map-controls__top-right ${styles.mapControlsTopRight}`}>{children}</div>;
};

/**
 * 좌하단 영역
 */
MapControls.BottomLeft = function MapControlsBottomLeft({ children }) {
  return (
    <div className={`map-controls__bottom-left ${styles.mapControlsBottomLeft}`}>{children}</div>
  );
};

/**
 * 우하단 영역
 */
MapControls.BottomRight = function MapControlsBottomRight({ children }) {
  return (
    <div className={`map-controls__bottom-right ${styles.mapControlsBottomRight}`}>{children}</div>
  );
};

/**
 * 하단 중앙 영역
 */
MapControls.Bottom = function MapControlsBottom({ children }) {
  return <div className={`map-controls__bottom ${styles.mapControlsBottom}`}>{children}</div>;
};
