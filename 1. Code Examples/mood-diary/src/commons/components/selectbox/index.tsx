'use client';

import React, { forwardRef, SelectHTMLAttributes, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export interface SelectboxProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
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
  
  /**
   * 선택된 값
   */
  value?: string;
  
  /**
   * 값 변경 핸들러
   */
  onChange?: (value: string) => void;
}

/**
 * Selectbox 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 커스텀 드롭다운 selectbox 컴포넌트입니다.
 * 완전한 variant 시스템과 키보드 접근성을 제공합니다.
 * 
 * @param variant - 시각적 스타일 variant ('primary' | 'secondary' | 'tertiary')
 * @param size - 컴포넌트 크기 ('small' | 'medium' | 'large')
 * @param theme - 테마 모드 ('light' | 'dark')
 * @param options - 선택 가능한 옵션 목록
 * @param placeholder - 기본 표시 텍스트
 * @param value - 현재 선택된 값
 * @param onChange - 값 변경 시 호출되는 콜백 함수
 * @param disabled - 비활성화 상태
 * @returns JSX.Element
 */
export const Selectbox = forwardRef<HTMLDivElement, SelectboxProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      options = [],
      placeholder = '전체',
      disabled = false,
      value,
      onChange,
      className
    },
    ref
  ) => {
    // 드롭다운 열림/닫힘 상태
    const [isOpen, setIsOpen] = useState(false);
    // 현재 선택된 값 상태
    const [selectedValue, setSelectedValue] = useState(value || '');
    // 드롭다운 컨테이너 참조
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 감지
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // value prop 변경 감지
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    // 템플릿 리터럴 방식으로 클래스명 조합 (Button 컴포넌트와 동일한 패턴)
    const selectboxClasses = [
      styles.selectbox,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      disabled && styles.disabled,
      isOpen && styles.open,
      className,
    ].filter(Boolean).join(' ');

    /**
     * 드롭다운 토글 핸들러
     */
    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    /**
     * 옵션 선택 핸들러
     * @param optionValue - 선택된 옵션의 값
     */
    const handleOptionClick = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      onChange?.(optionValue);
    };

    // 현재 선택된 옵션 찾기
    const selectedOption = options.find(option => option.value === selectedValue);
    // 표시할 텍스트 결정
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
      <div ref={dropdownRef} className={selectboxClasses}>
        <div
          ref={ref}
          className={styles.selectButton}
          onClick={handleToggle}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <span className={styles.selectedText}>{displayText}</span>
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
        
        {isOpen && (
          <div className={styles.dropdown} role="listbox">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <div
                  key={option.value}
                  className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className={styles.optionText}>{option.label}</span>
                  {isSelected && (
                    <div className={styles.checkIcon}>
                      <Image
                        src="/icons/check_outline_light_xs.svg"
                        alt="selected"
                        width={16}
                        height={16}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;

