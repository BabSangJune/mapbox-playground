import { style } from '@vanilla-extract/css';

export const appLayout = style({
  display: 'grid',
  gridTemplateColumns: '64px 1fr',
  gridTemplateRows: '64px 1fr',
  gridTemplateAreas: `
    "sidebar header"
    "sidebar main"
  `,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

export const appMain = style({
  gridArea: 'main',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
});
