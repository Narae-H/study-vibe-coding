import React from 'react';
import styles from './DeleteModal.module.css';

/**
 * 삭제 모달 Props
 */
interface DeleteModalProps {
  /**
   * 취소 버튼 클릭 핸들러
   */
  onCancel: () => void;
  
  /**
   * 삭제 버튼 클릭 핸들러
   */
  onDelete: () => void;
}

/**
 * 일기 삭제 모달 컴포넌트
 * 
 * Figma 디자인(노드ID: 62:2550)을 기반으로 구현된 삭제 확인 모달입니다.
 * - 480px × 200px
 * - 24px border-radius
 * - Dual action buttons (취소, 삭제)
 * 
 * @param onCancel - 취소 버튼 클릭 시 실행될 함수
 * @param onDelete - 삭제 버튼 클릭 시 실행될 함수
 */
export const DeleteModal: React.FC<DeleteModalProps> = ({ onCancel, onDelete }) => {
  return (
    <div className={styles.modal} data-testid="delete-modal">
      {/* 텍스트 영역 */}
      <div className={styles.content}>
        <h2 className={styles.title}>일기 삭제</h2>
        <p className={styles.description}>일기를 삭제 하시겠어요?</p>
      </div>
      
      {/* 버튼 영역 */}
      <div className={styles.buttonArea}>
        {/* 취소 버튼 */}
        <button
          className={styles.cancelButton}
          onClick={onCancel}
          data-testid="delete-modal-cancel-button"
        >
          취소
        </button>
        
        {/* 삭제 버튼 */}
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          data-testid="delete-modal-delete-button"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;

