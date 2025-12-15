import { style } from '@vanilla-extract/css';

export const homePage = style({
  width: '100%',
  height: '100%',
  backgroundColor: '#0a0a0a',
});

export const homePageContent = style({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '48px 24px',
});

export const homePageTitle = style({
  fontSize: '48px',
  fontWeight: 700,
  color: '#fff',
  marginBottom: '16px',
  textAlign: 'center',
});

export const homePageDescription = style({
  fontSize: '20px',
  color: '#888',
  marginBottom: '64px',
  textAlign: 'center',
});

export const homePageFeatures = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
});

export const homePageFeatureCard = style({
  backgroundColor: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '12px',
  padding: '32px',
  transition: 'all 0.3s ease',
  ':hover': {
    borderColor: '#4a9eff',
    transform: 'translateY(-4px)',
  },
});

export const homePageFeatureIcon = style({
  fontSize: '48px',
  display: 'block',
  marginBottom: '16px',
});

export const homePageFeatureTitle = style({
  fontSize: '24px',
  fontWeight: 600,
  color: '#fff',
  marginBottom: '12px',
});

export const homePageFeatureText = style({
  fontSize: '16px',
  color: '#888',
  lineHeight: 1.6,
});
