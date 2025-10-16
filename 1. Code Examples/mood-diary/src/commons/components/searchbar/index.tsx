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
    // 템플릿 리터럴 방식으로 클래스명 조합 (Button 컴포넌트와 동일한 패턴)
    const searchbarClassName = [
      styles.searchbar,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={searchbarClassName}>
        <div className={styles.iconWrapper}>
          <Image
            src="/icons/search_outline_light_m.svg"
            alt="search"
            width={24}
            height={24}
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


