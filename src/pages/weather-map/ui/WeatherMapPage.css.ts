import { style } from '@vanilla-extract/css';

export const weatherMapPage = style({
  width: '100%',
  height: '100%',
  backgroundColor: '#0a0a0a',
});

export const weatherMapPageMapContainer = style({
  width: '100%',
  height: '100%',
  position: 'relative',
});

export const weatherMapPagePlaceholder = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#1a1a1a',
});

export const weatherMapPageIcon = style({
  fontSize: '64px',
  marginBottom: '24px',
});

export const weatherMapPageTitle = style({
  fontSize: '32px',
  fontWeight: 600,
  color: '#fff',
  marginBottom: '12px',
});

export const weatherMapPageDescription = style({
  fontSize: '18px',
  color: '#888',
  marginBottom: '8px',
  textAlign: 'center',
});

export const weatherMapPageNote = style({
  fontSize: '14px',
  color: '#666',
  fontStyle: 'italic',
});
