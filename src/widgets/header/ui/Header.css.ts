import { style } from '@vanilla-extract/css';

export const header = style({
  gridArea: 'header',
  width: '100%',
  height: '64px',
  backgroundColor: '#1a1a1a',
  borderBottom: '1px solid #333',
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
});

export const headerTitle = style({
  fontSize: '20px',
  fontWeight: 600,
  color: '#fff',
  margin: 0,
});

export const headerSubtitle = style({
  fontSize: '14px',
  color: '#888',
  marginLeft: '12px',
});
