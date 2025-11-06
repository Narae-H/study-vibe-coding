'use client';

import { useState, useEffect } from 'react';

import { EmotionType, EMOTION_DATA } from '@/commons/constants/enum';

/**
 * 로컬스토리지에 저장된 일기 데이터 타입
 */
export interface StoredDiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * UI에 표시될 일기 데이터 타입 (기존 DiaryEntry와 호환)
 */
export interface DiaryEntry {
  id: string;
  emotion: EmotionType;
  date: string;
  title: string;
  image: string;
}

/**
 * 날짜를 UI 표시 형식으로 변환
 * @param dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns YYYY. MM. DD 형식의 날짜 문자열
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  } catch {
    // 날짜 파싱 실패 시 원본 반환
    return dateString;
  }
};

/**
 * 저장된 일기 데이터를 UI 표시용 데이터로 변환
 * @param storedData - 로컬스토리지에서 읽은 원본 데이터
 * @returns UI 표시용으로 변환된 데이터
 */
const transformDiaryData = (storedData: StoredDiaryData): DiaryEntry => {
  const emotionData = EMOTION_DATA[storedData.emotion];
  
  return {
    id: String(storedData.id),
    emotion: storedData.emotion,
    date: formatDate(storedData.createdAt),
    title: storedData.title,
    image: emotionData.imageMedium
  };
};

/**
 * 로컬스토리지에서 일기 데이터를 바인딩하는 훅
 * 
 * Mock 데이터를 제거하고 실제 로컬스토리지의 'diaries' 키에서 
 * 일기 데이터를 읽어와 UI에 표시할 수 있는 형태로 변환합니다.
 * 
 * @returns 일기 데이터와 관련 상태 객체
 * - diaries: UI 표시용 일기 데이터 배열  
 * - loading: 데이터 로딩 상태
 * - error: 에러 메시지 (에러가 없으면 null)
 * - refresh: 데이터 새로고침 함수
 */
export const useDiaryBinding = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 일기 데이터를 로드하는 함수
   */
  const loadDiaries = () => {
    try {
      setLoading(true);
      setError(null);

      // 로컬스토리지에서 'diaries' 키 데이터 읽기
      const storedData = localStorage.getItem('diaries');
      
      if (!storedData) {
        // 데이터가 없는 경우 빈 배열 설정
        setDiaries([]);
        return;
      }

      // JSON 파싱 및 타입 검증
      const parsedData: StoredDiaryData[] = JSON.parse(storedData);
      
      // 데이터가 배열인지 확인
      if (!Array.isArray(parsedData)) {
        throw new Error('저장된 일기 데이터가 올바른 형식이 아닙니다.');
      }

      // 각 일기 데이터의 필수 필드 검증 및 변환
      const transformedDiaries: DiaryEntry[] = parsedData
        .filter((item): item is StoredDiaryData => {
          // 필수 필드 존재 여부 확인
          return (
            typeof item.id === 'number' &&
            typeof item.title === 'string' &&
            typeof item.content === 'string' &&
            typeof item.emotion === 'string' &&
            typeof item.createdAt === 'string' &&
            Object.values(EmotionType).includes(item.emotion as EmotionType)
          );
        })
        .map(transformDiaryData)
        .sort((a, b) => {
          // id 기준으로 오름차순 정렬
          return Number(a.id) - Number(b.id);
        });

      setDiaries(transformedDiaries);

    } catch (err) {
      console.error('일기 데이터 로딩 중 오류 발생:', err);
      setError('일기 데이터를 불러오는데 실패했습니다.');
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로컬스토리지 변경 감지 및 자동 새로고침
   */
  useEffect(() => {
    // 초기 로드
    loadDiaries();

    // 로컬스토리지 변경 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'diaries') {
        loadDiaries();
      }
    };

    // 같은 탭에서의 프로그래밍적 로컬스토리지 변경 감지
    const handleDiariesUpdate = () => {
      loadDiaries();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('diaries-updated', handleDiariesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('diaries-updated', handleDiariesUpdate);
    };
  }, []);

  /**
   * 수동으로 데이터를 새로고침하는 함수
   */
  const refresh = () => {
    loadDiaries();
  };

  return {
    diaries,
    loading,
    error,
    refresh
  };
};

/**
 * 로컬스토리지의 일기 데이터가 업데이트되었음을 알리는 헬퍼 함수
 * 일기 추가/수정/삭제 후 호출하여 컴포넌트 자동 새로고침 트리거
 */
export const notifyDiariesUpdate = () => {
  window.dispatchEvent(new CustomEvent('diaries-updated'));
};
