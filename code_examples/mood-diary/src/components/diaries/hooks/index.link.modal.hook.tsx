'use client';

import { useCallback } from 'react';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { useAuthGuard } from '@/commons/providers/auth/auth.guard.hook';
import DiariesNew from '@/components/diaries-new';

/**
 * 일기 모달 링크 훅
 * 
 * 일기 작성 모달을 열고 닫는 기능을 제공합니다.
 * 기존의 modal provider를 활용하여 DiariesNew 컴포넌트를 모달로 표시합니다.
 * 권한 검사를 통해 로그인하지 않은 사용자에게는 로그인 모달을 표시합니다.
 * 
 * @returns {object} 모달 제어 함수들
 */
export const useDiaryModalLink = () => {
  const { openModal, closeModal, isOpen } = useModal();
  const { withAuth } = useAuthGuard();

  /**
   * 일기 작성 모달을 엽니다.
   * DiariesNew 컴포넌트를 모달 콘텐츠로 설정하고 data-testid를 추가합니다.
   * 권한 검사를 통해 로그인하지 않은 사용자에게는 로그인 모달을 먼저 표시합니다.
   */
  const openDiaryModal = useCallback(() => {
    // 권한 검사 후 일기 작성 모달 열기
    withAuth(() => {
      const modalContent = (
        <div data-testid="diary-modal">
          <DiariesNew />
        </div>
      );
      openModal(modalContent);
    });
  }, [openModal, withAuth]);

  /**
   * 일기 작성 모달을 닫습니다.
   */
  const closeDiaryModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return {
    openDiaryModal,
    closeDiaryModal,
    isModalOpen: isOpen,
  };
};
