import { globalStyle } from '@vanilla-extract/css';

import { colors, fontSize } from './tokens.css';

// ========== RESET CSS ==========
globalStyle('*', {
  margin: 0,
  padding: 0,
  border: 0,
});

globalStyle('*::before, *::after', {
  boxSizing: 'inherit',
});

// ========== HTML & BODY ==========
globalStyle('html', {
  fontSize: '62.5%', // 16px * 0.625 = 10px
  boxSizing: 'border-box',
  scrollBehavior: 'smooth',
});

globalStyle('body', {
  margin: 0,
  padding: 0,
  height: '100vh',
  fontSize: fontSize.base, // 1.6rem (16px)
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  lineHeight: 1.5,
  color: colors.neutral[900],
  backgroundColor: colors.veddy.background,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('#root', {
  height: '100%',
});

// ========== HEADINGS ==========
globalStyle('h1, h2, h3, h4, h5, h6', {
  margin: 0,
  padding: 0,
  fontWeight: 600,
  lineHeight: 1.2,
});

// ========== PARAGRAPHS & TEXT ==========
globalStyle('p', {
  margin: 0,
  padding: 0,
});

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
  backgroundColor: 'transparent',
});

globalStyle('a:hover', {
  textDecoration: 'underline',
});

// ========== LISTS ==========
globalStyle('ul, ol', {
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

globalStyle('li', {
  margin: 0,
  padding: 0,
});

// ========== FORMS ==========
globalStyle('button', {
  margin: 0,
  padding: 0,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
});

globalStyle('button:disabled', {
  cursor: 'not-allowed',
  opacity: 0.6,
});

globalStyle('input, textarea, select', {
  margin: 0,
  padding: 0,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit',
  backgroundColor: 'transparent',
  border: 'none',
});

globalStyle('input::placeholder, textarea::placeholder', {
  color: colors.neutral[500],
  opacity: 1,
});

globalStyle('textarea', {
  resize: 'vertical',
  verticalAlign: 'top',
});

globalStyle('select', {
  appearance: 'none',
});

globalStyle('option', {
  color: colors.neutral[900],
});

// ========== TABLES ==========
globalStyle('table', {
  margin: 0,
  padding: 0,
  borderCollapse: 'collapse',
  borderSpacing: 0,
});

globalStyle('th, td', {
  margin: 0,
  padding: 0,
  textAlign: 'left',
  verticalAlign: 'baseline',
});

// ========== IMAGES & MEDIA ==========
globalStyle('img, picture, video, canvas, svg', {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
});

globalStyle('img', {
  borderStyle: 'none',
});

globalStyle('svg', {
  overflow: 'hidden',
});

// ========== CODE ==========
globalStyle('code, pre, kbd, samp', {
  fontFamily: '"Courier New", monospace',
  fontSize: '1em',
});

globalStyle('pre', {
  overflow: 'auto',
  margin: 0,
  padding: 0,
});

// ========== SCROLLBAR STYLING ==========
globalStyle('::-webkit-scrollbar', {
  width: '0.8rem',
  height: '0.8rem',
});

globalStyle('::-webkit-scrollbar-track', {
  backgroundColor: colors.neutral[100],
});

globalStyle('::-webkit-scrollbar-thumb', {
  backgroundColor: colors.neutral[300],
  borderRadius: '0.4rem',
});

globalStyle('::-webkit-scrollbar-thumb:hover', {
  backgroundColor: colors.neutral[400],
});

// ========== FOCUS STATES ==========
globalStyle(
  'button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible',
  {
    outline: `2px solid ${colors.neutral[600]}`,
    outlineOffset: '2px',
  },
);
