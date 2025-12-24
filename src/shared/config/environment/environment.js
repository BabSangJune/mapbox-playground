/**
 * 애플리케이션 환경변수 설정
 */

export const CONFIG = {
  MAPBOX: {
    TOKEN: import.meta.env.VITE_MAPBOX_TOKEN || '',
    STYLE: 'mapbox://styles/lab021/ckewgpi550q6q19qdoabjwcnz',
    // STYLE: 'mapbox://styles/lab021/cm0kdqjna001f01r52j0c6lx1',
  },
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  API_TOKEN: import.meta.env.VITE_API_TOKEN || '',
};

// /**
//  * 환경변수 검증
//  */
// const validateConfig = () => {
//   const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
//
//   const missing = required.filter((key) => !CONFIG[key]);
//
//   if (missing.length > 0) {
//     console.warn(`⚠️ 누락된 환경변수: ${missing.join(', ')}\n.env 파일을 확인하세요.`);
//   }
// };
//
// if (import.meta.env.DEV) {
//   validateConfig();
// }
