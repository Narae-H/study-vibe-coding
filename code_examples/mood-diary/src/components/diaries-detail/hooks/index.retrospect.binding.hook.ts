import { useState, useEffect } from 'react';

/**
 * 회고 데이터 인터페이스
 */
interface Retrospect {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 바인딩 Hook
 * 
 * 목적: 로컬스토리지에서 특정 일기 ID에 해당하는 회고 목록을 가져옴
 * 
 * @param diaryId - 일기 ID
 * @returns retrospects - 해당 일기에 대한 회고 목록
 */
export const useRetrospectBinding = (diaryId: string) => {
  const [retrospects, setRetrospects] = useState<Retrospect[]>([]);

  useEffect(() => {
    // 로컬스토리지에서 retrospects 데이터 가져오기
    const storedRetrospects = localStorage.getItem('retrospects');
    
    if (!storedRetrospects) {
      setRetrospects([]);
      return;
    }

    try {
      const allRetrospects: Retrospect[] = JSON.parse(storedRetrospects);
      
      // diaryId가 일치하는 회고만 필터링
      const filteredRetrospects = allRetrospects.filter(
        (retrospect) => retrospect.diaryId === Number(diaryId)
      );
      
      setRetrospects(filteredRetrospects);
    } catch (error) {
      console.error('회고 데이터 파싱 실패:', error);
      setRetrospects([]);
    }
  }, [diaryId]);

  return { retrospects };
};

