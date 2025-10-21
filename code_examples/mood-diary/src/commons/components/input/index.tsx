'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import styles from './styles.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input의 시각적 스타일 variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Input의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
}

/**
 * Input 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large  
 * - theme: light, dark
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      ...props
    },
    ref
  ) => {
    // 템플릿 리터럴 방식으로 클래스명 조합 (Button 컴포넌트와 동일한 패턴)
    const inputClasses = [
      styles.input,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      className,
    ].filter(Boolean).join(' ');

    return (
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
