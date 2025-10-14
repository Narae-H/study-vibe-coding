/**
 * Typography Foundation
 * 
 * Figma Foundation에서 정의된 타이포그래피 시스템
 * 모바일과 데스크톱, 한글과 영문을 토큰화하여 사용
 */

// 타이포그래피 토큰 타입 정의
export interface TypographyToken {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

// Font Family
export const fontFamily = {
  ko: 'Pretendard',
  en: 'SUIT Variable',
} as const;

// Web Headline (데스크톱용)
export const webHeadline = {
  headline01: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 48,
    lineHeight: 60,
    letterSpacing: 0,
  },
  headline02: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 36,
    lineHeight: 48,
    letterSpacing: 0,
  },
  headline03: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
} as const;

// Headline (모바일용)
export const headline = {
  headline01: {
    fontFamily: fontFamily.ko,
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  headline02: {
    fontFamily: fontFamily.ko,
    fontWeight: 800,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: 0,
  },
  headline03: {
    fontFamily: fontFamily.ko,
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
} as const;

// Title
export const title = {
  title01: {
    fontFamily: fontFamily.ko,
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  title02: {
    fontFamily: fontFamily.ko,
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  title03: {
    fontFamily: fontFamily.ko,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  subtitle01: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  subtitle02: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
} as const;

// Body
export const body = {
  body01_m: {
    fontFamily: fontFamily.ko,
    fontWeight: 500,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body02_m: {
    fontFamily: fontFamily.ko,
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
  },
  body03: {
    fontFamily: fontFamily.ko,
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  body01: {
    fontFamily: fontFamily.ko,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
  },
  body02_s: {
    fontFamily: fontFamily.ko,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  body03_regular: {
    fontFamily: fontFamily.ko,
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
} as const;

// Caption
export const caption = {
  caption01: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
  },
  caption02_m: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0,
  },
  caption02_s: {
    fontFamily: fontFamily.ko,
    fontWeight: 500,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0,
  },
  caption03: {
    fontFamily: fontFamily.ko,
    fontWeight: 600,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 0,
  },
} as const;

// 영문/숫자 전용 타이포그래피
export const enTypography = {
  ...Object.entries(webHeadline).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: { ...value, fontFamily: fontFamily.en }
  }), {}),
  ...Object.entries(headline).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: { ...value, fontFamily: fontFamily.en }
  }), {}),
  ...Object.entries(title).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: { ...value, fontFamily: fontFamily.en }
  }), {}),
  ...Object.entries(body).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: { ...value, fontFamily: fontFamily.en }
  }), {}),
  ...Object.entries(caption).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: { ...value, fontFamily: fontFamily.en }
  }), {}),
} as const;

// 모든 타이포그래피 토큰 통합
export const typography = {
  webHeadline,
  headline,
  title,
  body,
  caption,
} as const;

// CSS 변수 생성 헬퍼 함수
export const generateTypographyCSS = (token: TypographyToken): string => {
  return `
    font-family: ${token.fontFamily};
    font-weight: ${token.fontWeight};
    font-size: ${token.fontSize}px;
    line-height: ${token.lineHeight}px;
    letter-spacing: ${token.letterSpacing}px;
  `.trim();
};

// Tailwind CSS에서 사용할 수 있는 타이포그래피 클래스명 매핑
export const typographyClasses = {
  // Web Headline
  'web-headline-01': webHeadline.headline01,
  'web-headline-02': webHeadline.headline02,
  'web-headline-03': webHeadline.headline03,
  
  // Headline
  'headline-01': headline.headline01,
  'headline-02': headline.headline02,
  'headline-03': headline.headline03,
  
  // Title
  'title-01': title.title01,
  'title-02': title.title02,
  'title-03': title.title03,
  'subtitle-01': title.subtitle01,
  'subtitle-02': title.subtitle02,
  
  // Body
  'body-01-m': body.body01_m,
  'body-02-m': body.body02_m,
  'body-03': body.body03,
  'body-01': body.body01,
  'body-02-s': body.body02_s,
  'body-03-regular': body.body03_regular,
  
  // Caption
  'caption-01': caption.caption01,
  'caption-02-m': caption.caption02_m,
  'caption-02-s': caption.caption02_s,
  'caption-03': caption.caption03,
} as const;

export type TypographyClass = keyof typeof typographyClasses;

// 반응형 타이포그래피 (모바일/데스크톱 분기)
export const responsiveTypography = {
  // 큰 헤드라인: 데스크톱에서 web headline, 모바일에서 headline
  largeHeading: {
    mobile: headline.headline01,
    desktop: webHeadline.headline01,
  },
  mediumHeading: {
    mobile: headline.headline02,
    desktop: webHeadline.headline02,
  },
  smallHeading: {
    mobile: headline.headline03,
    desktop: webHeadline.headline03,
  },
} as const;

