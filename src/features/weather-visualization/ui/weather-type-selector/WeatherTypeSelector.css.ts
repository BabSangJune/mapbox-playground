// src/features/weather-visualization/ui/WeatherTypeSelector.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '8px',
  padding: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(10px)',
  minWidth: '160px',
});

export const label = style({
  fontSize: '12px',
  fontWeight: '600',
  color: '#666',
  marginBottom: '8px',
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const buttonGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const button = style({
  padding: '8px 16px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  background: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: '#333',
  transition: 'all 0.2s ease',
  textAlign: 'left',

  ':hover': {
    background: '#f5f5f5',
    borderColor: '#0066cc',
  },

  ':active': {
    transform: 'scale(0.98)',
  },
});

export const buttonActive = style({
  background: '#0066cc',
  color: 'white',
  borderColor: '#0066cc',

  ':hover': {
    background: '#0052a3',
    borderColor: '#0052a3',
  },
});

export const icon = style({
  marginRight: '8px',
  fontSize: '16px',
});
