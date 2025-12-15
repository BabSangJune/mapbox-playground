import { style } from '@vanilla-extract/css';

export const sidebar = style({
  gridArea: 'sidebar',
  width: '64px',
  height: '100%',
  backgroundColor: '#1a1a1a',
  borderRight: '1px solid #333',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 0',
});

export const sidebarNavList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  listStyle: 'none',
  width: '100%',
  padding: 0,
  margin: 0,
});

export const sidebarNavItem = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

export const sidebarNavLink = style({
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  color: '#888',
  textDecoration: 'none',
  fontSize: '24px',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  selectors: {
    '&[data-status="active"]': {
      backgroundColor: '#2a2a2a',
      color: '#4a9eff',
    },
  },
});
