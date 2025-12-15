import { style } from '@vanilla-extract/css';

export const dualMapPage = style({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#0a0a0a',
});

export const dualMapPageMapContainer = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #333',
});

export const dualMapPageMapTitle = style({
  position: 'absolute',
  top: '16px',
  left: '16px',
  zIndex: 1,
  fontSize: '18px',
  fontWeight: 600,
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: '8px 16px',
  borderRadius: '4px',
  margin: 0,
});
