// src/shared/styles/typography.css.ts
import { style } from '@vanilla-extract/css';

import { fontSize, fontWeight, lineHeight, colors } from './tokens.css';

export const heading1 = style({
  fontSize: fontSize['4xl'], // 3.6rem (36px)
  fontWeight: fontWeight.bold,
  lineHeight: lineHeight.tight,
  color: colors.neutral[900],
});

export const heading2 = style({
  fontSize: fontSize['3xl'], // 3rem (30px)
  fontWeight: fontWeight.bold,
  lineHeight: lineHeight.tight,
  color: colors.neutral[900],
});

export const heading3 = style({
  fontSize: fontSize['2xl'], // 2.4rem (24px)
  fontWeight: fontWeight.semibold,
  lineHeight: lineHeight.tight,
  color: colors.neutral[900],
});

export const heading4 = style({
  fontSize: fontSize.xl, // 2rem (20px)
  fontWeight: fontWeight.semibold,
  lineHeight: lineHeight.normal,
  color: colors.neutral[900],
});

export const bodyLarge = style({
  fontSize: fontSize.lg, // 1.8rem (18px)
  fontWeight: fontWeight.normal,
  lineHeight: lineHeight.normal,
  color: colors.neutral[700],
});

export const body = style({
  fontSize: fontSize.base, // 1.6rem (16px)
  fontWeight: fontWeight.normal,
  lineHeight: lineHeight.normal,
  color: colors.neutral[700],
});

export const bodySmall = style({
  fontSize: fontSize.sm, // 1.4rem (14px)
  fontWeight: fontWeight.normal,
  lineHeight: lineHeight.normal,
  color: colors.neutral[600],
});

export const caption = style({
  fontSize: fontSize.xs, // 1.2rem (12px)
  fontWeight: fontWeight.normal,
  lineHeight: lineHeight.normal,
  color: colors.neutral[500],
});

export const label = style({
  fontSize: fontSize.sm, // 1.4rem (14px)
  fontWeight: fontWeight.medium,
  lineHeight: lineHeight.normal,
  color: colors.neutral[700],
});

export const link = style({
  fontSize: fontSize.base,
  fontWeight: fontWeight.medium,
  color: colors.primary[500],
  textDecoration: 'underline',
  cursor: 'pointer',

  ':hover': {
    color: colors.primary[600],
  },
});
