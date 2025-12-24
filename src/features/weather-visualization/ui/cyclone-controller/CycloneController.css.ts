// src/features/weather-visualization/ui/cyclone-controller/CycloneController.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  width: '280px',
  maxHeight: '400px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #e0e0e0',
});

export const title = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '700',
  color: '#333',
  letterSpacing: '0.5px',
});

export const titleIcon = style({
  fontSize: '18px',
});

export const headerActions = style({
  display: 'flex',
  gap: '4px',
});

export const headerButton = style({
  padding: '4px 8px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.2s',

  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  maxHeight: '320px',
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid #f0f0f0',
  transition: 'background-color 0.2s',

  ':hover': {
    backgroundColor: '#f8f9fa',
  },

  ':last-child': {
    borderBottom: 'none',
  },
});

export const itemContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  minWidth: 0,
});

export const itemIcon = style({
  fontSize: '20px',
  flexShrink: 0,
});

export const itemInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
});

export const itemName = style({
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const itemCategory = style({
  fontSize: '11px',
  fontWeight: '500',
  color: '#999',
  textTransform: 'uppercase',
});

// Toggle Switch
export const toggle = style({
  padding: '4px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  flexShrink: 0,
});

export const toggleTrack = style({
  position: 'relative',
  width: '44px',
  height: '24px',
  backgroundColor: '#ccc',
  borderRadius: '12px',
  transition: 'background-color 0.3s',
});

export const toggleThumb = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '20px',
  height: '20px',
  backgroundColor: 'white',
  borderRadius: '50%',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s',
});

// ✅ 수정: toggleActive를 toggleTrack과 toggleThumb에 직접 적용
export const toggleTrackActive = style({
  backgroundColor: '#3b82f6',
});

export const toggleThumbActive = style({
  transform: 'translateX(20px)',
});

export const loading = style({
  padding: '24px 16px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#999',
});

export const empty = style({
  padding: '24px 16px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#999',
});

export const error = style({
  padding: '24px 16px',
  textAlign: 'center',
  fontSize: '14px',
  color: '#ef4444',
  backgroundColor: '#fee',
  borderRadius: '4px',
  margin: '8px',
});
