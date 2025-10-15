/**
 * Enum Foundation
 * 
 * 프로젝트에서 사용되는 열거형(enum) 타입들
 */

import { red, blue, gray, yellow, green } from './color';

/**
 * 감정 타입 Enum
 */
export enum EmotionType {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  SURPRISE = 'SURPRISE',
  ETC = 'ETC',
}

/**
 * 감정 데이터 인터페이스
 */
interface EmotionData {
  label: string;
  image: {
    medium: string;
    small: string;
  };
  color: string;
}

/**
 * 감정별 상세 데이터
 */
export const EMOTION_DATA: Record<EmotionType, EmotionData> = {
  [EmotionType.HAPPY]: {
    label: '행복해요',
    image: {
      medium: '/images/emotion-happy-m.png',
      small: '/images/emotion-happy-s.png',
    },
    color: red[60],
  },
  [EmotionType.SAD]: {
    label: '슬퍼요',
    image: {
      medium: '/images/emotion-sad-m.png',
      small: '/images/emotion-sad-s.png',
    },
    color: blue[60],
  },
  [EmotionType.ANGRY]: {
    label: '화나요',
    image: {
      medium: '/images/emotion-angry-m.png',
      small: '/images/emotion-angry-s.png',
    },
    color: gray[60],
  },
  [EmotionType.SURPRISE]: {
    label: '놀랐어요',
    image: {
      medium: '/images/emotion-surprise-m.png',
      small: '/images/emotion-surprise-s.png',
    },
    color: yellow[60],
  },
  [EmotionType.ETC]: {
    label: '기타',
    image: {
      medium: '/images/emotion-etc-m.png',
      small: '/images/emotion-etc-s.png',
    },
    color: green[60],
  },
} as const;

/**
 * 감정 타입 배열 (순서 보장)
 */
export const EMOTION_LIST = [
  EmotionType.HAPPY,
  EmotionType.SAD,
  EmotionType.ANGRY,
  EmotionType.SURPRISE,
  EmotionType.ETC,
] as const;

/**
 * 감정 타입별 라벨 가져오기
 */
export const getEmotionLabel = (emotion: EmotionType): string => {
  return EMOTION_DATA[emotion].label;
};

/**
 * 감정 타입별 이미지 경로 가져오기
 */
export const getEmotionImage = (
  emotion: EmotionType,
  size: 'medium' | 'small' = 'medium'
): string => {
  return EMOTION_DATA[emotion].image[size];
};

/**
 * 감정 타입별 색상 가져오기
 */
export const getEmotionColor = (emotion: EmotionType): string => {
  return EMOTION_DATA[emotion].color;
};

