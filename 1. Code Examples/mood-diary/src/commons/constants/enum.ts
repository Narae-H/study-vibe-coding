/**
 * Enum Foundation
 * 
 * 프로젝트에서 사용되는 enum 데이터
 * 감정(emotion) 등의 카테고리 정보를 토큰화하여 사용
 */

import { red, blue, gray, yellow, green } from './color';

// Emotion 타입 정의
export type EmotionType = 'HAPPY' | 'SAD' | 'ANGRY' | 'SURPRISE' | 'ETC';

// Emotion 데이터 인터페이스
export interface EmotionData {
  key: EmotionType;
  label: string;
  images: {
    medium: string;
    small: string;
  };
  color: string;
}

// Emotion enum 데이터
export const EMOTION: Record<EmotionType, EmotionData> = {
  HAPPY: {
    key: 'HAPPY',
    label: '행복해요',
    images: {
      medium: '/icons/emotion-happy-m.svg',
      small: '/icons/emotion-happy-s.svg',
    },
    color: red[60],
  },
  SAD: {
    key: 'SAD',
    label: '슬퍼요',
    images: {
      medium: '/icons/emotion-sad-m.svg',
      small: '/icons/emotion-sad-s.svg',
    },
    color: blue[60],
  },
  ANGRY: {
    key: 'ANGRY',
    label: '화나요',
    images: {
      medium: '/icons/emotion-angry-m.svg',
      small: '/icons/emotion-angry-s.svg',
    },
    color: gray[60],
  },
  SURPRISE: {
    key: 'SURPRISE',
    label: '놀랐어요',
    images: {
      medium: '/icons/emotion-surprise-m.svg',
      small: '/icons/emotion-surprise-s.svg',
    },
    color: yellow[60],
  },
  ETC: {
    key: 'ETC',
    label: '기타',
    images: {
      medium: '/icons/emotion-etc-m.svg',
      small: '/icons/emotion-etc-s.svg',
    },
    color: green[60],
  },
} as const;

// Emotion 배열 (순회용)
export const EMOTION_LIST: EmotionData[] = [
  EMOTION.HAPPY,
  EMOTION.SAD,
  EMOTION.ANGRY,
  EMOTION.SURPRISE,
  EMOTION.ETC,
] as const;

// Emotion key 배열
export const EMOTION_KEYS: EmotionType[] = [
  'HAPPY',
  'SAD',
  'ANGRY',
  'SURPRISE',
  'ETC',
] as const;

// 유틸리티 함수: key로 emotion 데이터 가져오기
export const getEmotionByKey = (key: EmotionType): EmotionData => {
  return EMOTION[key];
};

// 유틸리티 함수: label로 emotion 데이터 찾기
export const getEmotionByLabel = (label: string): EmotionData | undefined => {
  return EMOTION_LIST.find((emotion) => emotion.label === label);
};

