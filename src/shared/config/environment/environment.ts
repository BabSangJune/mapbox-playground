/**
 * 애플리케이션 환경변수 설정
 */

export const CONFIG = {
  /** API 서버 주소 */
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

  /** Supabase 프로젝트 URL */
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,

  /** Supabase 익명 키 (클라이언트 사이드) */
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,

  /** Supabase 서비스 키 (서버 사이드 - 보안 주의!) */
  SUPABASE_SERVICE_KEY: import.meta.env.VITE_SUPABASE_SERVICE_KEY,
} as const;

/**
 * 환경변수 검증
 */
const validateConfig = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'] as const;

  const missing = required.filter((key) => !CONFIG[key as keyof typeof CONFIG]);

  if (missing.length > 0) {
    console.warn(`⚠️ 누락된 환경변수: ${missing.join(', ')}\n.env 파일을 확인하세요.`);
  }
};

if (import.meta.env.DEV) {
  validateConfig();
}
