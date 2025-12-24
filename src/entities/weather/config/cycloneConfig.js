// src/entities/weather/config/cycloneConfigs.js

/**
 * Cyclone 카테고리 설정 (JTWC 기준)
 */
export const CYCLONE_CATEGORIES = {
  STY: {
    vessellinkCycloneCode: 'TY',
    name: 'Super Typhoon',
    color: [139, 0, 0, 255], // Dark red
    icon: '🌀',
  },
  TY: {
    vessellinkCycloneCode: 'TY',
    name: 'Typhoon',
    color: [220, 20, 60, 255], // Crimson
    icon: '🌀',
  },
  TC: {
    vessellinkCycloneCode: 'TY',
    name: 'Tropical Cyclone',
    color: [255, 69, 0, 255], // Red-orange
    icon: '🌀',
  },
  H: {
    vessellinkCycloneCode: 'H',
    name: 'Hurricane',
    color: [255, 0, 0, 255], // Red
    icon: '🌪️',
  },
  TS: {
    vessellinkCycloneCode: 'TS',
    name: 'Tropical Storm',
    color: [255, 165, 0, 255], // Orange
    icon: '⛈️',
  },
  SS: {
    vessellinkCycloneCode: 'SS',
    name: 'Subtropical Storm',
    color: [255, 215, 0, 255], // Gold
    icon: '🌩️',
  },
  TD: {
    vessellinkCycloneCode: 'TD',
    name: 'Tropical Depression',
    color: [173, 216, 230, 255], // Light blue
    icon: '☁️',
  },
  SD: {
    vessellinkCycloneCode: 'SD',
    name: 'Subtropical Depression',
    color: [135, 206, 250, 255], // Light sky blue
    icon: '☁️',
  },
  EX: {
    vessellinkCycloneCode: 'EX',
    name: 'Extra Tropical',
    color: [176, 196, 222, 255], // Light steel blue
    icon: '🌀',
  },
  LO: {
    vessellinkCycloneCode: 'LO',
    name: 'Post Tropical',
    color: [169, 169, 169, 255], // Dark gray
    icon: '🌀',
  },
  WV: {
    vessellinkCycloneCode: 'WV',
    name: 'Tropical Wave',
    color: [144, 238, 144, 255], // Light green
    icon: '〰️',
  },
  I: {
    vessellinkCycloneCode: 'I',
    name: 'Invest',
    color: [211, 211, 211, 255], // Light gray
    icon: '❓',
  },
  DB: {
    vessellinkCycloneCode: 'DB',
    name: 'Disturbance',
    color: [192, 192, 192, 255], // Silver
    icon: '❔',
  },
};

/**
 * Cyclone 카테고리별 색상 가져오기
 */
export function getCycloneCategoryColor(category) {
  return CYCLONE_CATEGORIES[category]?.color || [150, 150, 150, 255];
}

/**
 * Cyclone 카테고리별 아이콘 가져오기
 */
export function getCycloneCategoryIcon(category) {
  return CYCLONE_CATEGORIES[category]?.icon || '🌀';
}
