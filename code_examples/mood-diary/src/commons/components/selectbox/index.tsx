import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export interface SelectOption {
  /**
   * 옵션의 고유값
   */
  value: string;
  
  /**
   * 옵션의 표시 레이블
   */
  label: string;
}

export interface SelectboxProps {
  /**
   * Selectbox의 시각적 스타일 variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Selectbox의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * 선택 가능한 옵션 목록
   */
  options: SelectOption[];
  
  /**
   * 현재 선택된 값
   */
  value?: string;
  
  /**
   * 기본 선택 값
   */
  defaultValue?: string;
  
  /**
   * 값 변경 시 호출되는 콜백
   */
  onChange?: (value: string) => void;
  
  /**
   * placeholder 텍스트
   */
  placeholder?: string;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
  
  /**
   * 테스트용 data-testid
   */
  'data-testid'?: string;
}

/**
 * Selectbox 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
export const Selectbox: React.FC<SelectboxProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  className,
  'data-testid': dataTestId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(controlledValue ?? defaultValue ?? '');
  const containerRef = useRef<HTMLDivElement>(null);

  // Controlled component 지원
  const value = controlledValue !== undefined ? controlledValue : selectedValue;

  // 선택된 옵션 찾기
  const selectedOption = options.find(option => option.value === value);

  /**
   * 드롭다운 토글
   */
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  /**
   * 옵션 선택 핸들러
   */
  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    onChange?.(optionValue);
  };

  /**
   * 외부 클릭 감지하여 드롭다운 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const containerClasses = [
    styles.selectbox,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    disabled && styles.disabled,
    className,
  ].filter(Boolean).join(' ');

  const buttonClasses = [
    styles.button,
    isOpen && styles.open,
  ].filter(Boolean).join(' ');

  const listClasses = [
    styles.list,
    isOpen && styles.open,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} ref={containerRef} data-testid={dataTestId}>
      <button
        type="button"
        className={buttonClasses}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.buttonText}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.icon}>
          <Image
            src="/icons/arrow_drop_down.svg"
            alt="dropdown"
            width={24}
            height={24}
          />
        </span>
      </button>
      
      {isOpen && (
        <div className={listClasses} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            const itemClasses = [
              styles.item,
              isSelected && styles.selected,
            ].filter(Boolean).join(' ');

            return (
              <div
                key={option.value}
                className={itemClasses}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={isSelected}
              >
                <span className={styles.itemText}>{option.label}</span>
                {isSelected && (
                  <span className={styles.checkIcon}>
                    <Image
                      src="/icons/check_outline_light_xs.svg"
                      alt="selected"
                      width={16}
                      height={16}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Selectbox;

