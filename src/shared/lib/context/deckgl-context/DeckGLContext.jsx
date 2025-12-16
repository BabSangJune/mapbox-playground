import { createContext, useContext } from 'react';

/**
 * deck.gl 오버레이 인스턴스를 공유하는 Context
 */
const DeckGLContext = createContext(null);

/**
 * DeckGLOverlay 내부에서 deck.gl 오버레이 인스턴스에 접근하기 위한 Hook
 * @returns {{ deckOverlay: React.MutableRefObject, isLoaded: boolean }}
 * @throws {Error} DeckGLOverlay 외부에서 사용 시 에러 발생
 */
export const useDeckGL = () => {
  const context = useContext(DeckGLContext);
  if (!context) {
    throw new Error('useDeckGL must be used within DeckGLOverlay');
  }
  return context;
};

/**
 * deck.gl Context Provider
 * @param {Object} props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @param {React.MutableRefObject} props.deckGLOverlay - deck.gl 오버레이 ref
 * @param {boolean} props.isLoaded - deck.gl 오버레이 로딩 완료 여부
 */
export function DeckGLProvider({ children, deckGLOverlay, isLoaded }) {
  return (
    <DeckGLContext.Provider value={{ deckGLOverlay, isLoaded }}>{children}</DeckGLContext.Provider>
  );
}
