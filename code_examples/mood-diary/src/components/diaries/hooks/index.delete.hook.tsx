'use client';

import React, { useCallback, useState } from 'react';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { useAuthGuard } from '@/commons/providers/auth/auth.guard.hook';
import { DeleteModal } from '../components/DeleteModal';

/**
 * 일기 삭제 훅 반환 타입
 */
interface UseDiaryDeleteReturn {
  /**
   * 삭제 모달 열기 (권한 검증 포함)
   * @param diaryId - 삭제할 일기 ID
   */
  openDeleteModal: (diaryId: number | string) => void;
  
  /**
   * 삭제 모달이 열려있는지 여부
   */
  isDeleteModalOpen: boolean;
  
  /**
   * 현재 삭제 대상 일기 ID
   */
  deletingDiaryId: number | string | null;
}

/**
 * 일기 삭제 훅
 * 
 * 일기 삭제 기능을 제공하는 커스텀 훅입니다.
 * - 권한 검증 (auth.guard 사용)
 * - 삭제 모달 관리
 * - 로컬스토리지에서 일기 삭제
 * - 페이지 새로고침
 * 
 * @returns 일기 삭제 관련 함수 및 상태
 */
export const useDiaryDelete = (): UseDiaryDeleteReturn => {
  const { openModal, closeModal } = useModal();
  const { withAuth } = useAuthGuard();
  
  // 삭제 모달 상태 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDiaryId, setDeletingDiaryId] = useState<number | string | null>(null);

  /**
   * 삭제 모달 열기
   * 권한 검증 후 삭제 모달을 표시합니다.
   * 
   * @param diaryId - 삭제할 일기 ID
   */
  const openDeleteModal = useCallback((diaryId: number | string) => {
    // 권한 검증
    withAuth(() => {
      setDeletingDiaryId(diaryId);
      setIsDeleteModalOpen(true);
      
      // 삭제 모달 컨텐츠 생성
      const modalIdRef = openModal(
        <DeleteModal 
          onCancel={() => {
            closeModal(modalIdRef);
            setIsDeleteModalOpen(false);
            setDeletingDiaryId(null);
          }}
          onDelete={() => {
            // 1. 로컬스토리지에서 일기 데이터 가져오기
            const diariesData = localStorage.getItem('diaries');
            if (!diariesData) return;
            
            try {
              const diaries = JSON.parse(diariesData);
              
              // 2. 해당 ID의 일기를 제외한 배열 생성
              interface Diary {
                id: number;
              }
              const filteredDiaries = diaries.filter((diary: Diary) => diary.id !== Number(diaryId));
              
              // 3. 로컬스토리지에 저장
              localStorage.setItem('diaries', JSON.stringify(filteredDiaries));
              
              // 4. 모달 닫기
              closeModal(modalIdRef);
              setIsDeleteModalOpen(false);
              setDeletingDiaryId(null);
              
              // 5. 페이지 새로고침
              window.location.reload();
            } catch (error) {
              console.error('일기 삭제 중 오류 발생:', error);
            }
          }}
        />
      );
    });
  }, [withAuth, openModal, closeModal]);

  return {
    openDeleteModal,
    isDeleteModalOpen,
    deletingDiaryId,
  };
};

