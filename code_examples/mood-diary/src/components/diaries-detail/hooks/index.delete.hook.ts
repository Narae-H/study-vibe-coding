import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { URL_PATH } from '@/commons/constants/url';
import { EmotionType } from '@/commons/constants/enum';

/**
 * 일기 데이터 인터페이스
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 삭제 훅 반환 타입
 */
export interface UseDeleteReturn {
  // 삭제 확인 함수
  handleDeleteConfirm: () => void;
}

/**
 * 일기 삭제 훅
 * 
 * 로컬스토리지에서 일기를 삭제하며,
 * 삭제 완료 후 일기 목록 페이지로 이동하는 기능을 제공
 * 
 * @param diaryId - 삭제할 일기 ID
 * @returns 삭제 확인 핸들러
 */
export const useDelete = (diaryId: string): UseDeleteReturn => {
  const router = useRouter();

  /**
   * 로컬스토리지에서 일기를 삭제하는 함수
   */
  const deleteDiaryFromStorage = useCallback((id: string): boolean => {
    try {
      // 로컬스토리지에서 diaries 키의 데이터 조회
      const diariesData = localStorage.getItem('diaries');
      
      if (!diariesData) {
        return false;
      }

      // JSON 파싱
      const diaries: DiaryData[] = JSON.parse(diariesData);
      
      if (!Array.isArray(diaries)) {
        return false;
      }

      // ID가 일치하는 일기를 제외한 나머지 일기들
      const targetId = parseInt(id, 10);
      const filteredDiaries = diaries.filter(diary => diary.id !== targetId);
      
      // 로컬스토리지에 저장
      localStorage.setItem('diaries', JSON.stringify(filteredDiaries));
      
      return true;
    } catch (error) {
      console.error('일기 삭제 중 오류 발생:', error);
      return false;
    }
  }, []);

  /**
   * 삭제 확인 처리
   */
  const handleDeleteConfirm = useCallback(() => {
    // 로컬스토리지에서 일기 삭제
    const success = deleteDiaryFromStorage(diaryId);
    
    if (success) {
      // 일기 목록 페이지로 이동
      router.push(URL_PATH.DIARIES.LIST);
    } else {
      // 삭제 실패 시
      alert('일기 삭제에 실패했습니다.');
    }
  }, [diaryId, deleteDiaryFromStorage, router]);

  return {
    handleDeleteConfirm
  };
};

