'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export interface SearchbarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 검색바의 시각적 스타일 variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 검색바의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
}

/**
 * Searchbar 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 * 
 * Figma 기준 (primary-medium-light):
 * - 노드 ID: 3:1566
 * - 크기: 320×48px, borderRadius: 100px (둥근 모서리)
 * - 테두리: #C7C7C7, 배경: 투명
 * - 검색 아이콘: 24×24px
 * - placeholder: "검색어를 입력해 주세요.", color: #ABABAB
 * - font: Pretendard Variable, Medium (500), 16px, line-height: 24px
 */
export const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
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
    // 클래스명 조합 함수 (외부 라이브러리 없이 구현)
    const getClassName = (...classes: (string | undefined | false)[]) => {
      return classes.filter(Boolean).join(' ');
    };

    // variant, size, theme 조합 클래스명 생성
    const searchbarClassName = getClassName(
      styles.searchbar,
      styles[variant],
      styles[size],
      styles[theme],
      className
    );

    // size에 따른 아이콘 크기 결정
    const iconSize = size === 'small' ? 18 : size === 'large' ? 28 : 24;

    return (
      <div className={searchbarClassName}>
        <div className={styles.iconWrapper}>
          <Image
            src="/icons/search_outline_light_m.svg"
            alt="search"
            width={iconSize}
            height={iconSize}
            className={styles.searchIcon}
          />
        </div>
        <input
          ref={ref}
          type="text"
          className={styles.input}
          placeholder="검색어를 입력해 주세요."
          {...props}
        />
      </div>
    );
  }
);

Searchbar.displayName = 'Searchbar';

// 기본 export
export default Searchbar;


