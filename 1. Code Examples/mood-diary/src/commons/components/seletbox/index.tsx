'use client';

import React, { forwardRef, SelectHTMLAttributes } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export interface SelectboxProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * 셀렉트박스의 시각적 스타일 variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 셀렉트박스의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * 옵션 목록
   */
  options?: Array<{ value: string; label: string }>;
  
  /**
   * placeholder 텍스트
   */
  placeholder?: string;
}

/**
 * Selectbox 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
export const Selectbox = forwardRef<HTMLSelectElement, SelectboxProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      options = [],
      placeholder = '전체',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    // 템플릿 리터럴 방식으로 클래스명 조합 (Button 컴포넌트와 동일한 패턴)
    const selectboxClasses = [
      styles.selectbox,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      disabled && styles.disabled,
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={selectboxClasses}>
        <select
          ref={ref}
          className={styles.select}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.iconWrapper}>
          <Image
            src="/icons/arrow_drop_down.svg"
            alt="dropdown"
            width={24}
            height={24}
            className={styles.dropdownIcon}
          />
        </div>
      </div>
    );
  }
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;

