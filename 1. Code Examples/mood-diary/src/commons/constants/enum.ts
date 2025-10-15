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
  imageMedium: string;
  imageSmall: string;
  color: string;
}

/**
 * 감정별 상세 데이터
 */
export const EMOTION_DATA: Record<EmotionType, EmotionData> = {
  [EmotionType.HAPPY]: {
    label: '행복해요',
    imageMedium: '/images/emotion-happy-m.png',
    imageSmall: '/images/emotion-happy-s.png',
    color: red[60],
  },
  [EmotionType.SAD]: {
    label: '슬퍼요',
    imageMedium: '/images/emotion-sad-m.png',
    imageSmall: '/images/emotion-sad-s.png',
    color: blue[60],
  },
  [EmotionType.ANGRY]: {
    label: '화나요',
    imageMedium: '/images/emotion-angry-m.png',
    imageSmall: '/images/emotion-angry-s.png',
    color: gray[60],
  },
  [EmotionType.SURPRISE]: {
    label: '놀랐어요',
    imageMedium: '/images/emotion-surprise-m.png',
    imageSmall: '/images/emotion-surprise-s.png',
    color: yellow[60],
  },
  [EmotionType.ETC]: {
    label: '기타',
    imageMedium: '/images/emotion-etc-m.png',
    imageSmall: '/images/emotion-etc-s.png',
    color: green[60],
  },
} as const;
