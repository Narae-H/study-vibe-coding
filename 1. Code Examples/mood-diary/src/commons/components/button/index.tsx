import React from 'react';
import styles from './styles.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일 variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 버튼의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * 버튼 내용
   */
  children: React.ReactNode;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;
  
  /**
   * 버튼 앞에 표시할 아이콘
   */
  icon?: React.ReactNode;
  
  /**
   * 아이콘 위치
   */
  iconPosition?: 'left' | 'right';
}

/**
 * Button 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large  
 * - theme: light, dark
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  children,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    className,
  ].filter(Boolean).join(' ');

  const renderContent = () => {
    if (!icon) return children;
    
    if (iconPosition === 'left') {
      return (
        <>
          <span className={styles.icon}>{icon}</span>
          {children}
        </>
      );
    } else {
      return (
        <>
          {children}
          <span className={styles.icon}>{icon}</span>
        </>
      );
    }
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
