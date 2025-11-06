'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { URL_PATH } from '@/commons/constants/url';

/**
 * 일기 링크 라우팅 훅
 * 
 * 일기 카드 클릭시 상세 페이지로 이동하는 기능을 제공합니다.
 * URL 경로는 하드코딩하지 않고 URL_PATH 상수를 사용합니다.
 * 
 * @returns {object} 일기 링크 라우팅 관련 함수들
 */
export const useDiaryLinkRouting = () => {
  const router = useRouter();

  /**
   * 일기 카드 클릭 핸들러
   * 해당 일기의 상세 페이지로 이동합니다.
   * 
   * @param diaryId - 이동할 일기의 ID
   */
  const handleDiaryCardClick = useCallback((diaryId: number | string) => {
    router.push(URL_PATH.DIARIES.DETAIL(diaryId));
  }, [router]);

  /**
   * 삭제 버튼 클릭 핸들러
   * 이벤트 전파를 막아 카드 클릭 이벤트가 발생하지 않도록 합니다.
   * 
   * @param event - 마우스 클릭 이벤트
   * @param diaryId - 삭제할 일기의 ID
   */
  const handleDeleteButtonClick = useCallback((
    event: React.MouseEvent, 
    diaryId: number | string
  ) => {
    event.stopPropagation(); // 카드 클릭 이벤트 방지
    
    // TODO: 일기 삭제 로직 구현
    console.log('일기 삭제:', diaryId);
  }, []);

  return {
    handleDiaryCardClick,
    handleDeleteButtonClick,
  };
};
