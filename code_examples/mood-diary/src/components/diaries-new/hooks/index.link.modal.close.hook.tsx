'use client';

import { useCallback } from 'react';
import { useModal } from '../../../commons/providers/modal/modal.provider';
import { Modal } from '../../../commons/components/modal';

/**
 * 일기쓰기 모달의 닫기 버튼 동작을 관리하는 커스텀 훅
 * 
 * 사용자가 일기 작성을 취소하려고 할 때 확인 모달을 표시하고,
 * 사용자의 선택에 따라 모달을 개별적으로 또는 전체적으로 닫습니다.
 * 
 * @returns {object} 모달 닫기 관련 함수들
 * @returns {Function} handleLinkModalClose - 닫기 버튼 클릭 시 호출되는 핸들러
 * 
 * @example
 * const { handleLinkModalClose } = useLinkModalClose();
 * 
 * <Button onClick={handleLinkModalClose}>닫기</Button>
 */
export const useLinkModalClose = () => {
  const { openModal, closeModal, closeAllModals } = useModal();

  /**
   * 닫기 버튼 클릭 핸들러
   * - 등록취소 확인 모달을 2중 모달로 표시
   */
  const handleLinkModalClose = useCallback(() => {
    // 등록취소 확인 모달 열기
    const confirmationModalId = openModal(
      <div data-testid="cancel-confirmation-modal">
        <Modal
          variant="info"
          actions="dual"
          theme="light"
          title="등록을 취소하시겠습니까?"
          description="작성 중인 내용은 저장되지 않습니다."
          secondaryButtonText="계속작성"
          primaryButtonText="등록취소"
          onSecondaryClick={() => {
            // 계속작성: 등록취소모달(자식)만 닫기
            closeModal(confirmationModalId);
          }}
          onPrimaryClick={() => {
            // 등록취소: 모든 모달 닫기 (등록취소모달 + 일기쓰기모달)
            closeAllModals();
          }}
        />
      </div>
    );
  }, [openModal, closeModal, closeAllModals]);

  return { handleLinkModalClose };
};
