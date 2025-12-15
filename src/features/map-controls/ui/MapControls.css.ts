import { style } from '@vanilla-extract/css';

export const mapControls = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 10,
});

// 상단 중앙
export const mapControlsTop = style({
  position: 'absolute',
  top: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  pointerEvents: 'auto',
  display: 'flex',
  gap: '8px',
});

// 좌상단
export const mapControlsTopLeft = style({
  position: 'absolute',
  top: '16px',
  left: '16px',
  pointerEvents: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// 우상단
export const mapControlsTopRight = style({
  position: 'absolute',
  top: '16px',
  right: '16px',
  pointerEvents: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// 좌하단
export const mapControlsBottomLeft = style({
  position: 'absolute',
  bottom: '16px',
  left: '16px',
  pointerEvents: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// 우하단
export const mapControlsBottomRight = style({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  pointerEvents: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// 하단 중앙
export const mapControlsBottom = style({
  position: 'absolute',
  bottom: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  pointerEvents: 'auto',
  display: 'flex',
  gap: '8px',
});
