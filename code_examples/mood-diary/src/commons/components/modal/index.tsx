import React from 'react';
import { Button } from '../button';
import styles from './styles.module.css';

/**
 * Modal 기본 props
 */
interface BaseModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 모달의 variant 타입
   */
  variant?: 'info' | 'danger';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * 모달 타이틀
   */
  title: string;
  
  /**
   * 모달 설명 텍스트
   */
  description: string;
  
  /**
   * 주요 액션 버튼 텍스트
   */
  primaryButtonText: string;
  
  /**
   * 주요 액션 버튼 클릭 핸들러
   */
  onPrimaryClick?: () => void;
  
  /**
   * 모달이 열려있는지 여부
   */
  isOpen?: boolean;
}

/**
 * Single action Modal props
 */
interface SingleActionModalProps extends BaseModalProps {
  /**
   * 액션 버튼 타입
   */
  actions?: 'single';
  
  /**
   * 보조 액션 버튼 텍스트 (single에서는 사용 불가)
   */
  secondaryButtonText?: never;
  
  /**
   * 보조 액션 버튼 클릭 핸들러 (single에서는 사용 불가)
   */
  onSecondaryClick?: never;
}

/**
 * Dual actions Modal props
 */
interface DualActionModalProps extends BaseModalProps {
  /**
   * 액션 버튼 타입
   */
  actions: 'dual';
  
  /**
   * 보조 액션 버튼 텍스트 (dual에서는 필수)
   */
  secondaryButtonText: string;
  
  /**
   * 보조 액션 버튼 클릭 핸들러
   */
  onSecondaryClick?: () => void;
}

/**
 * Modal props
 * 
 * actions 타입에 따라 secondaryButtonText가 필수 또는 사용 불가
 */
export type ModalProps = SingleActionModalProps | DualActionModalProps;

/**
 * Modal 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: info, danger
 * - actions: single, dual
 * - theme: light, dark
 * 
 * modal.provider와 함께 사용하며, 자체 backdrop 스타일을 생성하지 않습니다.
 */
export const Modal: React.FC<ModalProps> = ({
  variant = 'info',
  actions = 'single',
  theme = 'light',
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  isOpen = true,
  className,
  style,
  ...props
}) => {
  if (!isOpen) return null;

  // 템플릿 리터럴 방식으로 클래스명 조합 (Button 컴포넌트와 동일한 패턴)
  const modalClasses = [
    styles.modal,
    styles[`variant-${variant}`],
    styles[`theme-${theme}`],
    className,
  ].filter(Boolean).join(' ');

  const titleClasses = [
    styles.title,
    styles[`title-variant-${variant}`],
    styles[`title-theme-${theme}`],
  ].filter(Boolean).join(' ');

  const descriptionClasses = [
    styles.description,
    styles[`description-theme-${theme}`],
  ].filter(Boolean).join(' ');

  const buttonAreaClasses = [
    styles.buttonArea,
    styles[`buttonArea-${actions}`],
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={modalClasses} 
      style={style} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...props}
    >
      <div className={styles.content}>
        <h2 id="modal-title" className={titleClasses}>{title}</h2>
        <p id="modal-description" className={descriptionClasses}>{description}</p>
      </div>
      
      <div className={buttonAreaClasses}>
        {actions === 'dual' && (
          <Button
            variant="secondary"
            size="large"
            theme="light"
            onClick={onSecondaryClick}
            className={styles.dualButton}
          >
            {secondaryButtonText}
          </Button>
        )}
        <Button
          variant="primary"
          size="large"
          theme="light"
          onClick={onPrimaryClick}
          className={actions === 'dual' ? styles.dualButton : styles.singleButton}
        >
          {primaryButtonText}
        </Button>
      </div>
    </div>
  );
};

export default Modal;

