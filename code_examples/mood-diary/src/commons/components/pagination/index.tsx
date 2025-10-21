import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 현재 페이지 번호 (1부터 시작)
   */
  currentPage: number;
  
  /**
   * 전체 페이지 수
   */
  totalPages: number;
  
  /**
   * 페이지 변경 핸들러
   */
  onPageChange: (page: number) => void;
  
  /**
   * 페이지네이션의 시각적 스타일 variant
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 페이지네이션의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 테마 모드
   */
  theme?: 'light' | 'dark';
  
  /**
   * 최대 표시할 페이지 번호 개수 (기본값: 5)
   */
  maxPages?: number;
}

/**
 * Pagination 컴포넌트
 * 
 * Figma 디자인을 기반으로 한 완전한 variant 시스템을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 * 
 * Figma 기준 (primary-medium-light):
 * - 노드 ID: 425:2243 (page nation)
 * - 현재 페이지: 배경 #f2f2f2, 텍스트 #000000, font-weight 500
 * - 일반 페이지: 투명 배경, 텍스트 #777777, font-weight 400
 * - 크기: 32×32px, borderRadius: 8px, fontSize: 16px
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  maxPages = 5,
  className,
  style,
  ...props
}) => {
  /**
   * 현재 페이지를 중심으로 표시할 페이지 번호 배열 생성
   */
  const getPageNumbers = () => {
    const pages: number[] = [];
    const halfMax = Math.floor(maxPages / 2);
    
    let startPage = Math.max(1, currentPage - halfMax);
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    // 전체 페이지가 maxPages보다 적을 때 시작 페이지 조정
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  
  /**
   * 이전 페이지로 이동
   */
  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };
  
  /**
   * 다음 페이지로 이동
   */
  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };
  
  /**
   * 특정 페이지로 이동
   */
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };
  
  const paginationClasses = [
    styles.pagination,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={paginationClasses} style={style} {...props}>
      {/* 이전 버튼 */}
      <button
        className={`${styles.arrowButton} ${isFirstPage ? styles.disabled : ''}`}
        onClick={handlePrevious}
        disabled={isFirstPage}
        aria-label="이전 페이지"
      >
        <Image
          src={isFirstPage ? '/icons/leftdisabled_outline_light_m.svg' : '/icons/leftenable_outline_light_m.svg'}
          alt="이전"
          width={24}
          height={24}
        />
      </button>
      
      {/* 페이지 번호들 */}
      <div className={styles.pageNumbers}>
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
            onClick={() => handlePageClick(page)}
            aria-label={`페이지 ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      
      {/* 다음 버튼 */}
      <button
        className={`${styles.arrowButton} ${isLastPage ? styles.disabled : ''}`}
        onClick={handleNext}
        disabled={isLastPage}
        aria-label="다음 페이지"
      >
        <Image
          src={isLastPage ? '/icons/rightdisabled_outline_light_m.svg' : '/icons/rightenable_outline_light_m.svg'}
          alt="다음"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default Pagination;
