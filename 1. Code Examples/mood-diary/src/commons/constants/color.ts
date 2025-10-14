/**
 * Color Foundation
 * 
 * Figma Foundation에서 정의된 컬러 시스템
 * 다크모드를 포함한 모든 경우에 컬러를 토큰화하여 사용
 */

// Blue 컬러 팔레트
export const blue = {
  5: '#F0F7FF',
  10: '#DBEEFF',
  20: '#BDDBFF',
  30: '#93BEFF',
  40: '#6DA5FA',
  50: '#497CFF',
  60: '#3A5CF3',
  70: '#274AE1',
  80: '#1530A6',
  90: '#0B2184',
} as const;

// Gray 컬러 팔레트
export const gray = {
  white: '#FFFFFF',
  5: '#F2F2F2',
  10: '#E4E4E4',
  20: '#D4D3D3',
  30: '#C7C7C7',
  40: '#ABABAB',
  50: '#919191',
  60: '#777777',
  70: '#5F5F5F',
  80: '#333333',
  90: '#1C1C1C',
  black: '#000000',
} as const;

// Red 컬러 팔레트 (Error)
export const red = {
  5: '#FDD7DC',
  10: '#F797A4',
  20: '#F4677A',
  30: '#F03851',
  40: '#E4112E',
  50: '#B40E24',
  60: '#850A1B',
} as const;

// Green 컬러 팔레트 (Success)
export const green = {
  5: '#D3F3E0',
  10: '#92E6B9',
  20: '#15D66F',
  30: '#12B75F',
  40: '#109C51',
  50: '#0E723C',
  60: '#084424',
} as const;

// Yellow 컬러 팔레트 (Warning)
export const yellow = {
  5: '#FFE499',
  10: '#FFD666',
  20: '#FFC933',
  30: '#FFB300',
  40: '#EBA500',
  50: '#D69600',
  60: '#B27D00',
} as const;

// Cool Gray 컬러 팔레트
export const coolGray = {
  1: '#F8F8FA',
  5: '#F6F6F9',
  10: '#EDEEF2',
  20: '#DDDFE5',
  30: '#D2D4DD',
  40: '#C7C9D5',
  50: '#BBBECD',
  60: '#B0B3C4',
} as const;

// Gradient 정의
export const gradient = {
  primary: 'linear-gradient(135deg, #6DA5FA 0%, #92EAF5 100%)',
  skeleton: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 48.5%, transparent 100%)',
} as const;

// 시맨틱 컬러 (용도별)
export const semantic = {
  // 시스템 컬러
  primary: blue[60],
  primaryLight: blue[40],
  
  // 상태 컬러
  error: red[30],
  success: green[30],
  warning: yellow[30],
  
  // 텍스트 컬러 (라이트 모드)
  textPrimary: gray.black,
  textSecondary: gray[60],
  textTertiary: gray[40],
  textDisabled: gray[30],
  
  // 배경 컬러 (라이트 모드)
  backgroundPrimary: gray.white,
  backgroundSecondary: gray[5],
  backgroundTertiary: gray[10],
  
  // 보더 컬러 (라이트 모드)
  borderPrimary: gray[20],
  borderSecondary: gray[10],
} as const;

// 다크 모드 시맨틱 컬러
export const semanticDark = {
  // 텍스트 컬러 (다크 모드)
  textPrimary: gray.white,
  textSecondary: gray[40],
  textTertiary: gray[50],
  textDisabled: gray[60],
  
  // 배경 컬러 (다크 모드)
  backgroundPrimary: gray.black,
  backgroundSecondary: gray[90],
  backgroundTertiary: gray[80],
  
  // 보더 컬러 (다크 모드)
  borderPrimary: gray[70],
  borderSecondary: gray[80],
} as const;

// CSS 변수명 매핑 (Tailwind 및 CSS에서 사용)
export const cssVars = {
  // Blue
  'blue-5': blue[5],
  'blue-10': blue[10],
  'blue-20': blue[20],
  'blue-30': blue[30],
  'blue-40': blue[40],
  'blue-50': blue[50],
  'blue-60': blue[60],
  'blue-70': blue[70],
  'blue-80': blue[80],
  'blue-90': blue[90],
  
  // Gray
  'gray-white': gray.white,
  'gray-5': gray[5],
  'gray-10': gray[10],
  'gray-20': gray[20],
  'gray-30': gray[30],
  'gray-40': gray[40],
  'gray-50': gray[50],
  'gray-60': gray[60],
  'gray-70': gray[70],
  'gray-80': gray[80],
  'gray-90': gray[90],
  'gray-black': gray.black,
  
  // Red
  'red-5': red[5],
  'red-10': red[10],
  'red-20': red[20],
  'red-30': red[30],
  'red-40': red[40],
  'red-50': red[50],
  'red-60': red[60],
  
  // Green
  'green-5': green[5],
  'green-10': green[10],
  'green-20': green[20],
  'green-30': green[30],
  'green-40': green[40],
  'green-50': green[50],
  'green-60': green[60],
  
  // Yellow
  'yellow-5': yellow[5],
  'yellow-10': yellow[10],
  'yellow-20': yellow[20],
  'yellow-30': yellow[30],
  'yellow-40': yellow[40],
  'yellow-50': yellow[50],
  'yellow-60': yellow[60],
  
  // Cool Gray
  'cool-gray-1': coolGray[1],
  'cool-gray-5': coolGray[5],
  'cool-gray-10': coolGray[10],
  'cool-gray-20': coolGray[20],
  'cool-gray-30': coolGray[30],
  'cool-gray-40': coolGray[40],
  'cool-gray-50': coolGray[50],
  'cool-gray-60': coolGray[60],
  
  // Semantic
  'primary': semantic.primary,
  'primary-light': semantic.primaryLight,
  'error': semantic.error,
  'success': semantic.success,
  'warning': semantic.warning,
} as const;

export type ColorToken = keyof typeof cssVars;



