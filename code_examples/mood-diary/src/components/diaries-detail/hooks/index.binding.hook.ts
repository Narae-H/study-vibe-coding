import { useState, useEffect } from 'react';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 상세 데이터 인터페이스
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 바인딩 훅 반환 타입
 */
interface UseBindingReturn {
  diary: DiaryData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 일기 상세 데이터 바인딩 훅
 * 
 * 로컬스토리지에서 지정된 ID의 일기 데이터를 조회하여 반환
 * 
 * @param id - 조회할 일기의 ID
 * @returns 일기 데이터, 로딩 상태, 에러 정보
 */
export const useBinding = (id: string): UseBindingReturn => {
  // 상태 관리
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 일기 데이터를 조회하는 함수
   */
  const fetchDiaryData = (diaryId: string): DiaryData | null => {
    try {
      // 로컬스토리지에서 diaries 키의 데이터 조회
      const diariesData = localStorage.getItem('diaries');
      
      if (!diariesData) {
        return null;
      }

      // JSON 파싱
      const diaries: DiaryData[] = JSON.parse(diariesData);
      
      if (!Array.isArray(diaries)) {
        return null;
      }

      // ID가 일치하는 일기 찾기 (문자열 ID를 숫자로 변환하여 비교)
      const targetId = parseInt(diaryId, 10);
      const foundDiary = diaries.find(diary => diary.id === targetId);
      
      return foundDiary || null;
    } catch (error) {
      console.error('일기 데이터 조회 중 오류 발생:', error);
      return null;
    }
  };

  /**
   * 일기 데이터 로딩 효과
   */
  useEffect(() => {
    // 로딩 시작
    setIsLoading(true);
    setError(null);

    try {
      // ID 유효성 검사
      if (!id || isNaN(parseInt(id, 10))) {
        setError('유효하지 않은 일기 ID입니다.');
        setDiary(null);
        setIsLoading(false);
        return;
      }

      // 일기 데이터 조회
      const diaryData = fetchDiaryData(id);
      
      if (diaryData) {
        setDiary(diaryData);
        setError(null);
      } else {
        setDiary(null);
        setError('해당 ID의 일기를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('일기 데이터 로딩 중 오류:', error);
      setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
      setDiary(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return {
    diary,
    isLoading,
    error
  };
};


