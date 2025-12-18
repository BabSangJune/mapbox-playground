// src/features/weather-visualization/ui/WeatherTypeSelector.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

export const label = style({
  fontSize: '14px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '8px',
});

export const buttonGroup = style({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});

export const button = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 16px',
  border: '2px solid #e0e0e0',
  borderRadius: '6px',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: '#666',
  transition: 'all 0.2s ease',

  ':hover': {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f9ff',
    color: '#3b82f6',
  },
});

export const buttonActive = style({
  borderColor: '#3b82f6',
  backgroundColor: '#3b82f6',
  color: 'white',

  ':hover': {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
});

export const icon = style({
  fontSize: '18px',
});

// ⭐ Air Pressure Overlay 스타일
export const overlaySection = style({
  paddingTop: '12px',
  borderTop: '1px solid #e0e0e0',
});

export const toggleButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  width: '100%',
  border: '2px dashed #e0e0e0',
  borderRadius: '6px',
  backgroundColor: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  color: '#666',
  transition: 'all 0.2s ease',

  ':hover': {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
    color: '#8b5cf6',
  },
});

export const toggleActive = style({
  borderStyle: 'solid',
  borderColor: '#8b5cf6',
  backgroundColor: '#8b5cf6',
  color: 'white',

  ':hover': {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
});

export const badge = style({
  marginLeft: 'auto',
  padding: '2px 8px',
  fontSize: '11px',
  fontWeight: '600',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '4px',
});
