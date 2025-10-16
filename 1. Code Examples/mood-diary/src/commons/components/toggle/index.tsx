import React from 'react';
import styles from './styles.module.css';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /**
   * 토글의 시각적 스타일 variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 토글의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * 체크 상태
   */
  checked?: boolean;
  
  /**
   * 체크 상태 변경 핸들러
   */
  onChange?: (checked: boolean) => void;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
}

/**
 * Toggle 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large  
 * - theme: light, dark
 */
export const Toggle: React.FC<ToggleProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  checked = false,
  onChange,
  disabled = false,
  className,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  const wrapperClasses = [
    styles.toggle,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    checked && styles.checked,
    disabled && styles.disabled,
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={wrapperClasses}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <span className={styles.slider}>
        <span className={styles.thumb}></span>
      </span>
    </label>
  );
};

export default Toggle;

