// src/shared/styles/tokens.css.ts

/**
 * 색상 토큰
 * 베디의 캐릭터성: 친절함(따뜻한 블루), 신뢰성(중성 톤), 꾸준함(일관된 팔레트)
 */
export const colors = {
  // Primary - 베디 메인 컬러
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // 메인
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Neutral - 중성 컬러
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Semantic 컬러
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // 베디 전용 컬러 (위의 색상을 조합)
  veddy: {
    background: '#f9fafb', // neutral[50]
    surface: '#ffffff', // neutral[0]
    userBubble: '#3b82f6', // primary[500]
    userText: '#ffffff', // neutral[0]
    assistantBubble: '#f3f4f6', // neutral[100]
    assistantText: '#111827', // neutral[900]
    border: '#e5e7eb', // neutral[200]
    inputBorder: '#d1d5db', // neutral[300]
    inputFocus: '#3b82f6', // primary[500]
  },
} as const;

/**
 * Spacing 토큰 (rem 기반)
 * 1rem = 10px 기준
 */
export const spacing = {
  0: '0',
  1: '0.1rem', // 1px
  2: '0.2rem', // 2px
  4: '0.4rem', // 4px
  6: '0.6rem', // 6px
  8: '0.8rem', // 8px
  10: '1rem', // 10px
  12: '1.2rem', // 12px
  16: '1.6rem', // 16px
  20: '2rem', // 20px
  24: '2.4rem', // 24px
  28: '2.8rem', // 28px
  32: '3.2rem', // 32px
  40: '4rem', // 40px
  48: '4.8rem', // 48px
  56: '5.6rem', // 56px
  64: '6.4rem', // 64px
  80: '8rem', // 80px
  96: '9.6rem', // 96px
  128: '12.8rem', // 128px
} as const;

/**
 * Typography 토큰 (rem 기반)
 */
export const fontSize = {
  xs: '1.2rem', // 12px
  sm: '1.4rem', // 14px
  base: '1.6rem', // 16px (기본)
  lg: '1.8rem', // 18px
  xl: '2rem', // 20px
  '2xl': '2.4rem', // 24px
  '3xl': '3rem', // 30px
  '4xl': '3.6rem', // 36px
  '5xl': '4.8rem', // 48px
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Border Radius (rem 기반)
 */
export const borderRadius = {
  none: '0',
  sm: '0.4rem', // 4px
  base: '0.8rem', // 8px
  md: '1.2rem', // 12px
  lg: '1.6rem', // 16px
  xl: '2.4rem', // 24px
  full: '9999rem',
} as const;

/**
 * Shadow
 */
export const shadow = {
  sm: '0 0.1rem 0.2rem rgba(0, 0, 0, 0.05)',
  base: '0 0.1rem 0.3rem rgba(0, 0, 0, 0.1), 0 0.1rem 0.2rem rgba(0, 0, 0, 0.06)',
  md: '0 0.4rem 0.6rem -0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.4rem -0.1rem rgba(0, 0, 0, 0.06)',
  lg: '0 1rem 1.5rem -0.3rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.6rem -0.2rem rgba(0, 0, 0, 0.05)',
  xl: '0 2rem 2.5rem -0.5rem rgba(0, 0, 0, 0.1), 0 0.8rem 1rem -0.4rem rgba(0, 0, 0, 0.04)',
} as const;

/**
 * Transition
 */
export const transition = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

/**
 * Z-index
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 2000,
  popover: 2100,
  tooltip: 3000,
  toast: 4000,
} as const;

/**
 * Breakpoints (반응형)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
