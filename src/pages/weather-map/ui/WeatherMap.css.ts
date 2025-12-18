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

export const weatherMapPageControlButton = style({
  padding: '8px 16px',
  backgroundColor: '#1a1a1a',
  color: '#fff',
  border: '1px solid #333',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#2a2a2a',
    borderColor: '#4a9eff',
  },
});

export const weatherMapPageInfoBox = style({
  padding: '8px 16px',
  backgroundColor: 'rgba(26, 26, 26, 0.9)',
  color: '#fff',
  border: '1px solid #333',
  borderRadius: '4px',
  fontSize: '14px',
});
